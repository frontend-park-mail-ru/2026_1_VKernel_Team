const App = {
    templates: {},
    currentView: 'main-page',
    
    async init() {
        await this.loadTemplates();
        this.checkAuth();
        this.render();
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
    
    render() {
        document.body.classList.remove('auth-page');

        const app = document.getElementById('app');
        
        // Всегда рендерим главную страницу
        app.innerHTML = this.templates['main-page']({ 
            isAuthenticated: this.isAuthenticated 
        });
        
        // Навешиваем обработчики
        this.attachMainEventListeners();
    },
    
    attachMainEventListeners() {
        // Обработчик для иконки профиля
        const profileIcon = document.querySelector('.profile-icon');
        if (profileIcon) {
            profileIcon.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.isAuthenticated) {
                    // Если авторизован - показываем профиль
                    this.showProfile();
                } else {
                    // Если нет - показываем страницу входа
                    this.showLogin();
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
                    // TODO: showCreateAdForm()
                } else {
                    this.showLogin();
                }
            });
        }
    },

    showProfile() {
        // TODO: загрузить данные профиля с бекенда
        const app = document.getElementById('app');
        app.innerHTML = this.templates['user-profile']({ 
            email: this.user?.email || 'Неизвестно',
            // username может отсутствовать, так как бек его не хранит
            username: this.user?.email?.split('@')[0] || 'Пользователь' 
        });
        document.body.classList.add('auth-page');
        // Добавить кнопку "На главную" и обработчик выхода
    },

    showLogin(error, formData) {
        this.currentView = 'login';
        const app = document.getElementById('app');
        app.innerHTML = this.templates['login-form']({ 
            error: error,
            email: formData?.email || ''
        });
        document.body.classList.add('auth-page');
        this.attachLoginHandler();
    },
    
    showRegister(error, success, formData) {
        this.currentView = 'register';
        const app = document.getElementById('app');
        app.innerHTML = this.templates['register-form']({ 
            error: error,
            success: success,
            email: formData?.email || ''
            // username убран, так как его нет в API
        });
        document.body.classList.add('auth-page');
        this.attachRegisterHandler();
    },
    
    attachLoginHandler() {
        const form = document.getElementById('login-form');
        if (!form) return;
        
        // Убираем старый обработчик
        form.removeEventListener('submit', this._loginHandler);
        
        this._loginHandler = async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const validation = AuthValidator.validateLogin(email, password);
            
            // Очищаем старые ошибки
            this.clearLoginError();
            
            if (!validation.isValid) {
                this.showLoginError(validation.errors[0]);
                return;
            }
            
            const result = await AuthService.login({ email, password });
            
            if (result.success) {
                this.checkAuth();
                this.render(); // Возвращаемся на главную
            } else {
                // Если есть fieldErrors (для email/password)
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
        
        // Убираем старый обработчик
        form.removeEventListener('submit', this._registerHandler);
        
        this._registerHandler = async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Валидация без username
            const validation = AuthValidator.validateRegister(
                email, password, confirmPassword
            );
            
            // Очищаем старые ошибки и сообщения
            this.clearFieldErrors();
            this.clearMessages();
            
            if (!validation.isValid) {
                this.showFieldErrors(validation.fieldErrors);
                return;
            }
            
            const result = await AuthService.register({ email, password });
            
            if (result.success) {
                // Автоматически входим после успешной регистрации
                const loginResult = await AuthService.login({ email, password });
                
                if (loginResult.success) {
                    this.checkAuth();
                    this.render(); // Возвращаемся на главную
                } else {
                    this.showSuccessMessage('Регистрация успешна! Теперь войдите в аккаунт.');
                    setTimeout(() => this.showLogin(), 2000);
                }
            } else {
                // Показываем ошибки полей, если они есть
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
    
    // Вспомогательные методы для работы с ошибками
    
    clearLoginError() {
        // Убираем красную обводку с обоих полей
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        
        if (emailField) emailField.classList.remove('error');
        if (passwordField) passwordField.classList.remove('error');

        // Удаляем ВСЕ сообщения об ошибках под полем пароля
        if (passwordField) {
            const parent = passwordField.parentNode;
            const errorMessages = parent.querySelectorAll('.field-error');
            errorMessages.forEach(el => el.remove());
        }
        
        // Также удаляем возможные старые сообщения
        document.querySelectorAll('.login-error, .alert-error').forEach(el => el.remove());
    },
    
    showLoginError(message) {
        this.clearLoginError();

        // Подсвечиваем оба поля красным
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        
        if (emailField) emailField.classList.add('error');
        if (passwordField) passwordField.classList.add('error');
        
        // Создаём сообщение об ошибке
        const errorDiv = document.createElement('div');
        errorDiv.className = 'login-error';
        errorDiv.textContent = message;
        
        // Вставляем после поля пароля
        if (passwordField) {
            passwordField.parentNode.appendChild(errorDiv);
        }
    },
    
    clearFieldErrors() {
        // Убираем класс error у всех полей
        document.querySelectorAll('.form-group input').forEach(input => {
            input.classList.remove('error');
        });
        
        // Удаляем все сообщения об ошибках
        document.querySelectorAll('.field-error').forEach(el => el.remove());
    },
    
    clearMessages() {
        document.querySelectorAll('.alert-success, .alert-error').forEach(el => el.remove());
    },
    
    showFieldErrors(fieldErrors) {
        for (const [field, errorMessage] of Object.entries(fieldErrors)) {
            if (!errorMessage) continue;
            
            // Находим поле по ID
            const inputId = field === 'confirmPassword' ? 'confirm-password' : field;
            const input = document.getElementById(inputId);
            if (!input) continue;
            
            // Добавляем класс ошибки
            input.classList.add('error');
            
            // Создаём элемент с ошибкой
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errorMessage;
            
            // Вставляем после поля
            input.parentNode.appendChild(errorDiv);
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
        AuthService.logout(); // Вызываем logout из сервиса
        this.checkAuth();
        this.render();
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());