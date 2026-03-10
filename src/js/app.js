document.addEventListener('click', function(e) {
    // Находим ссылку, по которой кликнули
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    // Пропускаем:
    // - пустые ссылки
    // - внешние ссылки (http, https, //)
    // - якоря (#)
    // - mailto:, tel:
    if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:') || href === '#') {
        return;
    }
    
    // Проверяем, есть ли у ссылки атрибут data-back-link
    // Если есть - пропускаем, пусть обрабатывается своим обработчиком
    if (link.hasAttribute('data-back-link')) {
        return;
    }
    
    // Для всех остальных внутренних ссылок (начинаются с /)
    if (href.startsWith('/')) {
        e.preventDefault(); // Останавливаем переход браузера
        
        // Если App уже загружен
        if (window.App) {
            App.navigateTo(href);
        } else {
            // Если еще не загружен - ждем
            console.log('App еще не загружен, ждем...');
            setTimeout(function() {
                if (window.App) {
                    App.navigateTo(href);
                } else {
                    // Если совсем не загрузился - делаем обычный переход
                    window.location.href = href;
                }
            }, 100);
        }
    }
});

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

    // showLogin(error, formData) {
    //     this.currentView = 'login';
    //     document.body.classList.add('auth-page');
    //     const app = document.getElementById('app');
    //     app.innerHTML = this.templates['login-form']({ 
    //         error: error,
    //         email: formData?.email || ''
    //     });
    //     this.attachLoginHandler();
        
    //     // Кнопка "На главную" через роутер
    //     const backLink = document.querySelector('.back-to-main a');
    //     if (backLink) {
    //         backLink.addEventListener('click', (e) => {
    //             e.preventDefault();
    //             this.navigateTo('/');
    //         });
    //     }
    // },
    
    // showRegister(error, success, formData) {
    //     this.currentView = 'register';
    //     document.body.classList.add('auth-page');
    //     const app = document.getElementById('app');
    //     app.innerHTML = this.templates['register-form']({ 
    //         error: error,
    //         success: success,
    //         email: formData?.email || ''
    //     });
    //     this.attachRegisterHandler();
        
    //     const backLink = document.querySelector('.back-to-main a');
    //     if (backLink) {
    //         backLink.addEventListener('click', (e) => {
    //             e.preventDefault();
    //             this.navigateTo('/');
    //         });
    //     }
    // },

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
                e.stopPropagation(); // Останавливаем всплытие события
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
        
        const backLink = document.querySelector('.back-to-main a');
        if (backLink) {
            backLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Останавливаем всплытие события
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
            
            this.clearLoginError();
            
            if (!validation.isValid) {
                this.showLoginError(validation.errors[0]);
                return;
            }
            
            const result = await AuthService.login({ email, password });
            
            if (result.success) {
                this.checkAuth();
                this.navigateTo('/'); 
            } else {
                if (result.fieldErrors) {
                    this.showFieldErrors({
                        email: result.fieldErrors.email,
                        password: result.fieldErrors.password
                    });
                } else {
                    this.showLoginError(result.error || 'Ошибка при входе');
                }
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
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            const validation = AuthValidator.validateRegister(
                email, password, confirmPassword
            );
            
            this.clearFieldErrors();
            this.clearMessages();
            
            if (!validation.isValid) {
                this.showFieldErrors(validation.fieldErrors);
                return;
            }
            
            const result = await AuthService.register({ email, password });
            
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
    
    clearLoginError() { /* ... */ },
    showLoginError(message) { /* ... */ },
    clearFieldErrors() { /* ... */ },
    clearMessages() { /* ... */ },
    showFieldErrors(fieldErrors) { /* ... */ },
    showSuccessMessage(message) { /* ... */ },
    showGeneralError(message) { /* ... */ },
    
    logout() {
        AuthService.logout();
        this.checkAuth();
        this.navigateTo('/'); 
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());

