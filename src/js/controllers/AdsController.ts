/**
 * Контроллер объявлений
 * Отображает список объявлений и управляет взаимодействием
 */

import { adsActions } from '@/actions/adsActions';
import { store } from '@/core/store';
import { AppController } from '@/controllers/AppController';
import type { Ad, FormattedAd } from '@/types';

export const AdsController = {
    /**
     * Рендер главной страницы с объявлениями
     */
    async renderMain(): Promise<void> {
        document.body.classList.remove('auth-page');
        await adsActions.loadAds();
        const app = document.getElementById('app');
        if (!app || !AppController.templates['main-page']) return;

        const ads = store.ads;
        const formattedAds = ads.map((ad: Ad) => this.formatAdCard(ad));

        app.innerHTML = AppController.templates['main-page']({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            recommendations: formattedAds,
        });

        this.attachMainEventListeners();
    },

    /**
     * Форматирование карточки объявления
     */
    formatAdCard(ad: Ad): FormattedAd {
        let imageUrl = AppController.UI_CONSTANTS.DEFAULT_AD_IMAGE;

        if (ad.photos && ad.photos.length > 0) {
            const photoPath = ad.photos[0];
            if (photoPath) {
                imageUrl = photoPath.startsWith('http')
                    ? photoPath
                    : `${window.location.origin}${photoPath}`;
            }
        }

        return {
            ...ad,
            formattedPrice: ad.price === 0 ? 'Бесплатно' : `${ad.price} ₽`,
            mainPhoto: imageUrl,
            image: imageUrl,
            views: ad.views_count || 0,
            favorites: ad.views_count || 0,
            createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : '',
        };
    },

    /**
     * Обработчики событий на главной странице
     */
    attachMainEventListeners(): void {
        document.querySelectorAll('.ad-card').forEach(card => {
            card.addEventListener('click', () => {
                const adId = (card as HTMLElement).dataset.id;
                console.log('Ad clicked:', adId);
            });
        });
    },
};
