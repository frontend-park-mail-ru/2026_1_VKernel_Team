/**
 * Контроллер объявлений
 * Отображает список объявлений и управляет взаимодействием
 * НЕ импортирует AppController — разрываем цикл!
 */

import { adsActions } from '@/actions/adsActions';
import { eventBus } from '@/core/eventBus';
import { store } from '@/core/store';
import { CONFIG } from '@/core/config';
import type { Ad, HandlebarsTemplateFunction } from '@/types';

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
        await adsActions.loadAds();

        const app = document.getElementById('app');
        const template = this.templates['main-page'];
        if (!app || !template) return;

        const ads = store.ads;
        const formattedAds = ads.map((ad: Ad) => this.formatAdCard(ad));
        document.body.classList.remove('auth-page');

        const user = store.user;
        let avatarImageUrl = '/images/logo/avatar.jpeg';
        if (user) {
            const src = (user.avatar || user.avatar_path || '').trim();
            if (src) {
                avatarImageUrl = src.startsWith('http')
                    ? src
                    : `${CONFIG.API.BASE_URL}${src.startsWith('/') ? src : `/${src}`}`;
            }
        }

        app.innerHTML = template({
            isAuthenticated: store.isAuthenticated,
            user,
            avatarImageUrl,
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
            image: imageUrl, // Для совместимости с шаблоном {{image}}
            views: ad.views_count || 0,
            createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : '',
        };
    },

    attachMainEventListeners(): void {
        document.querySelectorAll('.ad-card').forEach((card) => {
            card.addEventListener('click', () => {
                const adId = (card as HTMLElement).dataset.id;
                console.log('Ad clicked:', adId);
            });
        });
    },
};
