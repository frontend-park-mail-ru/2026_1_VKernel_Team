/**
* Главный файл приложения
* Здесь вся логика: роутинг (переходы между страницами),
* отрисовка страниц, обработка кликов и т.д.
*
* @module app
*/

import Handlebars from 'handlebars';
import { AuthService } from '@/services/authService';
import { AuthValidator } from '@/validators/authValidator';
import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import { CONFIG } from '@/core/config';
import type { User } from '@/types';

type HandlebarsTemplateFunction = (context?: any) => string;

/**
* Главный объект приложения
* Содержит все методы для работы с интерфейсом
*
* @property {Object} templates - тут хранятся скомпилированные шаблоны Handlebars
* @property {string} currentView - название текущей страницы (main-page, login и т.д.)
* @property {boolean} isAuthenticated - залогинен ли пользователь
* @property {Object} user - данные текущего пользователя
*/
const App = {
    templates: {} as Record<string, HandlebarsTemplateFunction>,
    currentView: 'main-page' as string,
    isAuthenticated: false,
    user: null as User | null,

    UI_CONSTANTS: {
        DEFAULT_AVATAR: '/images/default-avatar.jpg',
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
        EYE_OPEN: '/images/icons/Eye.jpeg',
        EYE_CLOSED: '/images/icons/Eye-off.jpeg',
        LOADER_HTML: '<div class="loader"></div>',
    },

    /**
    * Инициализация приложения - запускается при загрузке страницы
    * Загружает шаблоны, проверяет авторизацию, настраивает обработчики
    * @async
    */
    async init() {
        await this.loadTemplates();
        await this.checkAuth();
        this.setupGlobalHandlers();
        this.router();
        window.addEventListener('popstate', () => this.router());
    },

    async loadTemplates() {
        const templateNames = [
            'auth-links',
            'login-forms',
            'register-form',
            'user-profile',
            'main-page',
            'not-found',
        ];

        for (const name of templateNames) {
            const response = await fetch(`/templates/${name}.hbs`);
            const source = await response.text();
            this.templates[name] = Handlebars.compile(source);
        }

        Handlebars.registerHelper('formatPrice', (price: number) => {
            return price === 0 ? 'Бесплатно' : price.toLocaleString('ru-RU') + ' ₽';
        });

        Handlebars.registerHelper('ifAuthenticated', function(this: any, options: Handlebars.HelperOptions) {
            return App.isAuthenticated ? options.fn(this) : options.inverse(this);
        });

        Handlebars.registerHelper('user', () => this.user);
    },

    /**
    * Проверка авторизации пользователя
    * Смотрит в localStorage и обновляет this.isAuthenticated и this.user
    */
    async checkAuth() {
        const result = await AuthService.check();
        this.isAuthenticated = result.isAuthenticated;
        this.user = result.user;
    },

    /**
    * Роутер - определяет, какую страницу показать по URL
    * Смотрит на window.location.pathname и вызывает нужный метод
    */
    async router() {
        const path = window.location.pathname;

        if (!this.isAuthenticated && ['/profile'].includes(path)) {
            this.navigateTo('/login');
            return;
        }

        switch (path) {
            case '/':
            case '/index.html':
                await this.renderMain();
                break;
            case '/login':
                this.showLogin();
                break;
            case '/register':
                this.showRegister();
                break;
            case '/profile':
                this.showProfile();
                break;
            default:
                this.renderNotFound();
        }
        // Добавляет подвал, но его еще нужно правильно реализовать, я в процессе...
        // await this.renderFooter();
    },


    async navigateTo(path: string) {
        window.history.pushState({}, '', path);
        await this.router();
    },

    async renderMain() {
        // Убираем специальный класс для страниц авторизации
        document.body.classList.remove('auth-page');

        // Получаем контейнер, куда будем рендерить
        const app = document.getElementById('app');
        if (!app) return;

        // Загружаем все объявления с сервера
        const adsResult = await apiClient.get(API_ENDPOINTS.ADS.GET_ALL, {});
        const ads = adsResult.success ? adsResult.data : [];

        // Форматируем каждое объявление для отображения
        const formattedAds = ads.map((ad: any) => this.formatAdCard(ad));

        const template = this.templates['main-page'];
        if (!template) return;

        // Рендерим главную страницу с данными
        app.innerHTML = template({
            isAuthenticated: this.isAuthenticated,
            user: this.user,
            recommendations: formattedAds,
        });
        this.attachMainEventListeners();
    },

    async renderFooter() {
        // Проверяем, есть ли уже подвал
        if (document.querySelector('.footer')) {
            return;
        }
        
        try {
            if (!this.templates['footer']) {
                const response = await fetch('/templates/footer.hbs');
                const source = await response.text();
                this.templates['footer'] = Handlebars.compile(source);
            }
            
            const footerHtml = this.templates['footer']({});
            const app = document.getElementById('app');
            if (app && !document.querySelector('.footer')) {
                app.insertAdjacentHTML('afterend', footerHtml);
            }
        } catch (error) {
        }
    },

    formatAdCard(ad: any) {
        let imageUrl = this.UI_CONSTANTS.DEFAULT_AD_IMAGE;

        // Проверяем: если путь уже начинается с http/https, используем его,
        // иначе подклеиваем базовый URL нашего бэкенда/хранилища.
        if (ad.photos && ad.photos.length > 0) {
            const photoPath = ad.photos[0];
            imageUrl = photoPath.startsWith('http')
                ? photoPath
                : `${CONFIG.API.BASE_URL}${photoPath}`;
        }

        return {
            ...ad,
            formattedPrice: ad.price === 0 ? 'Бесплатно' : ad.price.toLocaleString('ru-RU') + ' ₽',
            mainPhoto: imageUrl,
            image: imageUrl,
            views: ad.views_count || 10,
            createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : '',
        };
    },

    renderNotFound() {
        const app = document.getElementById('app');
        if (!app) return;
        const template = this.templates['not-found'];
        if (!template) return;
        app.innerHTML = template();
    },

    attachMainEventListeners() {
        const profileIcon = document.querySelector('.profile-icon');
        profileIcon?.addEventListener('click', (e: Event) => {
            e.preventDefault();
            this.navigateTo(this.isAuthenticated ? '/profile' : '/login');
        });

        document.querySelectorAll('.ad-card').forEach((card: Element) => {
            card.addEventListener('click', () => {
                const adId = (card as HTMLElement).dataset.id;
                // TODO: использовать adId позже
            });
        });
    },

    /**
    * Обработчик вызывается один раз при старте приложения
    * и навешивается один раз на весь документ
    */
    setupGlobalHandlers() {
        document.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            const navElement = target.closest('[data-nav]');
            if (navElement) {
                e.preventDefault();
                const path = (navElement as HTMLElement).dataset.nav;
                if (path) this.navigateTo(path);
                return;
            }

            const actionElement = target.closest('[data-action]');
            if (actionElement) {
                e.preventDefault();
                const action = (actionElement as HTMLElement).dataset.action;
                if (action === 'logout') {
                    this.logout();
                }
                return;
            }
        });
    },

    /**
    * Инициализация кнопок показа/скрытия пароля
    * Ищет на странице поля пароля и вешает на них обработчики
    */
    initPasswordToggles() {
        const elements = {
            password: {
                input: document.querySelector('#password') as HTMLInputElement | null,
                toggle: document.querySelector('#togglePassword') as HTMLButtonElement | null,
                eye: document.querySelector('#eyeIcon') as HTMLImageElement | null,
            },
            confirm: {
                input: document.querySelector('#confirm-password') as HTMLInputElement | null,
                toggle: document.querySelector('#toggleConfirmPassword') as HTMLButtonElement | null,
                eye: document.querySelector('#eyeIconConfirm') as HTMLImageElement | null,
            },
        };

        Object.values(elements).forEach(({ input, toggle, eye }) => {
            if (input && toggle && eye) {
                toggle.addEventListener('click', () => {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    eye.src = isPassword ? this.UI_CONSTANTS.EYE_OPEN : this.UI_CONSTANTS.EYE_CLOSED;
                });
            }
        });
    },

    showProfile() {
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        if (!app) return;
        const template = this.templates['user-profile'];
        if (!template) return;
        app.innerHTML = template({
            email: this.user?.email || 'Неизвестно',
            name: this.user?.name || this.user?.email?.split('@')[0] || 'Пользователь',
            registeredAt: this.user?.created_at
                ? new Date(this.user.created_at).toLocaleDateString('ru-RU')
                : 'неизвестно',
            avatar: this.UI_CONSTANTS.DEFAULT_AVATAR,
        });
    },

    /**
    * Отображение страницы входа
    * @param {string} error - текст ошибки (если есть)
    * @param {Object} formData - сохранённые данные формы (email)
    */
    showLogin(error?: string, formData?: { email?: string }) {
        this.currentView = 'login';
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        if (!app) return;
        const template = this.templates['login-forms'];
        if (!template) return;
        app.innerHTML = template({
            error: error,
            email: formData?.email || '',
        });

        this.attachLoginHandler();
        this.initPasswordToggles();
    },

    /**
    * Отображение страницы регистрации
    * @param {string} error - текст ошибки (если есть)
    * @param {boolean} success - успешна ли регистрация
    * @param {Object} formData - сохранённые данные формы
    */
    showRegister(error?: string, success?: boolean, formData?: { name?: string; email?: string }) {
        this.currentView = 'register';
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        if (!app) return;
        const template = this.templates['register-form'];
        if (!template) return;
        app.innerHTML = template({
            error: error,
            success: success,
            name: formData?.name || '',
            email: formData?.email || '',
        });

        this.attachRegisterHandler();
        this.initPasswordToggles();
    },

    /**
    * Обработка отправки формы входа
    * @param {Event} e - событие отправки формы
    * @async
    */
    async handleLoginSubmit(e: Event) {
        e.preventDefault();

        const emailInput = document.getElementById('email') as HTMLInputElement | null;
        const passwordInput = document.getElementById('password') as HTMLInputElement | null;

        const email = emailInput?.value.trim() || '';
        const password = passwordInput?.value || '';

        const validation = AuthValidator.validateLogin(email, password);

        this.clearFieldErrors();
        this.clearLoginError();

        if (!validation.isValid) {
            this.showLoginError('Неверный email или пароль');
            return;
        }

        this.showLoading(true);
        const result = await AuthService.login({ email, password });

        if (result.success) {
            this.isAuthenticated = true;
            this.user = result.data;
            // // Ждем завершения навигации перед тем, как убрать лоадер
            // await this.navigateTo('/');

            // Меняем URL
            window.history.pushState({}, '', '/');
            // Вызываем router, НО он должен отрендерить главную, а не страницу входа
            await this.router();
            this.showLoading(false);
            return;
        }
        this.showLoading(false);
        this.showLoginError(result.error || 'Неверный email или пароль');
    },

    /**
    * Обработка отправки формы регистрации
    * @param {Event} e - событие отправки формы
    * @async
    */
    async handleRegisterSubmit(e: Event) {
        e.preventDefault();

        const nameInput = document.getElementById('name') as HTMLInputElement | null;
        const emailInput = document.getElementById('email') as HTMLInputElement | null;
        const passwordInput = document.getElementById('password') as HTMLInputElement | null;
        const confirmInput = document.getElementById('confirm-password') as HTMLInputElement | null;

        const name = nameInput?.value.trim() || '';
        const email = emailInput?.value.trim() || '';
        const password = passwordInput?.value || '';
        const confirmPassword = confirmInput?.value || '';

        const validation = AuthValidator.validateRegister(name, email, password, confirmPassword);

        this.clearFieldErrors();
        this.clearMessages();

        if (!validation.isValid) {
            const errors = validation.fieldErrors as Record<string, string | null>;
            this.showFieldErrors(errors);
            return;
        }

        this.showLoading(true);
        const result = await AuthService.register({ name, email, password });

        if (!result.success && result.fieldErrors) {
            this.showLoading(false);
            this.showFieldErrors(result.fieldErrors);
            return;
        }

        if (!result.success) {
            this.showLoading(false);
            this.showGeneralError(result.error || 'Ошибка при регистрации');
            return;
        }

        this.isAuthenticated = true;
        this.user = result.data;
        await this.navigateTo('/');
        this.showLoading(false);
    },

    attachLoginHandler() {
        const form = document.getElementById('login-forms') as HTMLFormElement | null;
        if (!form) return;

        if (this._loginHandler) {
            form.removeEventListener('submit', this._loginHandler);
        }

        this._loginHandler = this.handleLoginSubmit.bind(this);
        form.addEventListener('submit', this._loginHandler);
    },

    attachRegisterHandler() {
        const form = document.getElementById('register-form') as HTMLFormElement | null;
        if (!form) return;

        if (this._registerHandler) {
            form.removeEventListener('submit', this._registerHandler);
        }

        this._registerHandler = this.handleRegisterSubmit.bind(this);
        form.addEventListener('submit', this._registerHandler);
    },

    _loginHandler: null as ((e: Event) => void) | null,
    _registerHandler: null as ((e: Event) => void) | null,

    clearLoginError() {
        document.querySelectorAll('.login-error, .alert-error').forEach(el => el.remove());

        ['email', 'password'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('error');
        });
    },

    showLoginError(message: string) {
        this.clearLoginError();

        ['email', 'password'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('error');
        });

        const form = document.getElementById('login-forms');
        if (!form) return;

        // Удаляем старый блок ошибки, если он уже есть
        const existingError = form.parentNode?.querySelector('.login-error');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'login-error alert alert-error';
        errorDiv.textContent = message;
        form.parentNode?.insertBefore(errorDiv, form);
    },

    clearFieldErrors() {
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    },

    clearMessages() {
        document.querySelectorAll('.alert').forEach(el => el.remove());
    },

    // Исправлен тип параметра
    showFieldErrors(fieldErrors: Record<string, string | null>) {
        this.clearFieldErrors();

        Object.entries(fieldErrors).forEach(([field, error]) => {
            if (!error) return;

            const inputId = field === 'confirmPassword' ? 'confirm-password' : field;
            const input = document.getElementById(inputId);

            if (input) {
                input.classList.add('error');

                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = error;

                const wrapper = input.closest('.password-wrapper');
                if (wrapper) {
                    wrapper.after(errorDiv);
                } else {
                    input.parentNode?.appendChild(errorDiv);
                }
            }
        });
    },

    showSuccessMessage(message: string) {
        const form = document.getElementById('register-form') || document.getElementById('login-forms');
        if (!form) return;

        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        form.appendChild(successDiv);

        setTimeout(() => successDiv.remove(), 3000);
    },

    showGeneralError(message: string) {
        const form = document.getElementById('register-form') || document.getElementById('login-forms');
        if (!form) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        form.appendChild(errorDiv);
    },

    showLoading(show: boolean) {
        const loader = document.getElementById('global-loader');

        if (!show) {
            loader?.remove();
            return;
        }

        if (!loader) {
            const newLoader = document.createElement('div');
            newLoader.id = 'global-loader';
            newLoader.className = 'loader-overlay';
            newLoader.innerHTML = this.UI_CONSTANTS.LOADER_HTML;
            document.body.appendChild(newLoader);
        }
    },

    async logout() {
        this.showLoading(true);
        await AuthService.logout();
        await this.checkAuth();

        if (window.location.pathname !== '/') {
            await this.navigateTo('/');
        } else {
            await this.renderMain();
            // await this.renderFooter();
        }
        this.showLoading(false);
    },

    formatDate(dateString?: string) {
        return dateString ? new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }) : '';
    },
};

export { App };
