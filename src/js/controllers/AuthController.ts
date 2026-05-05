import { authActions } from '@/actions/authActions';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { consumeReturnTo } from '@/utils/returnTo';
import { AuthValidator } from '@/validators/authValidator';
import type { HandlebarsTemplateFunction } from '@/types';
declare const Handlebars: any;

const LIVE_VALIDATION_DEBOUNCE_MS = 250;

export const AuthController = {
    templates: {} as Record<string, HandlebarsTemplateFunction>,
    UI_CONSTANTS: {
        EYE_OPEN: '/images/icons/Eye.jpeg',
        EYE_CLOSED: '/images/icons/Eye-off.jpeg',
    },
    _loginHandler: null as EventListener | null,
    _registerHandler: null as EventListener | null,

    navigateTo(path: string): void {
        window.location.href = path;
    },

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
        this.attachLiveValidation('login');
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
        this.attachLiveValidation('register');
    },

    /**
     * Подключает «живую» валидацию: ошибки появляются прямо при наборе,
     * без ожидания submit'а. Использует debounce, чтобы не дёргать на каждый символ.
     */
    attachLiveValidation(form: 'login' | 'register'): void {
        const fields: { id: string; validate: (v: string, ctx?: any) => string | null }[] =
            form === 'register'
                ? [
                      { id: 'name', validate: (v) => AuthValidator.validateName(v) },
                      { id: 'email', validate: (v) => AuthValidator.validateEmail(v) },
                      { id: 'password', validate: (v) => AuthValidator.validatePassword(v) },
                      {
                          id: 'confirm-password',
                          validate: (v) => {
                              const pwd =
                                  (document.getElementById('password') as HTMLInputElement)
                                      ?.value || '';
                              return v === pwd ? null : 'Пароли не совпадают';
                          },
                      },
                  ]
                : [
                      { id: 'email', validate: (v) => AuthValidator.validateEmail(v) },
                      { id: 'password', validate: (v) => AuthValidator.validatePassword(v) },
                  ];

        fields.forEach((field) => {
            const input = document.getElementById(field.id) as HTMLInputElement | null;
            if (!input) return;

            let timer: ReturnType<typeof setTimeout> | null = null;
            const runValidation = () => {
                const value = input.value;
                if (!value) {
                    this.clearFieldErrorAt(input);
                    return;
                }
                const err = field.validate(value);
                if (err) {
                    this.setFieldErrorAt(input, err);
                } else {
                    this.clearFieldErrorAt(input);
                }
            };

            input.addEventListener('input', () => {
                if (timer) clearTimeout(timer);
                timer = setTimeout(runValidation, LIVE_VALIDATION_DEBOUNCE_MS);
            });
            input.addEventListener('blur', runValidation);
        });
    },

    setFieldErrorAt(input: HTMLElement, message: string): void {
        input.classList.add('error');
        input.classList.add('is-invalid');
        const group = input.closest('.form-group');
        if (!group) return;
        let errEl = group.querySelector('.field-error') as HTMLElement | null;
        if (!errEl) {
            errEl = document.createElement('div');
            errEl.className = 'field-error';
            group.appendChild(errEl);
        }
        errEl.textContent = message;
    },

    clearFieldErrorAt(input: HTMLElement): void {
        input.classList.remove('error');
        input.classList.remove('is-invalid');
        const group = input.closest('.form-group');
        if (!group) return;
        const errEl = group.querySelector('.field-error');
        if (errEl) errEl.remove();
    },

    async handleLoginSubmit(email: string, password: string): Promise<void> {
        const result = await authActions.login({ email, password });

        if (result.isValid) {
            await authActions.checkAuth();
            const returnTo = consumeReturnTo();
            this.navigateTo(returnTo || '/');
        } else {
            this.showLoginError(result.error ?? 'Ошибка входа');
        }
    },

    async handleRegisterSubmit(data: any): Promise<void> {
        const result = await authActions.register(data);

        if (result.isValid) {
            await authActions.checkAuth();
            const returnTo = consumeReturnTo();
            this.navigateTo(returnTo || '/');
        } else {
            if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
                this.showFieldErrors(result.fieldErrors);
            } else {
                this.showFieldErrors({ email: result.error || 'Ошибка регистрации' });
            }
        }
    },

    async handleLogout(): Promise<void> {
        await authActions.logout();
        localStorage.removeItem('authToken');
        this.navigateTo('/');
    },

    initPasswordToggles(): void {
        const toggles = document.querySelectorAll('#togglePassword, #toggleConfirmPassword');
        toggles.forEach((toggleBtn) => {
            const btn = toggleBtn as HTMLButtonElement;
            const wrapper = btn.closest('.password-wrapper');
            const input = wrapper?.querySelector(
                'input[type="password"], input[type="text"]',
            ) as HTMLInputElement | null;
            const iconHost = btn.querySelector('[data-eye-state]') as HTMLElement | null;
            if (!input || !iconHost) return;

            const newBtn = btn.cloneNode(true) as HTMLButtonElement;
            btn.parentNode?.replaceChild(newBtn, btn);
            const newIconHost = newBtn.querySelector('[data-eye-state]') as HTMLElement | null;

            newBtn.addEventListener('click', async () => {
                const { ICONS } = await import('@/utils/icons');
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                if (newIconHost) {
                    newIconHost.dataset.eyeState = isPassword ? 'on' : 'off';
                    newIconHost.innerHTML = isPassword ? ICONS.eye : ICONS['eye-off'];
                }
                newBtn.setAttribute('aria-label', isPassword ? 'Скрыть пароль' : 'Показать пароль');
            });
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
        if (this._loginHandler) form.removeEventListener('submit', this._loginHandler);

        const handler: EventListener = async (e: Event) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Вход...';
            }

            const email = (document.getElementById('email') as HTMLInputElement)?.value || '';
            const password = (document.getElementById('password') as HTMLInputElement)?.value || '';
            await this.handleLoginSubmit(email, password);

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
        if (this._registerHandler) form.removeEventListener('submit', this._registerHandler);

        const handler: EventListener = async (e: Event) => {
            e.preventDefault();
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

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Зарегистрироваться';
            }
        };
        this._registerHandler = handler;
        form.addEventListener('submit', handler);
    },
};
