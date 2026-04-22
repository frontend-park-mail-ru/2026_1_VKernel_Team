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

declare const Handlebars: any;

export const AdsController = {
    templates: {} as Record<string, HandlebarsTemplateFunction>,

    UI_CONSTANTS: {
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
    },

    async renderMain(): Promise<void> {
        const app = document.getElementById('app');
        const template = this.templates['main-page'];
        if (!app || !template) return;

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
        document.querySelectorAll('.rec-card-fav').forEach((favBtn) => {
            favBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!store.isAuthenticated) {
                    window.dispatchEvent(new CustomEvent('app:navigate', { detail: { path: '/login' } }));
                    return;
                }

                const card = (favBtn as HTMLElement).closest('.rec-card, .ad-card');
                const adId = Number(card?.getAttribute('data-id')); // Привели к числу
                if (!adId) return;

                const btn = favBtn as HTMLButtonElement;
                
                // Проверяем статус ИЗ STORE
                const isFavorite = store.favoriteIds.has(adId);

                btn.disabled = true;

                try {
                    const { PROFILE_CONFIG } = await import('@modules/profile/config');

                    const endpoint = isFavorite
                        ? PROFILE_CONFIG.API.REMOVE_FAVORITE(adId)
                        : PROFILE_CONFIG.API.ADD_FAVORITE(adId);

                    const result = isFavorite
                        ? await apiClient.delete(endpoint)
                        : await apiClient.post(endpoint, {});

                    if (result.success) {
                        // === ВАЖНО: ОБНОВЛЯЕМ ГЛОБАЛЬНЫЙ STORE ===
                        const newFavorites = new Set(store.favoriteIds);
                        if (isFavorite) {
                            newFavorites.delete(adId); // Удаляем
                        } else {
                            newFavorites.add(adId);    // Добавляем
                        }
                        store.setState({ favoriteIds: newFavorites });

                        // Переключаем визуальное состояние на самой кнопке
                        btn.classList.toggle('rec-card-fav--active');
                        btn.innerHTML = newFavorites.has(adId) ? '♥' : '♡';

                        eventBus.emit('profile:update-ui');
                    } else {
                        uiActions.showError(result.error || 'Ошибка при работе с избранным');
                    }
                } catch (error) {
                    console.error('Favorite error:', error);
                    uiActions.showError('Не удалось изменить состояние избранного');
                } finally {
                    btn.disabled = false;
                }
            });
        });

        document.querySelectorAll('.rec-card, .ad-card').forEach((card) => {
            card.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (target.closest('.rec-card-fav') || target.closest('.rec-card-cart')) {
                    return;
                }

                const adId = (card as HTMLElement).dataset.id;
                if (adId) {
                    window.dispatchEvent(new CustomEvent('app:navigate', {
                        detail: { path: `/ad/${adId}` }
                    }));
                }
            });
        });
    },

    async syncFavorites() {
        try {
            const { PROFILE_CONFIG } = await import('@modules/profile/config');
            const result = await apiClient.get<any>(PROFILE_CONFIG.API.GET_FAVORITES);
            
            if (result.success && result.data) {
                // Пуленепробиваемый парсинг ответа
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

                // Заполняем Set айдишниками
                const ids = new Set<number>(favoritesArray.map((ad: any) => Number(ad.id)));
                store.setState({ favoriteIds: ids });
            }
        } catch (error) {
            console.error('Failed to sync favorites', error);
        }
    }
};
