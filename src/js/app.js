const App = {
    templates: {},
    currentView: 'main-page',

    async init() {
        await this.loadTemplates();
        if (!Storage.isAuthenticated()) {
            const result = await AuthService.getCurrentUser();
            if (result.success && result.user) {
                Storage.setUser(result.user);
            }
        }

        this.checkAuth();
        this.router();
        window.addEventListener('popstate', () => this.router());
    },

    async loadTemplates() {
        const templateNames = [
            'auth-links',
            'login-form',
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
    },

    checkAuth() {
        this.isAuthenticated = Storage.isAuthenticated();
        this.user = Storage.getUser();
    },

    router() {
        const path = window.location.pathname;

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

    navigateTo(path) {
        window.history.pushState({}, '', path);
        this.router();
    },

    async renderMain() {
        document.body.classList.remove('auth-page');
        const app = document.getElementById('app');
        const adsResult = await AdsService.getAllAds();
        const ads = adsResult.success ? adsResult.ads : [];
        const formattedAds = ads.map(ad => AdsService.formatAdCard(ad));

        app.innerHTML = this.templates['main-page']({
            isAuthenticated: this.isAuthenticated,
            recommendations: formattedAds
        });
        this.attachMainEventListeners();
    },

    renderNotFound() {
        const app = document.getElementById('app');
        app.innerHTML = this.templates['not-found']();
    },

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

    showLogin(error, formData) {
        this.currentView = 'login';
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        app.innerHTML = this.templates['login-form']({
            error: error,
            email: formData?.email || ''
        });
        this.attachLoginHandler();
        const backLink = document.querySelector('.back-to-main a');
        if (backLink) {
            backLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('/');
            });
        }
    },

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

        const backLink = document.querySelector('.back-to-main a');
        if (backLink) {
            backLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo('/');
            });
        }
    },
    async handleLoginSubmit(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const validation = AuthValidator.validateLogin(email, password);
        this.clearLoginError();

        if (!validation.isValid) {
            this.showLoginError(validation.errors[0]);
            return;
        }

        const result = await AuthService.login({ email, password });

        if (result.success) {
            this.checkAuth();
            this.navigateTo('/');
            return;
        }

        if (result.fieldErrors) {
            this.showFieldErrors({
                email: result.fieldErrors.email,
                password: result.fieldErrors.password
            });
            return;
        }

        this.showLoginError(result.error || 'Ошибка при входе');
    },

    async handleRegisterSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        const validation = AuthValidator.validateRegister(
            name, email, password, confirmPassword
        );

        this.clearFieldErrors();
        this.clearMessages();

        if (!validation.isValid) {
            this.showFieldErrors(validation.fieldErrors);
            return;
        }

        const result = await AuthService.register({ name, email, password });

        if (!result.success) {
            if (result.fieldErrors) {
                this.showFieldErrors({
                    name: result.fieldErrors.name,
                    email: result.fieldErrors.email,
                    password: result.fieldErrors.password
                });
                return;
            }
            
            this.showGeneralError(result.error || 'Ошибка при регистрации');
            return;
        }

        // Регистрация успешна
        const loginResult = await AuthService.login({ email, password });

        if (loginResult.success) {
            this.checkAuth();
            this.navigateTo('/');
            return;
        }

        this.showSuccessMessage('Регистрация успешна! Теперь войдите в аккаунт.');
        setTimeout(() => this.navigateTo('/login'), 2000);
    },

    attachLoginHandler() {
        const form = document.getElementById('login-form');
        if (!form) return;

        // Удаляем старый обработчик если есть
        if (this._loginHandler) {
            form.removeEventListener('submit', this._loginHandler);
        }

        // Привязываем вынесенный метод
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

        // Привязываем вынесенный метод
        this._registerHandler = this.handleRegisterSubmit.bind(this);
        form.addEventListener('submit', this._registerHandler);
    },

    clearLoginError() {
        document.querySelectorAll('.login-error, .alert-error').forEach(el => el.remove());
        
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        
        if (emailField) emailField.classList.remove('error');
        if (passwordField) passwordField.classList.remove('error');
    },

    showLoginError(message) {
        this.clearLoginError();

        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        
        if (emailField) emailField.classList.add('error');
        if (passwordField) passwordField.classList.add('error');
        
        const form = document.getElementById('login-form');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'login-error';
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

        for (const [field, error] of Object.entries(fieldErrors)) {
            if (!error) continue;

            const inputId = field === 'confirmPassword' ? 'confirm-password' : field;
            const input = document.getElementById(inputId);

            if (input) {
                input.classList.add('error');

                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = error;
                input.parentNode.appendChild(errorDiv);
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

    showGeneralError(message) {
        const form = document.getElementById('register-form');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        form.appendChild(errorDiv);
    },

    logout() {
        AuthService.logout();
        this.checkAuth();
        this.navigateTo('/');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
