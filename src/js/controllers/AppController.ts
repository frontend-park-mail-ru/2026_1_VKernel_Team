/**
 * Главный контроллер приложения
 * Управляет роутингом, инициализацией и глобальными обработчиками
 */
import adDetailTpl from '@modules/announcements/ad-detail/templates/ad-detail.hbs';
import mainPageTpl from '@templates/main-page.hbs';
import loginFormsTpl from '@templates/login-forms.hbs';
import registerFormTpl from '@templates/register-form.hbs';
import userProfileTpl from '@modules/profile/pages/profile/profile.hbs';
import authLinksTpl from '@templates/auth-links.hbs';
import notFoundTpl from '@templates/not-found.hbs';

import { PlaceAnAdController } from '@modules/announcements/place-an-ad';
import { AdPreviewController } from '@modules/announcements/ad-preview';
import { AdDetailController } from '@modules/announcements/ad-detail';
import headerTemplate from '@modules/common/components/header/header.hbs?raw';

import { AuthController } from '@/controllers/AuthController';
import { AdsController } from '@/controllers/AdsController';
import { SellerPageController } from '@modules/seller-page/controller';
import { loadTemplates as loadSellerPageTemplates } from '@modules/seller-page/pages/seller-page/seller-page';
import { CartController } from '@modules/cart/controller';
import { loadTemplates as loadCartTemplates } from '@modules/cart/pages/cart/cart';
import { loadTemplates as loadProfileTemplates } from '@modules/profile/pages/profile/profile';
import { ProfileController } from '@modules/profile/controller';

import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import type { HandlebarsTemplateFunction, TemplateName, UIConstants } from '@/types';
import { authActions } from '@/actions/authActions';
import { CONFIG } from '@/core/config';
import { initOfflineIndicator } from '@modules/common/offline/offline-indicator';

import * as HandlebarsFull from 'handlebars';
import * as HandlebarsRuntime from 'handlebars/dist/handlebars.runtime.js';

const registerHelpers = (Hbs: any) => {
    if (!Hbs || !Hbs.registerHelper || Hbs.helpers?.avatarUrl) {
        return;
    }

    Hbs.registerHelper('formatPrice', (price: number) => {
        return price === 0 ? 'Бесплатно' : `${price} ₽`;
    });

    Hbs.registerHelper('ifAuthenticated', function (this: any, options: any) {
        return store.isAuthenticated ? options.fn(this) : options.inverse(this);
    });

    Hbs.registerHelper('avatarUrl', function (avatar: any, avatarPath: any) {
        const DEFAULT_AVATAR = '/images/logo/avatar.jpeg';

        const source =
            typeof avatar === 'string' ? avatar : typeof avatarPath === 'string' ? avatarPath : '';

        if (!source) {
            return DEFAULT_AVATAR;
        }

        const trimmed = source.trim();
        if (!trimmed) {
            return DEFAULT_AVATAR;
        }

        if (
            trimmed.startsWith('http://') ||
            trimmed.startsWith('https://') ||
            trimmed.startsWith('data:')
        ) {
            return trimmed;
        }

        const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
        return `${CONFIG.API.BASE_URL}${normalized}`;
    });

    Hbs.registerHelper('eq', function (a: any, b: any) {
        return a === b;
    });
    Hbs.registerHelper('gt', function (a: any, b: any) {
        return a > b;
    });
    Hbs.registerHelper('concat', function (...args: any[]) {
        return args.slice(0, -1).join('');
    });
    Hbs.registerHelper('array', function (...args: any[]) {
        return args.slice(0, -1);
    });

    Hbs.registerHelper('labelForTab', function (tab: string) {
        const labels: Record<string, string> = {
            info: 'Личные данные',
            ads: 'Мои объявления',
            favorites: 'Избранное',
            cart: 'Корзина',
            messages: 'Сообщения',
            purchases: 'Мои покупки',
            wallet: 'Кошелёк',
            settings: 'Настройки',
        };
        return labels[tab] || tab;
    });

    Hbs.registerHelper('formatDate', function (dateString: string) {
        if (!dateString) {
            return '—';
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '—';
        }
        return date.toLocaleDateString('ru-RU');
    });
};

export const AppController = {
    _lastPage: '',
    _currentFeature: '',
    _lastAuthState: null as boolean | null,
    _lastAvatarPath: null as string | null,
    _headerCompiled: null as HandlebarsTemplateFunction | null,
    templates: {} as Record<TemplateName, HandlebarsTemplateFunction>,

    UI_CONSTANTS: {
        DEFAULT_AVATAR: '/images/default-avatar.jpg',
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
        EYE_OPEN: '/images/icons/Eye.jpeg',
        EYE_CLOSED: '/images/icons/Eye-off.jpeg',
        LOADER_HTML: '<div class="spinner"></div>',
    } as UIConstants,

    async init(): Promise<void> {
        registerHelpers(HandlebarsFull);
        registerHelpers(HandlebarsRuntime);
        if (typeof window !== 'undefined' && (window as any).Handlebars) {
            registerHelpers((window as any).Handlebars);
        }

        await this.loadTemplates();
        loadSellerPageTemplates();
        loadCartTemplates();
        loadProfileTemplates();

        AuthController.templates = {
            'login-forms': this.templates['login-forms'],
            'register-form': this.templates['register-form'],
        };
        AdsController.templates = {
            'main-page': this.templates['main-page'],
        };
        ProfileController.templates = {
            'profile-page': this.templates['user-profile'],
        };

        this.setupGlobalHandlers();
        this.setupStoreSubscription();

        await this.checkAuth().catch(() => {});
        if (store.isAuthenticated) {
            await AdsController.syncFavorites();
        }
        window.addEventListener('app:navigate', ((e: CustomEvent) => {
            if (e.detail && e.detail.path) {
                this.navigateTo(e.detail.path);
            }
        }) as EventListener);

        window.addEventListener('app:route', () => {
            this.router();
        });
        window.addEventListener('app:loading', ((e: CustomEvent) => {
            if (e.detail !== undefined) {
                this.showLoading(e.detail.show);
            }
        }) as EventListener);
        this.renderHeader();
        this.router();
        window.addEventListener('popstate', () => this.router());

        initOfflineIndicator();
    },

    async loadTemplates(): Promise<void> {
        this.templates['main-page'] = mainPageTpl;
        this.templates['login-forms'] = loginFormsTpl;
        this.templates['register-form'] = registerFormTpl;
        this.templates['auth-links'] = authLinksTpl;
        this.templates['not-found'] = notFoundTpl;
        this.templates['user-profile'] = userProfileTpl;
        this.templates['ad-detail'] = adDetailTpl;
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
            uiActions.clearError();
        }
        const currentAvatar = state.user?.avatar_path || null;
        if (
            this._lastAuthState !== state.isAuthenticated ||
            this._lastAvatarPath !== currentAvatar
        ) {
            this._lastAuthState = state.isAuthenticated;
            this._lastAvatarPath = currentAvatar;
            this.renderHeader();
        }
        if (state.currentPage && state.currentPage !== this._lastPage) {
            this._lastPage = state.currentPage;
            this.router();
        }
    },

    renderHeader(): void {
        const container = document.getElementById('app-header');
        if (!container) {
            return;
        }

        const path = window.location.pathname;
        const isAuthPage = path === '/login' || path === '/register';

        if (isAuthPage) {
            container.style.display = 'none';
            return;
        }
        container.style.display = '';

        const Hbs = (window as any).Handlebars || HandlebarsFull;
        if (!this._headerCompiled) {
            this._headerCompiled = Hbs.compile(headerTemplate);
        }

        const user = store.user;
        
        container.innerHTML = this._headerCompiled!({
            isAuthenticated: store.isAuthenticated,
            user,
            favoritesCount: store.favoriteIds.size,
        });
    },

    router(): void {
        this.renderHeader();
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

        const editAdMatch = path.match(/^\/edit-ad\/(\d+)$/);
        if (editAdMatch) {
            if (this._currentFeature === 'place-ad') {
                PlaceAnAdController.cleanup();
            }
            this._currentFeature = 'place-ad';
            PlaceAnAdController.render(editAdMatch[1]);
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
        if (window.location.pathname === path) {
            return;
        }
        window.history.pushState({}, '', path);
        uiActions.navigateTo(path);
        this.router();
    },

    renderNotFound(): void {
        const app = document.getElementById('app');
        if (!app || !this.templates['not-found']) {
            return;
        }
        app.innerHTML = this.templates['not-found']({});
    },

    setupGlobalHandlers(): void {
        document.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;

            const navElement = target.closest('[data-nav]');
            if (navElement) {
                e.preventDefault();
                const path = (navElement as HTMLElement).dataset.nav;
                const tab = (navElement as HTMLElement).dataset.tab;

                if (path === '/profile' && tab) {
                    ProfileController.currentTab = tab as any;
                } else if (path === '/profile' && !tab) {
                    ProfileController.currentTab = 'ads';
                }
                if (path) {
                    this.navigateTo(path);
                }
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
