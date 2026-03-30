import { AuthService } from '../services/authService.js';
import { AuthValidator } from '../validators/authValidator.js';
import { AppController } from './AppController.js';
const AuthController = {
    _loginHandler: null,
    _registerHandler: null,
    async checkAuth() {
        const result = await AuthService.check();
        AppController.isAuthenticated = result.isAuthenticated;
        AppController.user = result.user;
    },
    showLogin(error, formData) {
        AppController.currentView = 'login';
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        if (!app || !AppController.templates['login-forms'])
            return;
        app.innerHTML = AppController.templates['login-forms']({
            error: error,
            email: formData?.email || '',
        });
        this.attachLoginHandler();
        this.initPasswordToggles();
    },
    showRegister(error, success, formData) {
        AppController.currentView = 'register';
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        if (!app || !AppController.templates['register-form'])
            return;
        app.innerHTML = AppController.templates['register-form']({
            error: error,
            success: success,
            name: formData?.name || '',
            email: formData?.email || '',
        });
        this.attachRegisterHandler();
        this.initPasswordToggles();
    },
    async handleLoginSubmit(e) {
        e.preventDefault();
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const email = emailInput?.value.trim() || '';
        const password = passwordInput?.value || '';
        const validation = AuthValidator.validateLogin(email, password);
        this.clearFieldErrors();
        this.clearLoginError();
        if (!validation.isValid) {
            this.showFieldErrors({ email: ' ', password: ' ' });
            this.showLoginError('Неверный email или пароль');
            return;
        }
        AppController.showLoading(true);
        const result = await AuthService.login({ email, password });
        AppController.showLoading(false);
        if (result.success) {
            AppController.isAuthenticated = true;
            AppController.user = result.data;
            this.showSuccessMessage('Вход выполнен!');
            AppController.navigateTo('/');
            return;
        }
        if (result.fieldErrors) {
            this.showFieldErrors(result.fieldErrors);
        }
        else {
            this.showFieldErrors({ email: ' ', password: ' ' });
        }
        this.showLoginError(result.error || 'Неверный email или пароль');
    },
    async handleRegisterSubmit(e) {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirm-password');
        const name = nameInput?.value.trim() || '';
        const email = emailInput?.value.trim() || '';
        const password = passwordInput?.value || '';
        const confirmPassword = confirmInput?.value || '';
        const validation = AuthValidator.validateRegister(name, email, password, confirmPassword);
        this.clearFieldErrors();
        this.clearMessages();
        if (!validation.isValid) {
            const errors = validation.fieldErrors;
            this.showFieldErrors(errors);
            return;
        }
        AppController.showLoading(true);
        const result = await AuthService.register({ name, email, password });
        AppController.showLoading(false);
        if (!result.success && result.fieldErrors) {
            this.showFieldErrors(result.fieldErrors);
            return;
        }
        if (!result.success) {
            this.showGeneralError(result.error || 'Ошибка при регистрации');
            return;
        }
        AppController.isAuthenticated = true;
        AppController.user = result.data;
        this.showSuccessMessage('Регистрация успешна!');
        AppController.navigateTo('/');
    },
    async logout() {
        AppController.showLoading(true);
        await AuthService.logout();
        AppController.showLoading(false);
        await this.checkAuth();
        AppController.navigateTo('/');
    },
    attachLoginHandler() {
        const form = document.getElementById('login-forms');
        if (!form)
            return;
        if (this._loginHandler) {
            form.removeEventListener('submit', this._loginHandler);
        }
        this._loginHandler = this.handleLoginSubmit.bind(this);
        form.addEventListener('submit', this._loginHandler);
    },
    attachRegisterHandler() {
        const form = document.getElementById('register-form');
        if (!form)
            return;
        if (this._registerHandler) {
            form.removeEventListener('submit', this._registerHandler);
        }
        this._registerHandler = this.handleRegisterSubmit.bind(this);
        form.addEventListener('submit', this._registerHandler);
    },
    initPasswordToggles() {
        const elements = {
            password: {
                input: document.querySelector('#password'),
                toggle: document.querySelector('#togglePassword'),
                eye: document.querySelector('#eyeIcon'),
            },
            confirm: {
                input: document.querySelector('#confirm-password'),
                toggle: document.querySelector('#toggleConfirmPassword'),
                eye: document.querySelector('#eyeIconConfirm'),
            },
        };
        Object.values(elements).forEach(({ input, toggle, eye }) => {
            if (input && toggle && eye) {
                toggle.addEventListener('click', () => {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    eye.src = isPassword ? AppController.UI_CONSTANTS.EYE_OPEN : AppController.UI_CONSTANTS.EYE_CLOSED;
                });
            }
        });
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
        if (!form)
            return;
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
    showFieldErrors(fieldErrors) {
        this.clearFieldErrors();
        Object.entries(fieldErrors).forEach(([field, error]) => {
            if (!error)
                return;
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
                }
                else {
                    input.parentNode?.appendChild(errorDiv);
                }
            }
        });
    },
    showSuccessMessage(message) {
        const form = document.getElementById('register-form') || document.getElementById('login-forms');
        if (!form)
            return;
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        form.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
    },
    showGeneralError(message) {
        const form = document.getElementById('register-form') || document.getElementById('login-forms');
        if (!form)
            return;
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        form.appendChild(errorDiv);
    },
};
export { AuthController };
