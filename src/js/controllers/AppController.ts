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

    currentPhotoIndex: 0,
    allPhotosArray: [] as string[],

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
            'ad-detail',
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
            function (this: any, options: any) {
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
        console.log('Router path:', path);  // 👈 Добавь
        
        const adMatch = path.match(/^\/ad\/(\d+)$/);
        console.log('Ad match result:', adMatch);  // 👈 Добавь
        
        if (adMatch) {
            console.log('Rendering ad detail for:', adMatch[1]);  // 👈 Добавь
            const adId = adMatch[1];
            this.renderAdDetail(adId);
            return;
        }

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

// Новый метод для рендера страницы объявления
async renderAdDetail(adId: string): Promise<void> {
    console.log('=== renderAdDetail START ===');
    console.log('adId:', adId);
    
    const app = document.getElementById('app');
    console.log('app element found:', !!app);
    
    if (!app) return;
    
    document.body.classList.remove('auth-page');
    
    const template = this.templates['ad-detail'];
    console.log('template exists:', !!template);
    console.log('all available templates:', Object.keys(this.templates));
    
    if (!template) {
        console.log('TEMPLATE NOT FOUND! Trying to load...');
        try {
            const response = await fetch('/templates/ad-detail.hbs');
            console.log('fetch response status:', response.status);
            const source = await response.text();
            console.log('template source length:', source.length);
            this.templates['ad-detail'] = Handlebars.compile(source);
            console.log('template compiled successfully');
        } catch (error) {
            console.error('Error loading template:', error);
            app.innerHTML = '<div style="text-align: center; margin-top: 100px;">Ошибка загрузки шаблона</div>';
            return;
        }
    }
    
    // Снова получаем шаблон (если только что загрузили)
    const finalTemplate = this.templates['ad-detail'];
    
    console.log('preparing test data...');
    const testData = {
        title: `Тестовое объявление #${adId}`,
        formattedPrice: '10 000 ₽',
        location: 'Москва',
        views_count: 42,
        favorites_count: 7,
        formattedDate: new Date().toLocaleDateString('ru-RU'),
        status: 'active',
        statusText: 'Активно',
        description: 'Это тестовое описание объявления.',
        mainPhoto: 'https://picsum.photos/800/600?random=1',
        allPhotos: [
            'https://picsum.photos/200/200?random=1',
            'https://picsum.photos/200/200?random=2',
            'https://picsum.photos/200/200?random=3',
        ],
        isAuthenticated: store.isAuthenticated,
        isOwner: false,
    };
    
    console.log('testData ready, calling template...');
    
    try {
        const html = finalTemplate(testData);
        console.log('HTML generated, length:', html.length);
        console.log('HTML preview:', html.substring(0, 200));
        app.innerHTML = html;
        console.log('=== renderAdDetail SUCCESS ===');
    } catch (error) {
        console.error('ERROR during template rendering:', error);
        app.innerHTML = `<div style="text-align: center; margin-top: 100px; color: red;">Ошибка рендера: ${error}</div>`;
    }
    
    this.attachAdDetailEventListeners();
},

// AppController.ts - обновляем attachAdDetailEventListeners

    attachAdDetailEventListeners(): void {
        // Сбрасываем состояние галереи
        this.currentPhotoIndex = 0;
        this.allPhotosArray = [];
        
        // Кнопка "Все категории"
        const categoriesBtn = document.querySelector('[data-action="show-categories"]');
        categoriesBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Show categories menu');
        });
        
        // Навигация по фото: предыдущее
        const prevBtn = document.querySelector('[data-gallery-prev]');
        prevBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateGallery(-1);
        });
        
        // Навигация по фото: следующее
        const nextBtn = document.querySelector('[data-gallery-next]');
        nextBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateGallery(1);
        });
        
        // Клик по миниатюрам
        const thumbnails = document.querySelectorAll('[data-thumbnail]');
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget as HTMLImageElement;
                const mainPhoto = document.getElementById('mainPhoto') as HTMLImageElement;
                if (mainPhoto && target.src) {
                    mainPhoto.src = target.src;
                    this.setActiveThumbnail(index);
                }
            });
        });
        
        // Развернуть/свернуть описание
        const toggleBtn = document.querySelector('[data-action="toggle-description"]');
        toggleBtn?.addEventListener('click', () => {
            const description = document.getElementById('adDescription');
            const showMoreText = document.querySelector('.show-more-text');
            const showLessText = document.querySelector('.show-less-text');
            
            if (description && showMoreText && showLessText) {
                description.classList.toggle('collapsed');
                const isCollapsed = description.classList.contains('collapsed');
                
                if (showMoreText instanceof HTMLElement && showLessText instanceof HTMLElement) {
                    showMoreText.style.display = isCollapsed ? 'inline' : 'none';
                    showLessText.style.display = isCollapsed ? 'none' : 'inline';
                }
            }
        });
    },

    // Метод для навигации по галерее
    navigateGallery(direction: number): void {
        // Получаем все фото из миниатюр, если еще не получили
        if (this.allPhotosArray.length === 0) {
            const thumbnails = document.querySelectorAll('[data-thumbnail]');
            this.allPhotosArray = Array.from(thumbnails).map(
                thumb => (thumb as HTMLImageElement).src
            );
            this.currentPhotoIndex = 0;
        }
        
        const newIndex = this.currentPhotoIndex + direction;
        if (newIndex >= 0 && newIndex < this.allPhotosArray.length) {
            this.currentPhotoIndex = newIndex;
            const mainPhoto = document.getElementById('mainPhoto') as HTMLImageElement;
            if (mainPhoto) {
                mainPhoto.src = this.allPhotosArray[this.currentPhotoIndex];
                this.setActiveThumbnail(this.currentPhotoIndex);
            }
        }
    },

    // Метод для установки активной миниатюры
    setActiveThumbnail(activeIndex: number): void {
        const thumbWrappers = document.querySelectorAll('.thumbnail-vertical-wrapper');
        thumbWrappers.forEach((wrapper, index) => {
            if (index === activeIndex) {
                wrapper.classList.add('active');
            } else {
                wrapper.classList.remove('active');
            }
        });
        this.currentPhotoIndex = activeIndex;
    },
};
