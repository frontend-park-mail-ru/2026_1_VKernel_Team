/**
 * Главный контроллер приложения
 * Управляет роутингом, инициализацией и глобальными обработчиками
 */

import { AuthController } from '@/controllers/AuthController';
import { AdsController } from '@/controllers/AdsController';
import { ProfileController } from '@/controllers/ProfileController';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import type { HandlebarsTemplateFunction, TemplateName, UIConstants } from '@/types';

declare const Handlebars: any;

export const AppController = {
    templates: {} as Record<TemplateName, HandlebarsTemplateFunction>,

    UI_CONSTANTS: {
        DEFAULT_AVATAR: '/images/default-avatar.jpg',
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
        EYE_OPEN: '/images/icons/Eye.jpeg',
        EYE_CLOSED: '/images/icons/Eye-off.jpeg',
        LOADER_HTML: '<div class="spinner"></div>',
    } as UIConstants,

    /**
     * Инициализация приложения
     */
    async init(): Promise<void> {
        await this.loadTemplates();
        await this.checkAuth();
        this.setupGlobalHandlers();
        this.setupStoreSubscription();
        this.router();
        window.addEventListener('popstate', () => this.router());
    },

    /**
     * Загрузка Handlebars шаблонов
     */
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

    /**
     * Регистрация хелперов Handlebars
     */
    registerHandlebarsHelpers(): void {
        Handlebars.registerHelper('formatPrice', (price: number) => {
            return price === 0 ? 'Бесплатно' : `${price} ₽`;
        });

        Handlebars.registerHelper('ifAuthenticated', function (this: any, options: Handlebars.HelperOptions) {
            return store.isAuthenticated ? options.fn(this) : options.inverse(this);
        });
    },

    /**
     * Проверка авторизации при загрузке
     */
    async checkAuth(): Promise<void> {
        // Через authActions будет вызвано
    },

    /**
     * Подписка на изменения Store
     */
    setupStoreSubscription(): void {
        store.subscribe((state) => {
            this.onStateChange(state);
        });
    },

    /**
     * Обработка изменений состояния
     */
    onStateChange(state: any): void {
        this.showLoading(state.isLoading);

        if (state.error) {
            uiActions.showError(state.error);
        }
    },

    /**
     * Роутинг по страницам
     */
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

    /**
     * Навигация на страницу
     */
    navigateTo(path: string): void {
        window.history.pushState({}, '', path);
        this.router();
    },

    /**
     * Рендер страницы 404
     */
    renderNotFound(): void {
        const app = document.getElementById('app');
        if (!app || !this.templates['not-found']) return;
        app.innerHTML = this.templates['not-found']();
    },

    /**
     * Глобальные обработчики событий
     */
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

    /**
     * Показать/скрыть лоадер
     */
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
