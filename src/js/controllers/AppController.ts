import { AuthController } from './AuthController.js';
import { AdsController } from './AdsController.js';
import { ProfileController } from './ProfileController.js';
import type { HandlebarsTemplateFunction, TemplateName, UIConstants, User } from '../types.js';

// ✅ Handlebars доступен глобально из CDN
declare const Handlebars: any;

const AppController = {
    templates: {} as Record<TemplateName, HandlebarsTemplateFunction>,
    currentView: 'main-page' as string,
    isAuthenticated: false,
    user: null as User | null,

    UI_CONSTANTS: {
        DEFAULT_AVATAR: '/images/default-avatar.jpg',
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
        EYE_OPEN: '/images/icons/Eye.jpeg',
        EYE_CLOSED: '/images/icons/Eye-off.jpeg',
        LOADER_HTML: '<div class="spinner"></div>',
    } as UIConstants,

    async init(): Promise<void> {
        await this.loadTemplates();
        await AuthController.checkAuth();
        this.setupGlobalHandlers();
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
            // ✅ Путь должен быть /src/templates/ (сервер отдаёт из src/)
            const response = await fetch(`/src/templates/${name}.hbs`);
            const source = await response.text();
            this.templates[name] = Handlebars.compile(source);
        }

        this.registerHandlebarsHelpers();
    },

    registerHandlebarsHelpers(): void {
        Handlebars.registerHelper('formatPrice', (price: number) => {
            return price === 0 ? 'Бесплатно' : price + ' ₽';
        });

        Handlebars.registerHelper('ifAuthenticated', function (this: any, options: Handlebars.HelperOptions) {
            return AppController.isAuthenticated ? options.fn(this) : options.inverse(this);
        });
    },

    async router(): Promise<void> {
        const path = window.location.pathname;

        if (!this.isAuthenticated && ['/profile'].includes(path)) {
            this.navigateTo('/login');
            return;
        }

        switch (path) {
            case '/':
            case '/index.html':
                await AdsController.renderMain();
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
                    AuthController.logout();
                }
                return;
            }
        });
    },

    showLoading(show: boolean): void {
        const loader = document.getElementById('global-loader');
        if (!show) {
            loader?.remove();
            return;
        }
        if (!loader) {
            const newLoader = document.createElement('div');
            newLoader.id = 'global-loader';
            newLoader.className = 'loader-overlay';
            newLoader.innerHTML = this.UI_CONSTANTS.LOADER_HTML;
            document.body.appendChild(newLoader);
        }
    },
};

export { AppController };
