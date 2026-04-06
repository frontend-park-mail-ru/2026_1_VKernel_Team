import { authActions } from '@/actions/authActions';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import type { HandlebarsTemplateFunction } from '@/types';
import { AppController } from './AppController';

declare const Handlebars: any;

export const AuthController = {
    templates: {} as Record<string, HandlebarsTemplateFunction>,
    UI_CONSTANTS: {
        EYE_OPEN: '/images/icons/Eye.jpeg',
        EYE_CLOSED: '/images/icons/Eye-off.jpeg',
    },

    _loginHandler: null as EventListener | null,
    _registerHandler: null as EventListener | null,

    async showLogin(error?: string | null): Promise<void> {
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        const template = this.templates['login-forms'];
        
        if (!app || !template) return;

        app.innerHTML = template({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            error: error || null,
        });

        this.attachLoginListeners();
        this.initPasswordToggles();
    },

    async showRegister(
        error?: string | null, 
        fieldErrors?: Record<string, string | null>
    ): Promise<void> {
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        const template = this.templates['register-form'];
        
        if (!app || !template) return;

        app.innerHTML = template({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            error: error || null,
            fieldErrors: fieldErrors || {},
        });

        this.attachRegisterListeners();
        this.initPasswordToggles();
    },

    async handleLoginSubmit(email: string, password: string): Promise<void> {
        const result = await authActions.login({ email, password });

        if (result.isValid) {
            uiActions.showSuccess('Вход выполнен!');
            window.history.pushState({}, '', '/');
            if (typeof AppController?.router === 'function') {
                AppController.router();
            }
        } else {
            uiActions.showError(result.error || 'Ошибка входа');
            this.clearLoginError();
            this.showLoginError(result.error ?? 'Ошибка входа');
            // 🔧 УБРАНО: this.showLogin() не должен вызываться при ошибке валидации,
            // так как он полностью перезаписывает innerHTML и стирает только что добавленные ошибки.
        }
    },

    async handleRegisterSubmit(data: any): Promise<void> {
        const result = await authActions.register(data);

        if (result.isValid) {
            uiActions.showSuccess('Вход выполнен!');
            window.history.pushState({}, '', '/');
            if (typeof AppController?.router === 'function') {
                AppController.router();
            }
        } else {
            uiActions.showError(result.error || 'Ошибка регистрации');
            this.clearFieldErrors();
            if (result.fieldErrors) {
                this.showFieldErrors(result.fieldErrors);
            }
            // 🔧 УБРАНО: this.showRegister() по той же причине. Форма уже на экране, 
            // мы просто накладываем ошибки поверх существующих полей.
        }
    },

    async handleLogout(): Promise<void> {
        await authActions.logout();
        localStorage.removeItem('authToken'); 
        window.history.pushState({}, '', '/');
        if (typeof AppController?.router === 'function') {
            AppController.router();
        }
    },

    initPasswordToggles(): void {
        const toggles = document.querySelectorAll('#togglePassword, #toggleConfirmPassword');
        
        toggles.forEach((toggleBtn) => {
            const btn = toggleBtn as HTMLButtonElement;
            const eyeIcon = btn.querySelector('img') as HTMLImageElement;
            const wrapper = btn.closest('.password-wrapper');
            const input = wrapper?.querySelector('input[type="password"]') as HTMLInputElement;
            
            if (input && eyeIcon) {
                btn.addEventListener('click', () => {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    eyeIcon.src = isPassword ? this.UI_CONSTANTS.EYE_OPEN : this.UI_CONSTANTS.EYE_CLOSED;
                    eyeIcon.alt = isPassword ? 'Скрыть пароль' : 'Показать пароль';
                });
            }
        });
    },

    showLoginError(message: string): void {
    this.clearLoginError();
    ['email', 'password'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('error');
    });

    const form = document.getElementById('login-forms');
    if (!form) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error alert-error'; // ← убрали 'alert'
    errorDiv.textContent = message;
    form.parentNode?.insertBefore(errorDiv, form);
},

    clearLoginError(): void {
        document.querySelectorAll('.login-error, .alert-error').forEach(el => el.remove());
        ['email', 'password'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('error');
        });
    },

    showFieldErrors(fieldErrors: Record<string, string | null>): void {
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
                input.closest('.form-group')?.appendChild(errorDiv);
            }
        });
    },

    clearFieldErrors(): void {
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    },

    attachLoginListeners(): void {
        const form = document.getElementById('login-forms') as HTMLFormElement;
        if (!form) return;
        
        if (this._loginHandler) {
            form.removeEventListener('submit', this._loginHandler);
        }

        const handler: EventListener = (e: Event) => {
            e.preventDefault();
            const email = (document.getElementById('email') as HTMLInputElement)?.value || '';
            const password = (document.getElementById('password') as HTMLInputElement)?.value || '';
            this.handleLoginSubmit(email, password);
        };
        
        this._loginHandler = handler;
        form.addEventListener('submit', handler); 
    },

    attachRegisterListeners(): void {
        const form = document.getElementById('register-form') as HTMLFormElement;
        if (!form) return;

        if (this._registerHandler) {
            form.removeEventListener('submit', this._registerHandler);
        }

        const handler: EventListener = (e: Event) => {
            e.preventDefault();
            const data = {
                name: (document.getElementById('name') as HTMLInputElement)?.value || '',
                email: (document.getElementById('email') as HTMLInputElement)?.value || '',
                password: (document.getElementById('password') as HTMLInputElement)?.value || '',
                confirmPassword: (document.getElementById('confirm-password') as HTMLInputElement)?.value || '',
            };
            this.handleRegisterSubmit(data);
        };
        
        this._registerHandler = handler;
        form.addEventListener('submit', handler);
    },
};
