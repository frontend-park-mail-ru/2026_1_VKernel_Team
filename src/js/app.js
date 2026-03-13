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

    async init() {
        await this.loadTemplates();
        await this.checkAuth();
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
            'not-found'
        ];

        for (const name of templateNames) {
            const response = await fetch(`src/templates/${name}.hbs`);
            const source = await response.text();
            this.templates[name] = Handlebars.compile(source);
        }

        Handlebars.registerHelper('formatPrice', (price) => {
            return price === 0 || price === '0' ? 'Бесплатно' : price + ' ₽';
        });

        Handlebars.registerHelper('ifAuthenticated', function(options) {
            return App.isAuthenticated ? options.fn(this) : options.inverse(this);
        });

        Handlebars.registerHelper('user', () => this.user);
    },

    async checkAuth() {
        const result = await AuthService.check();
        this.isAuthenticated = result.isAuthenticated;
        this.user = result.user;
    },

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

    navigateTo(path) {
        window.history.pushState({}, '', path);
        this.router();
    },

    async renderMain() {
        document.body.classList.remove('auth-page');
        const app = document.getElementById('app');

        const adsResult = await apiClient.get(API_ENDPOINTS.ADS.GET_ALL);
        const ads = adsResult.success ? adsResult.data : [];
        const formattedAds = ads.map(ad => this.formatAdCard(ad));

        app.innerHTML = this.templates['main-page']({
            isAuthenticated: this.isAuthenticated,
            user: this.user,
            recommendations: formattedAds
    });

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
                : `${window.MEDIA_URL}${photoPath}`;
        }

        return {
            ...ad,
            formattedPrice: ad.price === 0 ? 'Бесплатно' : ad.price + ' ₽',
            mainPhoto: imageUrl,
            image: imageUrl,
            createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : ''
        };
    },

    renderNotFound() {
        document.getElementById('app').innerHTML = this.templates['not-found']();
    },

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
                if (adId) console.log('Переход к объявлению:', adId);
            });
        });
    },

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

        document.querySelector('.logout-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        document.querySelector('.back-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('/');
        });
    },

    showLogin(error, formData) {
        this.currentView = 'login';
        document.body.classList.add('auth-page');
        document.getElementById('app').innerHTML = this.templates['login-forms']({
            error: error,
            email: formData?.email || ''
        });

        this.attachLoginHandler();
        this.initPasswordToggles();

        document.querySelector('.back-to-main a')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('/');
        });
    },

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

        document.querySelector('.back-to-main a')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('/');
        });
    },

    async handleLoginSubmit(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const validation = AuthValidator.validateLogin(email, password);

        this.clearFieldErrors();
        this.clearLoginError();

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

    async handleRegisterSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        const validation = AuthValidator.validateRegister(name, email, password, confirmPassword);

        this.clearFieldErrors();
        this.clearMessages();

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

    clearLoginError() {
        document.querySelectorAll('.login-error, .alert-error').forEach(el => el.remove());

        ['email', 'password'].forEach(id => {
            document.getElementById(id)?.classList.remove('error');
        });
    },

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

    clearFieldErrors() {
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    },

    clearMessages() {
        document.querySelectorAll('.alert').forEach(el => el.remove());
    },

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
        await this.checkAuth();

        if (window.location.pathname !== '/') {
            this.navigateTo('/');
        }
    },

    formatDate(dateString) {
        return dateString ? new Date(dateString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) : '';
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
