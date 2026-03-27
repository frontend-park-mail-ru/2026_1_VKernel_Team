/**
* Главный файл приложения
* Здесь вся логика: роутинг (переходы между страницами),
* отрисовка страниц, обработка кликов и т.д.
*
* @module app
*/

import { AuthService } from "./services/authService.js";
import { AuthValidator } from "./validators/authValidator.js";
import { apiClient, API_ENDPOINTS } from "./api/apiClient.js";
import { CONFIG } from "./core/config.js";


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
    templates: {},
    currentView: 'main-page',
    isAuthenticated: false,
    user: null,

    UI_CONSTANTS: {
        DEFAULT_AVATAR: '/images/default-avatar.jpg',
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
        EYE_OPEN: '/images/icons/Eye.jpeg',
        EYE_CLOSED: '/images/icons/Eye-off.jpeg',
        LOADER_HTML: '<div class="loader"></div>'
    },

    /**
    * Инициализация приложения - запускается при загрузке страницы
    * Загружает шаблоны, проверяет авторизацию, настраивает обработчики
    * @async
    */
    async init() {
        await this.loadTemplates();
        await this.checkAuth();
        this.setupGlobalHandlers(); // вешаем один раз: data-nav и data-action
        this.router();
        // Слушаем изменения истории браузера (кнопки "назад"/"вперед")
        window.addEventListener('popstate', () => this.router());
    },

    async loadTemplates() {
        const templateNames = [
            'auth-links',
            'login-forms',
            'register-form',
            'user-profile',
            'main-page',
            'not-found'
        ];

        // Загружаем каждый шаблон
        for (const name of templateNames) {
            // Запрашиваем файл с сервера
            const response = await fetch(`src/templates/${name}.hbs`);
            // Получаем текст шаблона
            const source = await response.text();
            // Компилируем (превращаем в функцию) и сохраняем
            this.templates[name] = Handlebars.compile(source);
        }

        Handlebars.registerHelper('formatPrice', (price) => {
            return price === 0 || price === '0' ? 'Бесплатно' : price + ' ₽';
        });

        Handlebars.registerHelper('ifAuthenticated', function (options) {
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
                this.renderMain();
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
    },

    // Переход на другую страницу без перезагрузки (SPA)
    navigateTo(path) {
        window.history.pushState({}, '', path);
        this.router();
    },

    async renderMain() {
        // Убираем специальный класс для страниц авторизации
        document.body.classList.remove('auth-page');

        // Получаем контейнер, куда будем рендерить
        const app = document.getElementById('app');

        // Загружаем все объявления с сервера
        const adsResult = await apiClient.get(API_ENDPOINTS.ADS.GET_ALL);
        const ads = adsResult.success ? adsResult.data : [];

        // Форматируем каждое объявление для отображения
        const formattedAds = ads.map(ad => this.formatAdCard(ad));

        // Рендерим главную страницу с данными
        app.innerHTML = this.templates['main-page']({
            isAuthenticated: this.isAuthenticated,
            user: this.user,
            recommendations: formattedAds
        });
        // Навешиваем обработчики на элементы главной страницы
        this.attachMainEventListeners();
    },

    formatAdCard(ad) {
        let imageUrl = this.UI_CONSTANTS.DEFAULT_AD_IMAGE;

        if (ad.photos && ad.photos.length > 0) {
            const photoPath = ad.photos[0];
            // Проверяем: если путь уже начинается с http/https, используем его,
            // иначе подклеиваем базовый URL нашего бэкенда/хранилища.
            imageUrl = photoPath.startsWith('http')
                ? photoPath
                : `${CONFIG.API.BASE_URL}${photoPath}`;
        }

        return {
            ...ad,
            formattedPrice: ad.price === 0 ? 'Бесплатно' : ad.price + ' ₽',
            mainPhoto: imageUrl,
            image: imageUrl,
            views: ad.views_count || 0,
            createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : ''
        };
    },

    //страница 404
    renderNotFound() {
        document.getElementById('app').innerHTML = this.templates['not-found']();
    },

    // Обработчиков кликов на главной странице
    attachMainEventListeners() {
        const profileIcon = document.querySelector('.profile-icon');
        profileIcon?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo(this.isAuthenticated ? '/profile' : '/login');
        });

        const placeAdBtn = document.querySelector('.place-ad-btn');
        if (placeAdBtn) {
            placeAdBtn.disabled = true;
            placeAdBtn.title = 'Функция временно недоступна';
        }

        document.querySelectorAll('.ad-card').forEach(card => {
            card.addEventListener('click', () => {
                const adId = card.dataset.id;
            });
        });
    },

    /**
    * Обработчик вызывается один раз при старте приложения
    * и навешивается один раз на весь документ
    */
    setupGlobalHandlers() {
        document.addEventListener('click', (e) => {
            // Обрабатываем ТОЛЬКО data-nav и data-action
            // Все остальные клики (включая кнопки форм) игнорируем
            const navElement = e.target.closest('[data-nav]');
            if (navElement) {
                e.preventDefault();
                const path = navElement.dataset.nav;
                this.navigateTo(path);
                return;
            }

            const actionElement = e.target.closest('[data-action]');
            if (actionElement) {
                e.preventDefault();
                const action = actionElement.dataset.action;
                switch (action) {
                    case 'logout':
                        this.logout();
                        break;
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
                input: document.querySelector('#password'),
                toggle: document.querySelector('#togglePassword'),
                eye: document.querySelector('#eyeIcon')
            },
            confirm: {
                input: document.querySelector('#confirm-password'),
                toggle: document.querySelector('#toggleConfirmPassword'),
                eye: document.querySelector('#eyeIconConfirm')
            }
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

    /**
    * Отображение страницы профиля пользователя
    */
    showProfile() {
        document.body.classList.add('auth-page');
        document.getElementById('app').innerHTML = this.templates['user-profile']({
            email: this.user?.email || 'Неизвестно',
            name: this.user?.name || this.user?.email?.split('@')[0] || 'Пользователь',
            registeredAt: this.user?.created_at
                ? new Date(this.user.created_at).toLocaleDateString('ru-RU')
                : 'неизвестно',
            avatar: this.UI_CONSTANTS.DEFAULT_AVATAR
        });
    },

    /**
    * Отображение страницы входа
    * @param {string} error - текст ошибки (если есть)
    * @param {Object} formData - сохранённые данные формы (email)
    */
    showLogin(error, formData) {
        this.currentView = 'login';
        document.body.classList.add('auth-page');
        document.getElementById('app').innerHTML = this.templates['login-forms']({
            error: error,
            email: formData?.email || ''
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
    showRegister(error, success, formData) {
        this.currentView = 'register';
        document.body.classList.add('auth-page');
        document.getElementById('app').innerHTML = this.templates['register-form']({
            error: error,
            success: success,
            name: formData?.name || '',
            email: formData?.email || ''
        });

        this.attachRegisterHandler();
        this.initPasswordToggles();
    },

    /**
    * Обработка отправки формы входа
    * @param {Event} e - событие отправки формы
    * @async
    */
    async handleLoginSubmit(e) {
        e.preventDefault(); // отменяем стандартную отправку формы

        // Получаем значения из полей
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Валидируем на клиенте
        const validation = AuthValidator.validateLogin(email, password);

        // Очищаем старые ошибки
        this.clearFieldErrors();
        this.clearLoginError();

        // Если валидация не прошла
        if (!validation.isValid) {
            this.showFieldErrors({ email: ' ', password: ' ' });
            this.showLoginError('Неверный email или пароль');
            return;
        }

        this.showLoading(true);
        const result = await AuthService.login({ email, password });
        this.showLoading(false);

        if (result.success) {
            this.isAuthenticated = true;
            this.user = result.data;

            this.showSuccessMessage('Вход выполнен!');
            this.navigateTo('/');
            return;
        }

        if (result.fieldErrors) {
            this.showFieldErrors(result.fieldErrors);
        } else {
            this.showFieldErrors({ email: ' ', password: ' ' });
        }
        this.showLoginError(result.error || 'Неверный email или пароль');
    },

    /**
    * Обработка отправки формы регистрации
    * @param {Event} e - событие отправки формы
    * @async
    */
    async handleRegisterSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        const validation = AuthValidator.validateRegister(name, email, password, confirmPassword);

        // Очищаем старые ошибки
        this.clearFieldErrors();
        this.clearMessages();

        // Если клиентская валидация не прошла
        if (!validation.isValid) {
            this.showFieldErrors(validation.fieldErrors);
            return;
        }

        this.showLoading(true);
        const result = await AuthService.register({ name, email, password });
        this.showLoading(false);

        if (!result.success && result.fieldErrors) {
            this.showFieldErrors(result.fieldErrors);
            return;
        }

        if (!result.success) {
            this.showGeneralError(result.error || 'Ошибка при регистрации');
            return;
        }

        this.isAuthenticated = true;
        this.user = result.data;

        this.showSuccessMessage('Регистрация успешна!');
        this.navigateTo('/');
    },


    attachLoginHandler() {
        const form = document.getElementById('login-forms');
        if (!form) return;

        if (this._loginHandler) {
            form.removeEventListener('submit', this._loginHandler);
        }

        this._loginHandler = this.handleLoginSubmit.bind(this);
        form.addEventListener('submit', this._loginHandler);
    },

    attachRegisterHandler() {
        const form = document.getElementById('register-form');
        if (!form) return;

        if (this._registerHandler) {
            form.removeEventListener('submit', this._registerHandler);
        }

        this._registerHandler = this.handleRegisterSubmit.bind(this);
        form.addEventListener('submit', this._registerHandler);
    },

    /**
    * Очистка ошибок на странице логина
    */
    clearLoginError() {
        document.querySelectorAll('.login-error, .alert-error').forEach(el => el.remove());

        ['email', 'password'].forEach(id => {
            document.getElementById(id)?.classList.remove('error');
        });
    },

    /**
    * Показ ошибки на странице логина
    * @param {string} message - текст ошибки
    */
    showLoginError(message) {
        this.clearLoginError();

        ['email', 'password'].forEach(id => {
            document.getElementById(id)?.classList.add('error');
        });

        const form = document.getElementById('login-forms');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'login-error alert alert-error';
        errorDiv.textContent = message;
        form.parentNode.insertBefore(errorDiv, form);
    },

    // Очистка всех ошибок полей на странице
    clearFieldErrors() {
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    },

    // Очистка всех сообщений (алертов)
    clearMessages() {
        document.querySelectorAll('.alert').forEach(el => el.remove());
    },

    /**
    * Показ ошибок под конкретными полями
    * @param {Object} fieldErrors - объект с ошибками для каждого поля
    */
    showFieldErrors(fieldErrors) {
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
                    input.parentNode.appendChild(errorDiv);
                }
            }
        });
    },

    showSuccessMessage(message) {
        const form = document.getElementById('register-form') || document.getElementById('login-forms');
        if (!form) return;

        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        form.appendChild(successDiv);

        setTimeout(() => successDiv.remove(), 3000);
    },

    /**
    * Показ общей ошибки
    * @param {string} message - текст ошибки
    */
    showGeneralError(message) {
        const form = document.getElementById('register-form') || document.getElementById('login-forms');
        if (!form) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        form.appendChild(errorDiv);
    },

    showLoading(show) {
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
        this.showLoading(false);
        // Обновляем состояние авторизации
        await this.checkAuth();

        // Наводимся на главную и всегда перерендериваем её.
        if (window.location.pathname !== '/') {
            this.navigateTo('/');
            return;
        }

        // Уже на главной — просто перерендериваем
        this.renderMain();
    },

    formatDate(dateString) {
        return dateString ? new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) : '';
    }
};

// App.init() вызывается из main.js (точка входа).
// Не добавляй сюда лишний DOMContentLoaded — это приведёт к двойной инициализации.

export { App };
