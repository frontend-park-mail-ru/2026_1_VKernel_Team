const App = {
    templates: {},
    currentView: null,
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
            'user-profile'
        ];
        
        for (const name of templateNames) {
            const response = await fetch(`/templates/${name}.hbs`);
            const source = await response.text();
            this.templates[name] = Handlebars.compile(source);
        }
    },
    
    checkAuth() {
        this.isAuthenticated = Storage.isAuthenticated();
        this.user = Storage.getUser();
    },
    render() {
        const app = document.getElementById('app');
        
        if (this.isAuthenticated && this.user) {
            app.innerHTML = this.templates['user-profile']({
                username: this.user.username,
                email: this.user.email,
                createdAt: this.user.createdAt || new Date().toLocaleDateString()
            });
        } else {
            if (this.currentView === 'login') {
                this.showLogin();
            } else if (this.currentView === 'register') {
                this.showRegister();
            } else {
                app.innerHTML = this.templates['auth-links']();
            }
        }
    },
    showLogin(error) {
        this.currentView = 'login';
        const app = document.getElementById('app');
        app.innerHTML = this.templates['login-form']({ error });
        this.attachLoginHandler();
    },
    
    showRegister(error, success) {
        this.currentView = 'register';
        const app = document.getElementById('app');
        app.innerHTML = this.templates['register-form']({ error, success });
        this.attachRegisterHandler();
    },
    attachLoginHandler() {
        const form = document.getElementById('login-form');
        if (!form) return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const validation = AuthValidator.validateLogin(email, password);
            if (!validation.isValid) {
                this.showLogin(validation.errors[0]);
                return;
            }
            const result = await AuthService.login({ email, password });
            
            if (result.success) {
                this.checkAuth();
                this.render();
            } else {
                this.showLogin(result.error || 'Ошибка при входе');
            }
        });
    },
    
    attachRegisterHandler() {
        const form = document.getElementById('register-form');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const validation = AuthValidator.validateRegister(
                username, email, password, confirmPassword
            );
            if (!validation.isValid) {
                this.showRegister(validation.errors[0]);
                return;
            }
            const result = await AuthService.register({ 
                username, email, password 
            });
            
            if (result.success) {
                this.showRegister(null, 'Регистрация успешна! Теперь можно войти.');
                setTimeout(() => this.showLogin(), 2000);
            } else {
                this.showRegister(result.error || 'Ошибка при регистрации');
            }
        });
    },
    logout() {
        Storage.logout();
        this.checkAuth();
        this.currentView = null;
        this.render();
    }
};
document.addEventListener('DOMContentLoaded', () => App.init());