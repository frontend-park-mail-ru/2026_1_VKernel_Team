/**
 * Контроллер объявлений
 * Отображает список объявлений и управляет взаимодействием
 */

import { adsActions } from '@/actions/adsActions';
import { eventBus } from '@/core/eventBus';
import { store } from '@/core/store';
import { apiClient } from '@/api/apiClient';
import { uiActions } from '@/actions/uiActions';
import type { Ad, HandlebarsTemplateFunction } from '@/types';
import { PROFILE_CONFIG } from '@modules/profile/config'; 
import { ADS_SELECTORS } from '@/types/adsConstants'; 

declare const Handlebars: any;

export const AdsController = {
    templates: {} as Record<string, HandlebarsTemplateFunction>,

    UI_CONSTANTS: {
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
    },

    async renderMain(): Promise<void> {
        const app = document.getElementById('app');
        const template = this.templates['main-page'];
        if (!app || !template) {
            return;
        }

        const cachedAds = store.ads;
        if (cachedAds.length > 0) {
            this.renderAdsList(app, template, cachedAds);
        }

        await adsActions.loadAds();

        const ads = store.ads;
        this.renderAdsList(app, template, ads);
    },

    renderAdsList(app: HTMLElement, template: HandlebarsTemplateFunction, ads: Ad[]): void {
        const formattedAds = ads.map((ad: Ad) => this.formatAdCard(ad));
        document.body.classList.remove('auth-page');

        app.innerHTML = template({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            recommendations: formattedAds,
        });

        eventBus.emit('page:adsRendered');
        this.attachMainEventListeners();
    },

    formatAdCard(ad: any) {
        let imageUrl = this.UI_CONSTANTS.DEFAULT_AD_IMAGE;

        if (ad.photos && ad.photos.length > 0) {
            const photoPath = ad.photos[0]?.trim();
            if (photoPath) {
                const STATIC_BACKEND = 'http://clover-go.ru:8000';
                if (photoPath.startsWith('http')) {
                    imageUrl = photoPath;
                } else {
                    const normalized = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
                    imageUrl = `${STATIC_BACKEND}${normalized}`;
                }
            }
        }

        return {
            ...ad,
            formattedPrice: ad.price === 0 ? 'Бесплатно' : ad.price.toLocaleString('ru-RU') + ' ₽',
            mainPhoto: imageUrl,
            image: imageUrl,
            views: ad.views_count || 0,
            createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : '',
            isOwn: store.isAuthenticated && store.user?.id === ad.seller_id,
            isFavorite: store.favoriteIds.has(Number(ad.id)), 
        };
    },

    attachMainEventListeners(): void {
        document
            .querySelectorAll(ADS_SELECTORS.FAVORITE_BTN)
            .forEach((btn) => btn.addEventListener('click', this.handleFavoriteClick.bind(this)));

        document
            .querySelectorAll(ADS_SELECTORS.CARD)
            .forEach((card) => card.addEventListener('click', this.handleCardClick.bind(this)));
    },

    async handleFavoriteClick(e: Event): Promise<void> {
        e.preventDefault();
        e.stopPropagation();

        if (!store.isAuthenticated) {
            eventBus.emit('app:navigate', '/login');
            return;
        }

        const favBtn = e.currentTarget as HTMLButtonElement; 
        const card = favBtn.closest(ADS_SELECTORS.CARD);
        const adId = Number(card?.getAttribute('data-id')); 
        
        if (!adId) {
            return;
        }

        const isFavorite = store.favoriteIds.has(adId);
        favBtn.disabled = true;

        try {
            const endpoint = isFavorite
                ? PROFILE_CONFIG.API.REMOVE_FAVORITE(adId)
                : PROFILE_CONFIG.API.ADD_FAVORITE(adId);

            const result = isFavorite
                ? await apiClient.delete(endpoint)
                : await apiClient.post(endpoint, {});
            
            if (!result.success) {
                uiActions.showError(result.error || 'Ошибка при работе с избранным');
                return;
            }

            const newFavorites = new Set(store.favoriteIds);
            if (isFavorite) {
                newFavorites.delete(adId);
            } else {
                newFavorites.add(adId);
            }
            store.setState({ favoriteIds: newFavorites });
            favBtn.classList.toggle(ADS_SELECTORS.ACTIVE_FAV_CLASS);
            eventBus.emit('profile:update-ui');
        } catch (error) {
            console.error('Favorite error:', error);
            uiActions.showError('Не удалось изменить состояние избранного');
        } finally {
            favBtn.disabled = false;
        }
    },

    handleCardClick(e: Event): void {
        const target = e.target as HTMLElement;
        
        if (target.closest(ADS_SELECTORS.FAVORITE_BTN) || target.closest(ADS_SELECTORS.CART_BTN)) {
            return;
        }

        const card = e.currentTarget as HTMLElement;
        const adId = card.dataset.id;
        
        if (adId) {
            eventBus.emit('app:navigate', `/ad/${adId}`);
        }
    },

    async syncFavorites() {
        try {
            const result = await apiClient.get<any>(PROFILE_CONFIG.API.GET_FAVORITES);
            
            if (!result.success || !result.data) {
                return;
            }

            let favoritesArray: any[] = [];
            
            if (Array.isArray(result.data)) {
                favoritesArray = result.data;
            } else if (Array.isArray(result.data.ads)) {
                favoritesArray = result.data.ads;
            } else if (Array.isArray(result.data.data)) {
                favoritesArray = result.data.data;
            } else if (typeof result.data === 'object') {
                const arrays = Object.values(result.data).filter(Array.isArray);
                if (arrays.length > 0) {
                    favoritesArray = arrays[0] as any[];
                }
            }

            const ids = new Set<number>(favoritesArray.map((ad: any) => Number(ad.id)));
            store.setState({ favoriteIds: ids });
        } catch (error) {
            console.error('Failed to sync favorites', error);
        }
    }
};
