/**
 * Контроллер авторизации
 * Обрабатывает формы входа и регистрации
 * НЕ импортирует AppController — разрываем цикл!
 */

import { authActions } from '@/actions/authActions';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import type { HandlebarsTemplateFunction } from '@/types';

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
            uiActions.navigateTo('/');
        } else {
            uiActions.showError(result.error || 'Ошибка входа');
            this.clearLoginError();
            this.showLoginError(result.error ?? 'Ошибка входа');
            this.showLogin(result.error ?? undefined);
        }
    },

    async handleRegisterSubmit(data: any): Promise<void> {
        const result = await authActions.register(data);

        if (result.isValid) {
            uiActions.showSuccess('Регистрация успешна!');
            uiActions.navigateTo('/');
        } else {
            uiActions.showError(result.error || 'Ошибка регистрации');
            this.clearFieldErrors();
            if (result.fieldErrors) {
                this.showFieldErrors(result.fieldErrors);
            }
            this.showRegister(result.error ?? undefined, result.fieldErrors);
        }
    },

    async handleLogout(): Promise<void> {
        await authActions.logout();
        uiActions.navigateTo('/');
    },

    initPasswordToggles(): void {
        const elements = {
            password: {
                input: document.querySelector('#login-password') as HTMLInputElement | null,
                toggle: document.querySelector('#togglePassword') as HTMLButtonElement | null,
                eye: document.querySelector('#eyeIcon') as HTMLImageElement | null,
            },
            confirm: {
                input: document.querySelector('#register-confirm') as HTMLInputElement | null,
                toggle: document.querySelector('#toggleConfirmPassword') as HTMLButtonElement | null,
                eye: document.querySelector('#eyeIconConfirm') as HTMLImageElement | null,
            },
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

    showLoginError(message: string): void {
        this.clearLoginError();
        
        ['login-email', 'login-password'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('error');
        });

        const form = document.getElementById('login-form');
        if (!form) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'login-error alert alert-error';
        errorDiv.textContent = message;
        form.parentNode?.insertBefore(errorDiv, form);
    },

    clearLoginError(): void {
        document.querySelectorAll('.login-error, .alert-error').forEach(el => el.remove());
        ['login-email', 'login-password'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('error');
        });
    },

    showFieldErrors(fieldErrors: Record<string, string | null>): void {
        this.clearFieldErrors();
        
        Object.entries(fieldErrors).forEach(([field, error]) => {
            if (!error) return;
            const inputId = field === 'confirmPassword' ? 'register-confirm' : `register-${field}`;
            const input = document.getElementById(inputId);
            
            if (input) {
                input.classList.add('error');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = error;
                input.parentNode?.appendChild(errorDiv);
            }
        });
    },

    clearFieldErrors(): void {
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    },

    attachLoginListeners(): void {
        const form = document.getElementById('login-form') as HTMLFormElement;
        if (!form) return;
        
        if (this._loginHandler) {
            form.removeEventListener('submit', this._loginHandler);
        }

        const handler: EventListener = (e: Event) => {
            e.preventDefault();
            const email = (document.getElementById('login-email') as HTMLInputElement)?.value || '';
            const password = (document.getElementById('login-password') as HTMLInputElement)?.value || '';
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
                name: (document.getElementById('register-name') as HTMLInputElement)?.value || '',
                email: (document.getElementById('register-email') as HTMLInputElement)?.value || '',
                password: (document.getElementById('register-password') as HTMLInputElement)?.value || '',
                confirmPassword: (document.getElementById('register-confirm') as HTMLInputElement)?.value || '',
            };
            this.handleRegisterSubmit(data);
        };
        
        this._registerHandler = handler;
        form.addEventListener('submit', handler);
    },
};
