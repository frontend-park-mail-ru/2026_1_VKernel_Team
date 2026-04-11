import { authActions } from '@/actions/authActions';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { AppController } from '@/controllers/AppController'; // Добавляем импорт
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
        fieldErrors?: Record<string, string | null>,
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
        uiActions.showLoading(true); // Показываем лоадер
        
        try {
            const result = await authActions.login({ email, password });

            if (result.isValid) {
                // Проверяем, что store обновился
                console.log('Login success, isAuthenticated:', store.isAuthenticated);
                console.log('User:', store.user);
                
                uiActions.showSuccess('Вход выполнен!');
                
                // Небольшая задержка для обновления store
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Используем AppController для навигации
                AppController.navigateTo('/');
                // или прямой вызов
                // window.location.href = '/';
            } else {
                uiActions.showError(result.error || 'Ошибка входа');
                this.showLoginError(result.error ?? 'Ошибка входа');
            }
        } catch (error) {
            console.error('Login error:', error);
            uiActions.showError('Ошибка сети при входе');
            this.showLoginError('Ошибка сети при входе');
        } finally {
            uiActions.showLoading(false); // Скрываем лоадер
        }
    },

    async handleRegisterSubmit(data: any): Promise<void> {
        uiActions.showLoading(true);
        
        try {
            const result = await authActions.register(data);

            if (result.isValid) {
                uiActions.showSuccess('Регистрация успешна!');
                
                // Небольшая задержка для обновления store
                await new Promise(resolve => setTimeout(resolve, 100));
                
                AppController.navigateTo('/');
            } else {
                uiActions.showError(result.error || 'Ошибка регистрации');
                
                // Показываем ошибки полей, если они есть
                if (result.fieldErrors) {
                    this.showFieldErrors(result.fieldErrors);
                }
            }
        } catch (error) {
            console.error('Register error:', error);
            uiActions.showError('Ошибка сети при регистрации');
        } finally {
            uiActions.showLoading(false);
        }
    },

    async handleLogout(): Promise<void> {
        uiActions.showLoading(true);
        
        try {
            await authActions.logout();
            localStorage.removeItem('authToken');
            
            // Очищаем store
            store.setState({ isAuthenticated: false, user: null });
            
            uiActions.showSuccess('Вы успешно вышли из аккаунта');
            AppController.navigateTo('/');
        } catch (error) {
            console.error('Logout error:', error);
            uiActions.showError('Ошибка при выходе');
        } finally {
            uiActions.showLoading(false);
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
                // Удаляем старые обработчики
                const newBtn = btn.cloneNode(true) as HTMLButtonElement;
                btn.parentNode?.replaceChild(newBtn, btn);
                
                const newEyeIcon = newBtn.querySelector('img') as HTMLImageElement;
                
                newBtn.addEventListener('click', () => {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    newEyeIcon.src = isPassword
                        ? this.UI_CONSTANTS.EYE_OPEN
                        : this.UI_CONSTANTS.EYE_CLOSED;
                    newEyeIcon.alt = isPassword ? 'Скрыть пароль' : 'Показать пароль';
                });
            }
        });
    },

    showLoginError(message: string): void {
        this.clearLoginError();
        ['email', 'password'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.classList.add('error');
        });

        const form = document.getElementById('login-forms');
        if (!form) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'login-error alert-error';
        errorDiv.textContent = message;
        form.parentNode?.insertBefore(errorDiv, form);
    },

    clearLoginError(): void {
        document.querySelectorAll('.login-error, .alert-error').forEach((el) => el.remove());
        ['email', 'password'].forEach((id) => {
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
        document.querySelectorAll('.field-error').forEach((el) => el.remove());
        document.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
    },

    attachLoginListeners(): void {
        const form = document.getElementById('login-forms') as HTMLFormElement;
        if (!form) return;

        // Удаляем старый обработчик
        if (this._loginHandler) {
            form.removeEventListener('submit', this._loginHandler);
        }

        const handler: EventListener = async (e: Event) => {
            e.preventDefault();
            
            // Блокируем повторную отправку
            const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Вход...';
            }
            
            const email = (document.getElementById('email') as HTMLInputElement)?.value || '';
            const password = (document.getElementById('password') as HTMLInputElement)?.value || '';
            
            await this.handleLoginSubmit(email, password);
            
            // Разблокируем кнопку
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Войти';
            }
        };

        this._loginHandler = handler;
        form.addEventListener('submit', handler);
    },

    attachRegisterListeners(): void {
        const form = document.getElementById('register-form') as HTMLFormElement;
        if (!form) return;

        // Удаляем старый обработчик
        if (this._registerHandler) {
            form.removeEventListener('submit', this._registerHandler);
        }

        const handler: EventListener = async (e: Event) => {
            e.preventDefault();
            
            // Блокируем повторную отправку
            const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Регистрация...';
            }
            
            const data = {
                name: (document.getElementById('name') as HTMLInputElement)?.value || '',
                email: (document.getElementById('email') as HTMLInputElement)?.value || '',
                password: (document.getElementById('password') as HTMLInputElement)?.value || '',
                confirmPassword:
                    (document.getElementById('confirm-password') as HTMLInputElement)?.value || '',
            };
            
            await this.handleRegisterSubmit(data);
            
            // Разблокируем кнопку
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Зарегистрироваться';
            }
        };

        this._registerHandler = handler;
        form.addEventListener('submit', handler);
    },
};
