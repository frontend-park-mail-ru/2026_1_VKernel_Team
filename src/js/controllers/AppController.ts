/**
 * Главный контроллер приложения
 * Управляет роутингом, инициализацией и глобальными обработчиками
 */
import mainPageTpl from '@templates/main-page.hbs';
import loginFormsTpl from '@templates/login-forms.hbs';
import registerFormTpl from '@templates/register-form.hbs';
import userProfileTpl from '@modules/profile/pages/profile/profile.hbs';
import authLinksTpl from '@templates/auth-links.hbs';
import notFoundTpl from '@templates/not-found.hbs';

import { AuthController } from '@/controllers/AuthController';
import { AdsController } from '@/controllers/AdsController';
import { SellerPageController } from '@modules/seller-page/controller';
import { loadTemplates as loadSellerPageTemplates } from '@modules/seller-page/pages/seller-page/seller-page';
import { CartController } from '@modules/cart/controller';
import { loadTemplates as loadCartTemplates } from '@modules/cart/pages/cart/cart';
import { ProfileController } from '@modules/profile/controller'; // Добавлен импорт профиля

import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import type { HandlebarsTemplateFunction, TemplateName, UIConstants } from '@/types';
import { authActions } from '@/actions/authActions';
import { CONFIG } from '@/core/config';

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
        loadSellerPageTemplates();
        loadCartTemplates();

        // Прокидываем шаблоны в дочерние контроллеры
        AuthController.templates = {
            'login-forms': this.templates['login-forms'],
            'register-form': this.templates['register-form'],
        };
        AdsController.templates = {
            'main-page': this.templates['main-page'],
        };

        this.setupGlobalHandlers();
        this.setupStoreSubscription();

        // Проверяем авторизацию перед первым роутингом
        await this.checkAuth().catch(() => {});

        this.router();
        window.addEventListener('popstate', () => this.router());
    },

    async loadTemplates(): Promise<void> {
        this.templates['main-page'] = mainPageTpl;
        this.templates['login-forms'] = loginFormsTpl;
        this.templates['register-form'] = registerFormTpl;
        this.templates['auth-links'] = authLinksTpl;
        this.templates['not-found'] = notFoundTpl;

        this.registerHandlebarsHelpers();
    },

    registerHandlebarsHelpers(): void {
        Handlebars.registerHelper('formatPrice', (price: number) => {
            return price === 0 ? 'Бесплатно' : `${price} ₽`;
        });

        Handlebars.registerHelper('ifAuthenticated', function (this: any, options: any) {
            return store.isAuthenticated ? options.fn(this) : options.inverse(this);
        });

        Handlebars.registerHelper('avatarUrl', (avatar: string, avatarPath: string) => {
            const DEFAULT_AVATAR = '/images/logo/avatar.jpeg';
            const source = avatar || avatarPath || '';
            if (!source) return DEFAULT_AVATAR;

            const trimmed = source.trim();
            if (!trimmed) return DEFAULT_AVATAR;

            if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
                return trimmed;
            }

            const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
            return `${CONFIG.API.BASE_URL}${normalized}`;
        });
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
        if (state.error) {
            uiActions.showError(state.error);
        }
        // Роутим только если путь реально изменился
        if (state.currentPage && state.currentPage !== this._lastPage) {
            this._lastPage = state.currentPage;
            this.router();
        }
    },

    

    router(): void {
        const path = window.location.pathname;

        if (!store.isAuthenticated && (path === '/profile' || path === '/cart')) {
            this.navigateTo('/login');
            return;
        }

        const sellerMatch = path.match(/^\/seller\/(\d+)$/);
        if (sellerMatch) {
            SellerPageController.renderSellerPage(sellerMatch[1]);
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
            case '/cart':
                CartController.renderCart();
                break;
            default:
                this.renderNotFound();
        }
    },

    navigateTo(path: string): void {
        if (window.location.pathname === path) return;
        window.history.pushState({}, '', path);
        uiActions.navigateTo(path);
        this.router();
    },

    renderNotFound(): void {
        const app = document.getElementById('app');
        if (!app || !this.templates['not-found']) return;
        app.innerHTML = this.templates['not-found']({});
    },

    setupGlobalHandlers(): void {
        document.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;

            // Обработка ссылок с data-nav
            const navElement = target.closest('[data-nav]');
            if (navElement) {
                e.preventDefault();
                const path = (navElement as HTMLElement).dataset.nav;
                if (path) this.navigateTo(path);
                return;
            }

            // Обработка кнопок действий (например, logout)
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
