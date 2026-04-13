/**
 * Главный контроллер приложения
 * Управляет роутингом, инициализацией и глобальными обработчиками
 */
import adDetailTpl from '@modules/announcements/ad-detail/templates/ad-detail.hbs';
import mainPageTpl from '@templates/main-page.hbs';
import loginFormsTpl from '@templates/login-forms.hbs';
import registerFormTpl from '@templates/register-form.hbs';
import userProfileTpl from '@templates/user-profile.hbs';
import authLinksTpl from '@templates/auth-links.hbs';
import notFoundTpl from '@templates/not-found.hbs';

import { PlaceAnAdController } from '@modules/announcements/place-an-ad';
import { AdPreviewController } from '@modules/announcements/ad-preview';
import { AdDetailController } from '@modules/announcements/ad-detail';
import { AuthController } from '@/controllers/AuthController';
import { AdsController } from '@/controllers/AdsController';
import { ProfileController } from '@/controllers/ProfileController';
import { SellerPageController } from '@modules/seller-page/controller';
import { loadTemplates as loadSellerPageTemplates } from '@modules/seller-page/pages/seller-page/seller-page';
import { CartController } from '@modules/cart/controller';
import { loadTemplates as loadCartTemplates } from '@modules/cart/pages/cart/cart';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import type { HandlebarsTemplateFunction, TemplateName, UIConstants } from '@/types';
import { authActions } from '@/actions/authActions';
import { CONFIG } from '@/core/config';
import { initOfflineIndicator } from '@modules/common/offline/offline-indicator';

declare const Handlebars: any;

export const AppController = {
    _lastPage: '',
    _currentFeature: '',
    templates: {} as Record<TemplateName, HandlebarsTemplateFunction>,

    UI_CONSTANTS: {
        DEFAULT_AVATAR: '/images/default-avatar.jpg',
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
        EYE_OPEN: '/images/icons/Eye.jpeg',
        EYE_CLOSED: '/images/icons/Eye-off.jpeg',
        LOADER_HTML: '<div class="spinner"></div>',
    } as UIConstants,

    currentPhotoIndex: 0,
    allPhotosArray: [] as string[],

    async init(): Promise<void> {
        await this.loadTemplates();
        loadSellerPageTemplates();
        loadCartTemplates();
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

        initOfflineIndicator();
    },

    async loadTemplates(): Promise<void> {
        // Шаблоны уже прекомпилированы лоадером, просто присваиваем их
        this.templates['main-page'] = mainPageTpl;
        this.templates['login-forms'] = loginFormsTpl;
        this.templates['register-form'] = registerFormTpl;
        this.templates['user-profile'] = userProfileTpl;
        this.templates['auth-links'] = authLinksTpl;
        this.templates['not-found'] = notFoundTpl;
        this.templates['ad-detail'] = adDetailTpl;

        // Регистрация хелперов остаётся (они нужны для рендера)
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
            if (!source) {
                return DEFAULT_AVATAR;
            }

            const trimmed = source.trim();
            if (!trimmed) {
                return DEFAULT_AVATAR;
            }

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
        if (state.currentPage !== this._lastPage) {
            this._lastPage = state.currentPage;
            this.router();
        }
    },

    router(): void {
        const path = window.location.pathname;
        const adMatch = path.match(/^\/ad\/(\d+)$/);

        if (path === '/place-ad') {
            if (this._currentFeature === 'place-ad') {
                PlaceAnAdController.cleanup();
            }
            this._currentFeature = 'place-ad';
            PlaceAnAdController.render();
            return;
        }

        if (path === '/ad-preview') {
            if (this._currentFeature === 'ad-preview') {
                AdPreviewController.cleanup();
            }
            this._currentFeature = 'ad-preview';
            AdPreviewController.render();
            return;
        }

        if (adMatch) {
            const adId = adMatch[1];

            if (this._currentFeature === 'ad-detail') {
                AdDetailController.cleanup();
            }
            this._currentFeature = 'ad-detail';
            AdDetailController.render(adId);
            return;
        }

        if (!store.isAuthenticated && (path === '/profile' || path === '/cart')) {
            window.history.pushState({}, '', '/login');
            uiActions.navigateTo('/login');
            AuthController.showLogin();
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
