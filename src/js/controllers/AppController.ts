/**
 * Главный контроллер приложения
 * Управляет роутингом, инициализацией и глобальными обработчиками
 */

import { AuthController } from '@/controllers/AuthController';
import { AdsController } from '@/controllers/AdsController';
import { ProfileController } from '@/controllers/ProfileController';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import type {
    HandlebarsTemplateFunction,
    TemplateName,
    UIConstants,
} from '@/types';
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
        await this.loadTemplates();
        AuthController.templates = {
            'login-forms': this.templates['login-forms'],
            'register-form': this.templates['register-form'],
        };
        AdsController.templates = {
            'main-page': this.templates['main-page'],
        };
        ProfileController.templates = {
            'user-profile': this.templates['user-profile'],
        };

        this.setupGlobalHandlers();
        this.setupStoreSubscription();

        await this.checkAuth().catch(() => {});

        this.router();
        window.addEventListener('popstate', () => this.router());
    },

    async loadTemplates(): Promise<void> {
        const templateNames: TemplateName[] = [
            'auth-links',
            'login-forms',
            'register-form',
            'user-profile',
            'main-page',
            'not-found',
        ];

        for (const name of templateNames) {
            try {
                const response = await fetch(`/templates/${name}.hbs`);
                const source = await response.text();
                this.templates[name] = Handlebars.compile(source);
            } catch (error) {
                console.error(`Failed to load template ${name}:`, error);
            }
        }
        this.registerHandlebarsHelpers();
    },

    registerHandlebarsHelpers(): void {
        Handlebars.registerHelper('formatPrice', (price: number) => {
            return price === 0 ? 'Бесплатно' : `${price} ₽`;
        });

        Handlebars.registerHelper(
            'ifAuthenticated',
            function (this: any, options: Handlebars.HelperOptions) {
                return store.isAuthenticated
                    ? options.fn(this)
                    : options.inverse(this);
            },
        );
    },

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
        if (state.currentPage !== this._lastPage) {
            this._lastPage = state.currentPage;
            this.router();
        }
    },

    router(): void {
        const path = window.location.pathname;
        uiActions.navigateTo(path);

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

    navigateTo(path: string): void {
        window.history.pushState({}, '', path);
        uiActions.navigateTo(path);
        this.router();
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
