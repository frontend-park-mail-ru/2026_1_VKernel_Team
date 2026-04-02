/**
 * Контроллер объявлений
 * НЕ импортирует AppController — разрываем цикл!
 */

import { adsActions } from '@/actions/adsActions';
import { store } from '@/core/store';
import type { Ad, FormattedAd, HandlebarsTemplateFunction } from '@/types';

declare const Handlebars: any;

export const AdsController = {
    templates: {} as Record<string, HandlebarsTemplateFunction>,

    UI_CONSTANTS: {
        DEFAULT_AD_IMAGE: '/images/default-ad.jpg',
    },

    /**
     * Рендер главной страницы с объявлениями
     */
    async renderMain(): Promise<void> {
        document.body.classList.remove('auth-page');
        await adsActions.loadAds();
        
        const app = document.getElementById('app');
        const template = this.templates['main-page'];
        if (!app || !template) return;

        const ads = store.ads;
        const formattedAds = ads.map((ad: Ad) => this.formatAdCard(ad));

        app.innerHTML = template({
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
        let imageUrl = this.UI_CONSTANTS.DEFAULT_AD_IMAGE;

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
            favorites: ad.favorites_count || 0,
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
                // TODO: Навигация на страницу объявления
            });
        });
    },
};
