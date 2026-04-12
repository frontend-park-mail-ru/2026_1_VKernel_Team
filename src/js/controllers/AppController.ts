/**
 * Главный контроллер приложения
 * Управляет роутингом, инициализацией и глобальными обработчиками
 */
import { AuthController } from '@/controllers/AuthController';
import { AdsController } from '@/controllers/AdsController';
import { ProfileController } from '../../modules/profile/controller';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import type { HandlebarsTemplateFunction, TemplateName, UIConstants } from '@/types';
import { authActions } from '@/actions/authActions';

declare const Handlebars: any;

export const AppController = {
    _lastPage: '',
    templates: {} as Record<TemplateName, HandlebarsTemplateFunction>,

    UI_CONSTANTS: {
        DEFAULT_AVATAR: '/images/default-avatar.jpg',
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
        EYE_OPEN: '/images/icons/Eye.jpeg',
        EYE_CLOSED: '/images/icons/Eye-off.jpeg',
        LOADER_HTML: '<div class="spinner"></div>',
    } as UIConstants,

    async init(): Promise<void> {
        // 1. Сначала регистрируем хелперы ДО импорта шаблонов
        this.registerHandlebarsHelpers();
        
        // 2. Затем загружаем шаблоны
        await this.loadTemplates();
        
        AuthController.templates = {
            'login-forms': this.templates['login-forms'],
            'register-form': this.templates['register-form'],
        };
        AdsController.templates = {
            'main-page': this.templates['main-page'],
        };
        // ProfileController.templates = {
        //     'user-profile': this.templates['user-profile'],
        // };

        this.setupGlobalHandlers();
        this.setupStoreSubscription();

        await this.checkAuth().catch(() => {});

        this.router();
        window.addEventListener('popstate', () => this.router());
    },

    registerHandlebarsHelpers(): void {
        // Проверяем, не зарегистрированы ли уже хелперы
        if (Handlebars.helpers.formatPrice) return;
        
        // Базовые хелперы
        Handlebars.registerHelper('formatPrice', (price: number) => {
            return price === 0 ? 'Бесплатно' : `${price} ₽`;
        });

        Handlebars.registerHelper(
            'ifAuthenticated',
            function (this: any, options: any) {
                return store.isAuthenticated
                    ? options.fn(this)
                    : options.inverse(this);
            },
        );
        
        Handlebars.registerHelper('eq', function (a: any, b: any) {
            return a === b;
        });
        
        Handlebars.registerHelper('ne', function (a: any, b: any) {
            return a !== b;
        });
        
        Handlebars.registerHelper('gt', function (a: number, b: number) {
            return a > b;
        });
        
        Handlebars.registerHelper('lt', function (a: number, b: number) {
            return a < b;
        });
        
        Handlebars.registerHelper('gte', function (a: number, b: number) {
            return a >= b;
        });
        
        Handlebars.registerHelper('lte', function (a: number, b: number) {
            return a <= b;
        });
        
        Handlebars.registerHelper('and', function (a: any, b: any) {
            return a && b;
        });
        
        Handlebars.registerHelper('or', function (a: any, b: any) {
            return a || b;
        });
        
        Handlebars.registerHelper('not', function (a: any) {
            return !a;
        });
    },

    async loadTemplates(): Promise<void> {
        // Динамический импорт шаблонов ПОСЛЕ регистрации хелперов
        const mainPageTpl = (await import('@templates/main-page.hbs')).default;
        const loginFormsTpl = (await import('@templates/login-forms.hbs')).default;
        const registerFormTpl = (await import('@templates/register-form.hbs')).default;
        const userProfileTpl = (await import('@templates/user-profile.hbs')).default;
        const authLinksTpl = (await import('@templates/auth-links.hbs')).default;
        const notFoundTpl = (await import('@templates/not-found.hbs')).default;
        
        this.templates['main-page'] = mainPageTpl;
        this.templates['login-forms'] = loginFormsTpl;
        this.templates['register-form'] = registerFormTpl;
        this.templates['user-profile'] = userProfileTpl;
        this.templates['auth-links'] = authLinksTpl;
        this.templates['not-found'] = notFoundTpl;
    },

    // Остальной код без изменений...
    async checkAuth(): Promise<void> {
        await authActions.checkAuth();
    },

    setupStoreSubscription(): void {
        store.subscribe((state) => {
            this.onStateChange(state);
        });
    },

    onStateChange(state: any): void {
        this.showLoading(state.isLoading);
        if (state.error) {
            uiActions.showError(state.error);
        }
        if (state.currentPage && state.currentPage !== this._lastPage) {
            this._lastPage = state.currentPage;
            this.router();
        }
    },

    router(): void {
        const path = window.location.pathname;

        if (!store.isAuthenticated && path === '/profile') {
            uiActions.navigateTo('/login');
            AuthController.showLogin();
            return;
        }

        switch (path) {
            case '/':
            case '/index.html':
                AdsController.renderMain();
                break;
            case '/login':
                AuthController.showLogin();
                break;
            case '/register':
                AuthController.showRegister();
                break;
            case '/profile':
                ProfileController.showProfile();
                break;
            default:
                this.renderNotFound();
        }
    },

    // В AppController.ts
    navigateTo(path: string): void {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
    
    // Если uiActions.navigateTo просто пишет в лог/URL, оставляем:
        if (typeof uiActions.navigateTo === 'function') {
            uiActions.navigateTo(path);
        }
    },

    renderNotFound(): void {
        const app = document.getElementById('app');
        if (!app || !this.templates['not-found']) return;
        app.innerHTML = this.templates['not-found']();
    },

    setupGlobalHandlers(): void {
        document.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;

            const navElement = target.closest('[data-nav]');
            if (navElement) {
                e.preventDefault();
                const path = (navElement as HTMLElement).dataset.nav;
                if (path) this.navigateTo(path);
                return;
            }

            const actionElement = target.closest('[data-action]');
            if (actionElement) {
                e.preventDefault();
                const action = (actionElement as HTMLElement).dataset.action;
                if (action === 'logout') {
                    AuthController.handleLogout();
                }
                return;
            }
        });
    },

    showLoading(show: boolean): void {
        let loader = document.getElementById('global-loader');

        if (!show) {
            loader?.remove();
            return;
        }

        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.className = 'loader-overlay';
            loader.innerHTML = this.UI_CONSTANTS.LOADER_HTML;
            document.body.appendChild(loader);
        }
    },
};
