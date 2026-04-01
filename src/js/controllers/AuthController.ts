/**
 * Контроллер авторизации
 * Обрабатывает формы входа и регистрации
 */

import { authActions } from '@/actions/authActions';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { AppController } from '@/controllers/AppController';

export const AuthController = {
    /**
     * Показать форму входа
     */
    async showLogin(error?: string): Promise<void> {
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        if (!app || !AppController.templates['login-forms']) return;

        app.innerHTML = AppController.templates['login-forms']({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            error: error || null,
        });

        this.attachLoginListeners();
    },

    /**
     * Показать форму регистрации
     */
    async showRegister(error?: string, fieldErrors?: Record<string, string>): Promise<void> {
        document.body.classList.add('auth-page');
        const app = document.getElementById('app');
        if (!app || !AppController.templates['register-form']) return;

        app.innerHTML = AppController.templates['register-form']({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            error: error || null,
            fieldErrors: fieldErrors || {},
        });

        this.attachRegisterListeners();
    },

    /**
     * Обработчик отправки формы входа
     */
    async handleLoginSubmit(email: string, password: string): Promise<void> {
        const result = await authActions.login({ email, password });

        if (result.isValid) {
            uiActions.showSuccess('Вход выполнен!');
            uiActions.navigateTo('/');
            AppController.router();
        } else {
            uiActions.showError(result.error || 'Ошибка входа');
            this.showLogin(result.error);
        }
    },

    /**
     * Обработчик отправки формы регистрации
     */
    async handleRegisterSubmit(data: any): Promise<void> {
        const result = await authActions.register(data);

        if (result.isValid) {
            uiActions.showSuccess('Регистрация успешна!');
            uiActions.navigateTo('/');
            AppController.router();
        } else {
            uiActions.showError(result.error || 'Ошибка регистрации');
            this.showRegister(result.error, result.fieldErrors);
        }
    },

    /**
     * Обработчик выхода
     */
    async handleLogout(): Promise<void> {
        await authActions.logout();
        uiActions.navigateTo('/');
        AppController.router();
    },

    /**
     * Навешивает обработчики на форму входа
     */
    attachLoginListeners(): void {
        const form = document.getElementById('login-form') as HTMLFormElement;
        if (!form) return;

        form.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            const email = (document.getElementById('login-email') as HTMLInputElement)?.value || '';
            const password = (document.getElementById('login-password') as HTMLInputElement)?.value || '';
            this.handleLoginSubmit(email, password);
        });
    },

    /**
     * Навешивает обработчики на форму регистрации
     */
    attachRegisterListeners(): void {
        const form = document.getElementById('register-form') as HTMLFormElement;
        if (!form) return;

        form.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            const data = {
                name: (document.getElementById('register-name') as HTMLInputElement)?.value || '',
                email: (document.getElementById('register-email') as HTMLInputElement)?.value || '',
                password: (document.getElementById('register-password') as HTMLInputElement)?.value || '',
                confirmPassword: (document.getElementById('register-confirm') as HTMLInputElement)?.value || '',
            };
            this.handleRegisterSubmit(data);
        });
    },
};
