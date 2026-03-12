const App = {
    templates: {},
    currentView: 'main-page',
    
    async init() {
        await this.loadTemplates();
        this.checkAuth();
        
        // Запускаем роутер
        this.router();
        
        // Слушаем изменения URL (кнопки назад/вперёд)
        window.addEventListener('popstate', () => this.router());
    },
    
    async loadTemplates() {
        const templateNames = [
            'auth-links',
            'login-form', 
            'register-form',
            'user-profile',
            'main-page'
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
        // Получаем текущий путь из адресной строки
        const path = window.location.pathname;
        
        // Определяем, что показать
        switch(path) {
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
                this.renderNotFound(); // можно добавить шаблон 404
        }
    },
    
    navigateTo(path) {
        window.history.pushState({}, '', path);
        this.router(); // вызываем роутер для обновления страницы
    },
    

    // Рендерим главную
    renderMain() {
        document.body.classList.remove('auth-page');
        const app = document.getElementById('app');
        app.innerHTML = this.templates['main-page']({ 
            isAuthenticated: this.isAuthenticated 
        });
        this.attachMainEventListeners();
    },
    
    renderNotFound() {
        const app = document.getElementById('app');
        app.innerHTML = '<h1>404 - Страница не найдена</h1><a href="/">На главную</a>';
    },
    
    attachMainEventListeners() {
        // Обработчик для иконки профиля
        const profileIcon = document.querySelector('.profile-icon');
        if (profileIcon) {
            profileIcon.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isAuthenticated) {
                    this.navigateTo('/profile');
                } else {
                    this.navigateTo('/login');
                }
            });
        }
        
        // Обработчик для кнопки "Разместить объявление"
        const placeAdBtn = document.querySelector('.place-ad-btn');
        if (placeAdBtn) {
            placeAdBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isAuthenticated) {
                    console.log('Форма размещения');
                    // TODO: navigateTo('/create-ad')
                } else {
                    this.navigateTo('/login');
                }
            });
        }
    },

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

    showProfile() {
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        app.innerHTML = this.templates['user-profile']({ 
            email: this.user?.email || 'Неизвестно',
            username: this.user?.email?.split('@')[0] || 'Пользователь' 
        });
        
        // Добавляем кнопку "На главную" и обработчик выхода
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
    
    showRegister(error, success, formData) {
        this.currentView = 'register';
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        app.innerHTML = this.templates['register-form']({ 
            error: error,
            success: success,
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

    
    attachLoginHandler() {
        const form = document.getElementById('login-form');
        if (!form) return;
        
        form.removeEventListener('submit', this._loginHandler);
        
        this._loginHandler = async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const validation = AuthValidator.validateLogin(email, password);
            
            this.clearFieldErrors(); // Очищаем ошибки полей
            this.clearLoginError(); // Очищаем общую ошибку
            
            if (!validation.isValid) {
                // Подсвечиваем оба поля красным при любой ошибке валидации
                const fieldErrors = {
                    email: ' ',
                    password: ' '
                };
                this.showFieldErrors(fieldErrors);
                this.showLoginError('Неверный email или пароль')
                return;
            }
            
            const result = await AuthService.login({ email, password });
            
            if (result.success) {
                this.checkAuth();
                this.navigateTo('/'); 
            } else {
                // При любой ошибке от сервера подсвечиваем оба поля красным
                const fieldErrors = {
                    email: ' ',
                    password: ' '
                };
                this.showFieldErrors(fieldErrors);
                this.showLoginError('Неверный email или пароль');
            }
        };
        
        form.addEventListener('submit', this._loginHandler);
    },
    
    attachRegisterHandler() {
    const form = document.getElementById('register-form');
    if (!form) return;
    
    form.removeEventListener('submit', this._registerHandler);
    
    this._registerHandler = async (e) => {
        e.preventDefault();
        
        // Получаем значение имени
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Передаём все 4 параметра
        const validation = AuthValidator.validateRegister(
            name, email, password, confirmPassword
        );
        
        this.clearFieldErrors();
        this.clearMessages();
        
        if (!validation.isValid) {
            this.showFieldErrors(validation.fieldErrors);
            return;
        }
        
        // Отправляем имя на сервер
        const result = await AuthService.register({ 
            name,  // добавили
            email, 
            password 
        });
        
        if (result.success) {
            const loginResult = await AuthService.login({ email, password });
            
            if (loginResult.success) {
                this.checkAuth();
                this.navigateTo('/'); 
            } else {
                this.showSuccessMessage('Регистрация успешна! Теперь войдите в аккаунт.');
                setTimeout(() => this.navigateTo('/login'), 2000);
            }
        } else {
            if (result.fieldErrors) {
                this.showFieldErrors({
                    name: result.fieldErrors.name,
                    email: result.fieldErrors.email,
                    password: result.fieldErrors.password
                });
            } else {
                this.showGeneralError(result.error || 'Ошибка при регистрации');
            }
        }
    };
    
    form.addEventListener('submit', this._registerHandler);
},
    

    clearLoginError() {
        const errorDiv = document.querySelector('.login-error');
        if (errorDiv) errorDiv.remove();
    },

    showLoginError(message) {
        this.clearLoginError();
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
        const container = document.querySelector('.auth-container');
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = message;
        container.appendChild(alertDiv);
    },

    showGeneralError(message) {
        const container = document.querySelector('.auth-container');
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-error';
        alertDiv.textContent = message;
        container.appendChild(alertDiv);
    },
    
    logout() {
        AuthService.logout();
        this.checkAuth();
        this.navigateTo('/'); 
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
}
};

document.addEventListener('DOMContentLoaded', () => App.init());

