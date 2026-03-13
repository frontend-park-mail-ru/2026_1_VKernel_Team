/**
* Главный файл приложения
* Здесь вся логика: роутинг (переходы между страницами),
* отрисовка страниц, обработка кликов и т.д.
* 
* @module app
*/

import { AdsService } from "./services/adsServices.js";
import { AuthService } from "./services/authService.js";
import { Storage } from "./utils/storage.js";
import { AuthValidator } from "./validators/authValidator.js";


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

    /**
    * Инициализация приложения - запускается при загрузке страницы
    * Загружает шаблоны, проверяет авторизацию, настраивает обработчики
    * @async
    */
    async init() {
        await this.loadTemplates();
        // Проверяем, может пользователь уже залогинен (куки сохранились)
        if (!Storage.isAuthenticated()) {
            // Если нет в localStorage, проверяем на сервере
            const result = await AuthService.getCurrentUser();
            if (result.success && result.user) {
                Storage.setUser(result.user);
            }
        }

        this.checkAuth();
        this.setupGlobalHandlers();
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


        // Регистрируем helper для форматирования цены
        Handlebars.registerHelper('formatPrice', function(price) {
            if (price === 0 || price === '0') {
                return 'Бесплатно';
            }
            return price;
        });
    },

    /**
    * Проверка авторизации пользователя
    * Смотрит в localStorage и обновляет this.isAuthenticated и this.user
    */
    checkAuth() {
        this.isAuthenticated = Storage.isAuthenticated();
        this.user = Storage.getUser();
    },

    /**
    * Роутер - определяет, какую страницу показать по URL
    * Смотрит на window.location.pathname и вызывает нужный метод
    */
    router() {
        const path = window.location.pathname; // Получаем текущий путь

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
                if (this.isAuthenticated) {
                    this.showProfile();
                } else {
                    this.navigateTo('/login');
                }
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
        const adsResult = await AdsService.getAllAds();
        const ads = adsResult.success ? adsResult.ads : [];
        
        // Форматируем каждое объявление для отображения
        const formattedAds = ads.map(ad => AdsService.formatAdCard(ad));

        // Рендерим главную страницу с данными
        app.innerHTML = this.templates['main-page']({
            isAuthenticated: this.isAuthenticated,
            recommendations: formattedAds
        });
        
        // Навешиваем обработчики на элементы главной страницы
        this.attachMainEventListeners();
    },

    //страница 404
    renderNotFound() {
        const app = document.getElementById('app');
        app.innerHTML = this.templates['not-found']();
    },

    // Обработчиков кликов на главной странице
    attachMainEventListeners() {
        const profileIcon = document.querySelector('.profile-icon');
        if (profileIcon) {
            profileIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(this.isAuthenticated ? '/profile' : '/login');
            });
        }

        const placeAdBtn = document.querySelector('.place-ad-btn');
        if (placeAdBtn) {
            placeAdBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isAuthenticated) {
                    console.log('Форма размещения');
                } else {
                    this.navigateTo('/login');
                }
            });
        }
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
                switch(action) {
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
        const confirmInput = document.querySelector('#confirm-password');
        const passwordInput = document.querySelector('#password');
        const togglePassword = document.querySelector('#togglePassword');
        const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
        const eyeImg = document.querySelector('#eyeIcon');
        const eyeImgConfirm = document.querySelector('#eyeIconConfirm');

        // Проверяем, есть ли на странице основное поле пароля
        if (passwordInput && togglePassword) {
            togglePassword.addEventListener('click', () => {
                const isPassword = passwordInput.type === 'password';
                passwordInput.type = isPassword ? 'text' : 'password';
                eyeImg.src = isPassword ? 'images/icons/Eye.jpeg' : 'images/icons/Eye-off.jpeg';
            });
        }

        // Проверяем, есть ли на странице поле повтора пароля
        if (confirmInput && toggleConfirmPassword) { 
            toggleConfirmPassword.addEventListener('click', () => {
                const isPassword = confirmInput.type === 'password';
                confirmInput.type = isPassword ? 'text' : 'password';
                // Здесь нужна своя картинка для второй кнопки, иначе будет меняться первая
                eyeImgConfirm.src = isPassword ? 'images/icons/Eye.jpeg' : 'images/icons/Eye-off.jpeg';
            });
        }

    },

    /**
    * Отображение страницы профиля пользователя
    */
    showProfile() {
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        app.innerHTML = this.templates['user-profile']({
            email: this.user?.email || 'Неизвестно',
            username: this.user?.email?.split('@')[0] || 'Пользователь'
        });
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        const backBtn = document.querySelector('.back-link');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('/');
            });
        }
    },

    /**
    * Отображение страницы входа
    * @param {string} error - текст ошибки (если есть)
    * @param {Object} formData - сохранённые данные формы (email)
    */
    showLogin(error, formData) {
        this.currentView = 'login';
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        app.innerHTML = this.templates['login-forms']({
            error: error,
            email: formData?.email || ''
        });
        this.attachLoginHandler();
        this.initPasswordToggles();
        
        // Кнопка "На главную" через роутер
        const backLink = document.querySelector('.back-to-main a');
        if (backLink) {
            backLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('/');
            });
        }
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
        const app = document.getElementById('app');
        app.innerHTML = this.templates['register-form']({
            error: error,
            success: success,
            name: formData?.name || '',
            email: formData?.email || ''
        });
        this.attachRegisterHandler();
        this.initPasswordToggles()
        
        const backLink = document.querySelector('.back-to-main a');
        if (backLink) {
            backLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('/');
            });
        }
    },
    
    /**
    * Обработка отправки формы входа
    * @param {Event} e - событие отправки формы
    * @async
    */
    async handleLoginSubmit(e) {
        e.preventDefault(); // отменяем стандартную отправку формы
        
        // Получаем значения из полей
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Валидируем на клиенте
        const validation = AuthValidator.validateLogin(email, password);
        
        // Очищаем старые ошибки
        this.clearFieldErrors();
        this.clearLoginError();
        
        // Если валидация не прошла
        if (!validation.isValid) {
            // Подсвечиваем поля
            const fieldErrors = {
                email: ' ',
                password: ' '
            };
            this.showFieldErrors(fieldErrors);
            this.showLoginError('Неверный email или пароль');
            return;
        }
        
        // Отправляем запрос на сервер
        const result = await AuthService.login({ email, password });
        
        if (result.success) {
            // Если всё хорошо - обновляем статус и идём на главную
            this.checkAuth();
            this.navigateTo('/'); 
        } else {
            // Если ошибка - подсвечиваем поля
            const fieldErrors = {
                email: ' ',
                password: ' '
            };
            this.showFieldErrors(fieldErrors);
            this.showLoginError('Неверный email или пароль');
        }
    },

    /**
    * Обработка отправки формы регистрации
    * @param {Event} e - событие отправки формы
    * @async
    */
    async handleRegisterSubmit(e) {
        e.preventDefault();

        // Получаем все значения из формы
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Валидируем все поля
        const validation = AuthValidator.validateRegister(
            name, email, password, confirmPassword
        );

        // Очищаем старые ошибки
        this.clearFieldErrors();
        this.clearMessages();

        // Если клиентская валидация не прошла
        if (!validation.isValid) {
            this.showFieldErrors(validation.fieldErrors);
            return;
        }

        // Отправляем запрос на регистрацию
        const result = await AuthService.register({ name, email, password });

        if (!result.success) {
            // Если сервер вернул ошибки по полям
            if (result.fieldErrors) {
                this.showFieldErrors({
                    name: result.fieldErrors.name,
                    email: result.fieldErrors.email,
                    password: result.fieldErrors.password
                });
                return;
            }
            
            // Общая ошибка
            this.showGeneralError(result.error || 'Ошибка при регистрации');
            return;
        }

        // Регистрация успешна - пробуем сразу залогинить
        const loginResult = await AuthService.login({ email, password });

        if (loginResult.success) {
            // Если получилось - на главную
            this.checkAuth();
            this.navigateTo('/');
            return;
        }

        // Если не получилось залогиниться автоматически
        this.showSuccessMessage('Регистрация успешна! Теперь войдите в аккаунт.');
        setTimeout(() => this.navigateTo('/login'), 2000);
    },


    attachLoginHandler() {
        const form = document.getElementById('login-forms');
        if (!form) return;

        // Удаляем старый обработчик если есть
        if (this._loginHandler) {
            form.removeEventListener('submit', this._loginHandler);
        }

        // Привязываем вынесенный метод - новый обработчик
        this._loginHandler = this.handleLoginSubmit.bind(this);
        form.addEventListener('submit', this._loginHandler);
    },

    attachRegisterHandler() {
        const form = document.getElementById('register-form');
        if (!form) return;

        // Удаляем старый обработчик если есть
        if (this._registerHandler) {
            form.removeEventListener('submit', this._registerHandler);
        }

        // Привязываем вынесенный метод - новый обработчик
        this._registerHandler = this.handleRegisterSubmit.bind(this);
        form.addEventListener('submit', this._registerHandler);
    },

    /**
    * Очистка ошибок на странице логина
    */
    clearLoginError() {
        document.querySelectorAll('.login-error, .alert-error').forEach(el => el.remove());
        
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        
        if (emailField) emailField.classList.remove('error');
        if (passwordField) passwordField.classList.remove('error');
    },

    /**
    * Показ ошибки на странице логина
    * @param {string} message - текст ошибки
    */
    showLoginError(message) {
        this.clearLoginError();

        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        
        if (emailField) emailField.classList.add('error');
        if (passwordField) passwordField.classList.add('error');
        
        const form = document.getElementById('login-forms');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'login-error';
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
        
        // Для каждого поля, где есть ошибка
        for (const [field, error] of Object.entries(fieldErrors)) {
            if (!error) continue;
            
            // Определяем ID поля, confirm-password отдельно
            const inputId = field === 'confirmPassword' ? 'confirm-password' : field;
            const input = document.getElementById(inputId);
            
            if (input) {
                input.classList.add('error');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = error;
                // ПРОВЕРЯЕМ: если инпут внутри wrapper, выносим ошибку ЗА него
                const wrapper = input.closest('.password-wrapper');
                if (wrapper) {
                    wrapper.after(errorDiv); // Вставит ошибку СРАЗУ ПОСЛЕ блока с глазиком
                } else {
                    input.parentNode.appendChild(errorDiv); // Для обычных полей
                }
            }
        }
    },
    

    showSuccessMessage(message) {
        const form = document.getElementById('register-form');
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        form.appendChild(successDiv);
    },

    /**
    * Показ общей ошибки
    * @param {string} message - текст ошибки
    */
    showGeneralError(message) {
        const form = document.getElementById('register-form');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        form.appendChild(errorDiv);
    },

    /**
    * Выход из аккаунта
    * Удаляет данные и перенаправляет на главную
    */
    // logout() {
    //     AuthService.logout();
    //     this.checkAuth();
    //     this.navigateTo('/');
    // }
    logout() {
        AuthService.logout(this); // Передаём this (App) как параметр
        this.checkAuth();
        // Не вызываем this.navigateTo('/'), потому что это сделает AuthService
    }
};

// Запускаем приложение, когда DOM загрузится
document.addEventListener('DOMContentLoaded', () => App.init());

export { App };
