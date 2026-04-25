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
import { ChatController } from '@modules/chat/controller';
import { loadTemplates as loadChatListTemplates } from '@modules/chat/pages/chat-list/chat-list';
import { loadTemplates as loadChatDetailTemplates } from '@modules/chat/pages/chat-detail/chat-detail';
import { unreadStore, UNREAD_CHANGED_EVENT } from '@modules/chat/unread-store';
import { StatsController } from '@modules/support-admin/controllers/statsController';

import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import type { HandlebarsTemplateFunction, TemplateName, UIConstants } from '@/types';
import { authActions } from '@/actions/authActions';
import { CONFIG } from '@/core/config';
import { initOfflineIndicator } from '@modules/common/offline/offline-indicator';
import '@modules/support/styles/support.css';

import * as HandlebarsFull from 'handlebars';
import * as HandlebarsRuntime from 'handlebars/dist/handlebars.runtime.js';

const registerHelpers = (Hbs: any) => {
    if (!Hbs || !Hbs.registerHelper || Hbs.helpers?.avatarUrl) return;

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

        if (!source) return DEFAULT_AVATAR;

        const trimmed = source.trim();
        if (!trimmed) return DEFAULT_AVATAR;

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
        if (!dateString) return '—';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '—';
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
        loadChatListTemplates();
        loadChatDetailTemplates();

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
        window.addEventListener(UNREAD_CHANGED_EVENT, () => {
            this.renderHeader();
        });
        this.renderHeader();
        this.router();
        window.addEventListener('popstate', () => this.router());

        if (store.isAuthenticated) {
            unreadStore.refreshCountFromServer();
        }

        initOfflineIndicator();
        this.initSupportWidget();
    },

    initSupportWidget(): void {
        // Кнопка-триггер
        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'support-trigger-btn';
        triggerBtn.id = 'support-trigger';
        triggerBtn.title = 'Техподдержка';
        triggerBtn.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.95 18q.525 0 .888-.363.362-.362.362-.887 0-.525-.362-.888-.363-.362-.888-.362-.525 0-.887.362-.363.363-.363.888t.363.887q.362.363.887.363Zm-.9-3.85h1.85q0-.825.188-1.3.187-.475 1.062-1.3.65-.65 1.025-1.238.375-.587.375-1.362 0-1.35-.962-2.15Q13.625 6 12.1 6q-1.275 0-2.187.75-.913.75-1.213 1.8l1.65.65q.125-.45.525-.975.4-.525 1.175-.525.7 0 1.088.413.387.412.387.962 0 .5-.3.938-.3.437-.75.887-.8.75-1.063 1.375-.262.625-.262 1.875ZM12 22q-2.075 0-3.9-.787-1.825-.788-3.175-2.138-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"/></svg>`;
        document.body.appendChild(triggerBtn);

        // Wrapper для ресайза
        const wrapper = document.createElement('div');
        wrapper.id = 'support-iframe-wrapper';
        wrapper.className = 'support-iframe-wrapper';

        // Resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'support-resize-handle';
        wrapper.appendChild(resizeHandle);

        // Iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'support-iframe';
        iframe.className = 'support-iframe';
        iframe.src = '/support-widget';
        wrapper.appendChild(iframe);

        document.body.appendChild(wrapper);

        // Toggle по клику
        triggerBtn.addEventListener('click', () => {
            const isOpen = wrapper.classList.toggle('support-iframe-wrapper--open');
            if (isOpen) {
                const token = localStorage.getItem('token');
                if (token) {
                    iframe.contentWindow?.postMessage({ type: 'support-widget-token', token }, '*');
                }
            }
        });

        // Отправляем токен при загрузке iframe
        iframe.addEventListener('load', () => {
            const token = localStorage.getItem('token');
            if (token) {
                iframe.contentWindow?.postMessage({ type: 'support-widget-token', token }, '*');
            }
        });

        // Слушаем сообщение о закрытии от iframe
        window.addEventListener('message', (event: MessageEvent) => {
            if (event.data?.type === 'support-widget-close') {
                wrapper.classList.remove('support-iframe-wrapper--open');
            }
        });

        // Resize logic
        let isResizing = false;
        let startX = 0;
        let startY = 0;
        let startW = 0;
        let startH = 0;

        resizeHandle.addEventListener('mousedown', (e: MouseEvent) => {
            e.preventDefault();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startW = wrapper.offsetWidth;
            startH = wrapper.offsetHeight;
            iframe.style.pointerEvents = 'none';
            document.body.style.cursor = 'nwse-resize';
        });

        document.addEventListener('mousemove', (e: MouseEvent) => {
            if (!isResizing) return;
            const dw = startX - e.clientX;
            const dh = startY - e.clientY;
            wrapper.style.width = Math.max(320, Math.min(700, startW + dw)) + 'px';
            wrapper.style.height = Math.max(380, startH + dh) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (!isResizing) return;
            isResizing = false;
            iframe.style.pointerEvents = '';
            document.body.style.cursor = '';
        });
    },

    async loadTemplates(): Promise<void> {
        // Шаблоны уже прекомпилированы лоадером, просто присваиваем их
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
        // Обновляем header при изменении auth-состояния или аватара
        const currentAvatar = state.user?.avatar_path || null;
        if (
            this._lastAuthState !== state.isAuthenticated ||
            this._lastAvatarPath !== currentAvatar
        ) {
            const loggedIn = this._lastAuthState !== state.isAuthenticated && state.isAuthenticated;
            this._lastAuthState = state.isAuthenticated;
            this._lastAvatarPath = currentAvatar;
            this.renderHeader();
            if (loggedIn) unreadStore.refreshCountFromServer();
            if (state.isAuthenticated === false) unreadStore.reset();
        }
        if (state.currentPage && state.currentPage !== this._lastPage) {
            this._lastPage = state.currentPage;
            this.router();
        }
    },

    renderHeader(): void {
        const container = document.getElementById('app-header');
        if (!container) return;

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
        const role = user?.role;
        container.innerHTML = this._headerCompiled!({
            isAuthenticated: store.isAuthenticated,
            user,
            unreadChatsCount: store.isAuthenticated ? unreadStore.count : 0,
            isStaff: role === 'support' || role === 'admin',
        });
    },

    router(): void {
        this.renderHeader();
        const path = window.location.pathname;
        const adMatch = path.match(/^\/ad\/(\d+)$/);

        // Логика новых фич из main
        if (path === '/place-ad') {
            if (this._currentFeature === 'place-ad') PlaceAnAdController.cleanup();
            this._currentFeature = 'place-ad';
            PlaceAnAdController.render();
            return;
        }

        if (path === '/ad-preview') {
            if (this._currentFeature === 'ad-preview') AdPreviewController.cleanup();
            this._currentFeature = 'ad-preview';
            AdPreviewController.render();
            return;
        }

        const editAdMatch = path.match(/^\/edit-ad\/(\d+)$/);
        if (editAdMatch) {
            if (this._currentFeature === 'place-ad') PlaceAnAdController.cleanup();
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

        // Защита маршрутов
        const chatDetailMatch = path.match(/^\/chats\/(\d+)$/);
        const isChatsListPath = path === '/chats';
        if (
            !store.isAuthenticated &&
            (path === '/profile' || path === '/cart' || isChatsListPath || chatDetailMatch)
        ) {
            this.navigateTo('/login');
            return;
        }

        const sellerMatch = path.match(/^\/seller\/(\d+)$/);
        if (sellerMatch) {
            SellerPageController.renderSellerPage(sellerMatch[1]);
            return;
        }

        if (chatDetailMatch) {
            ChatController.renderChatDetail(chatDetailMatch[1]);
            return;
        }

        if (path === '/support/stats') {
            StatsController.render();
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
            case '/chats':
                ChatController.renderChatList();
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
