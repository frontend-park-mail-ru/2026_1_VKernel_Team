const App = {
    templates: {},
    currentView: 'main-page',
    isAuthenticated: false,
    user: null,

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

        Handlebars.registerHelper('formatPrice', function(price) {
            if (price === 0 || price === '0') {
                return 'Бесплатно';
            }
            return price + ' ₽';
        });

        Handlebars.registerHelper('ifAuthenticated', function(options) {
            return App.isAuthenticated ? options.fn(this) : options.inverse(this);
        });

        Handlebars.registerHelper('user', function() {
            return App.user;
        });
    },

    async checkAuth() {
        const result = await AuthService.check();
        this.isAuthenticated = result.isAuthenticated;
        this.user = result.user;
        
        if (!this.isAuthenticated && this.isProtectedRoute(window.location.pathname)) {
            this.navigateTo('/login');
        }
        
        return this.isAuthenticated;
    },

    isProtectedRoute(path) {
        const protectedRoutes = ['/profile'];
        return protectedRoutes.includes(path);
    },

    async router() {
        await this.checkAuth();
        
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
        
        try {
            const adsResult = await apiClient.get(API_ENDPOINTS.ADS.GET_ALL);
            const ads = adsResult.success ? adsResult.data : [];
            const formattedAds = ads.map(ad => this.formatAdCard(ad));

            app.innerHTML = this.templates['main-page']({
                isAuthenticated: this.isAuthenticated,
                user: this.user,
                recommendations: formattedAds
            });
        } catch (error) {
            app.innerHTML = this.templates['main-page']({
                isAuthenticated: this.isAuthenticated,
                user: this.user,
                recommendations: []
            });
        }
        
        this.attachMainEventListeners();
    },

    formatAdCard(ad) {
        return {
            ...ad,
            formattedPrice: ad.price === 0 ? 'Бесплатно' : ad.price + ' ₽',
            mainPhoto: ad.photos && ad.photos.length > 0 
                ? ad.photos[0] 
                : '/images/default-ad.jpg',
            createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : ''
        };
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
                    alert('Функция размещения объявления будет доступна позже');
                } else {
                    this.navigateTo('/login');
                }
            });
        }

        document.querySelectorAll('.ad-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const adId = card.dataset.id;
                if (adId) {
                    console.log('Переход к объявлению:', adId);
                }
            });
        });
    },

    initPasswordToggles() {
        const confirmInput = document.querySelector('#confirm-password');
        const passwordInput = document.querySelector('#password');
        const togglePassword = document.querySelector('#togglePassword');
        const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
        const eyeImg = document.querySelector('#eyeIcon');
        const eyeImgConfirm = document.querySelector('#eyeIconConfirm');

        if (passwordInput && togglePassword) {
            togglePassword.addEventListener('click', () => {
                const isPassword = passwordInput.type === 'password';
                passwordInput.type = isPassword ? 'text' : 'password';
                if (eyeImg) {
                    eyeImg.src = isPassword ? '/images/icons/Eye.jpeg' : '/images/icons/Eye-off.jpeg';
                }
            });
        }

        if (confirmInput && toggleConfirmPassword) { 
            toggleConfirmPassword.addEventListener('click', () => {
                const isPassword = confirmInput.type === 'password';
                confirmInput.type = isPassword ? 'text' : 'password';
                if (eyeImgConfirm) {
                    eyeImgConfirm.src = isPassword ? '/images/icons/Eye.jpeg' : '/images/icons/Eye-off.jpeg';
                }
            });
        }
    },

    showProfile() {
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        
        app.innerHTML = this.templates['user-profile']({
            email: this.user?.email || 'Неизвестно',
            name: this.user?.name || this.user?.email?.split('@')[0] || 'Пользователь',
            registeredAt: this.user?.created_at 
                ? new Date(this.user.created_at).toLocaleDateString('ru-RU') 
                : 'неизвестно'
        });
        
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
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
        
        app.innerHTML = this.templates['login-forms']({
            error: error,
            email: formData?.email || ''
        });
        
        this.attachLoginHandler();
        this.initPasswordToggles();
        
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
        this.initPasswordToggles();
        
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
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (typeof AuthValidator !== 'undefined') {
            const validation = AuthValidator.validateLogin(email, password);
            
            this.clearFieldErrors();
            this.clearLoginError();
            
            if (!validation.isValid) {
                const fieldErrors = {
                    email: ' ',
                    password: ' '
                };
                this.showFieldErrors(fieldErrors);
                this.showLoginError('Неверный email или пароль');
                return;
            }
        }
        
        this.showLoading(true);
        const result = await AuthService.login({ email, password });
        this.showLoading(false);
        
        if (result.success) {
            await this.checkAuth();
            this.navigateTo('/'); 
        } else {
            if (result.fieldErrors) {
                this.showFieldErrors(result.fieldErrors);
            } else {
                const fieldErrors = {
                    email: ' ',
                    password: ' '
                };
                this.showFieldErrors(fieldErrors);
            }
            this.showLoginError(result.error || 'Неверный email или пароль');
        }
    },

    async handleRegisterSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (typeof AuthValidator !== 'undefined') {
            const validation = AuthValidator.validateRegister(
                name, email, password, confirmPassword
            );

            this.clearFieldErrors();
            this.clearMessages();

            if (!validation.isValid) {
                this.showFieldErrors(validation.fieldErrors);
                return;
            }
        }

        this.showLoading(true);
        const result = await AuthService.register({ name, email, password });
        this.showLoading(false);

        if (!result.success) {
            if (result.fieldErrors) {
                this.showFieldErrors(result.fieldErrors);
                return;
            }
            this.showGeneralError(result.error || 'Ошибка при регистрации');
            return;
        }

        await this.checkAuth();
        this.showSuccessMessage('Регистрация успешна!');
        setTimeout(() => this.navigateTo('/'), 1500);
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
        
        for (const [field, error] of Object.entries(fieldErrors)) {
            if (!error) continue;
            
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
        }
    },

    showSuccessMessage(message) {
        const form = document.getElementById('register-form') || document.getElementById('login-forms');
        if (!form) return;
        
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        form.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
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
        let loader = document.getElementById('global-loader');
        
        if (show) {
            if (!loader) {
                loader = document.createElement('div');
                loader.id = 'global-loader';
                loader.className = 'loader-overlay';
                loader.innerHTML = '<div class="loader"></div>';
                document.body.appendChild(loader);
            }
        } else {
            if (loader) {
                loader.remove();
            }
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
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());

window.addEventListener('online', () => {});
window.addEventListener('offline', () => {});
