/**
 * Контроллер объявлений
 * Отображает список объявлений и управляет взаимодействием
 * НЕ импортирует AppController — разрываем цикл!
 */

import { adsActions } from '@/actions/adsActions';
import { cartService } from '@/services/cartService';
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
        await adsActions.loadAds();

        const app = document.getElementById('app');
        const template = this.templates['main-page'];
        if (!app || !template) return;

        const ads = store.ads;
        const formattedAds = ads.map((ad: Ad) => this.formatAdCard(ad));
        document.body.classList.remove('auth-page');

        app.innerHTML = template({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            recommendations: formattedAds,
        });

        this.attachMainEventListeners();
    },

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
            formattedPrice:
                ad.price === 0
                    ? 'Бесплатно'
                    : `${ad.price.toLocaleString('ru-RU')} ₽`,
            mainPhoto: imageUrl,
            image: imageUrl,
            views: ad.views_count || 0,
            favorites: ad.favorites_count || 0,
            createdDate: ad.created_at
                ? new Date(ad.created_at).toLocaleDateString('ru-RU')
                : '',
        };
    },

    attachMainEventListeners(): void {
        document.querySelectorAll('.ad-card').forEach((card) => {
            card.addEventListener('click', () => {
                const adId = (card as HTMLElement).dataset.id;
                console.log('Ad clicked:', adId);
            });
        });

        document.querySelectorAll('[data-cart-add]').forEach((btn) => {
            btn.addEventListener('click', async (e: Event) => {
                e.preventDefault();
                e.stopPropagation();

                if (!store.isAuthenticated) {
                    window.history.pushState({}, '', '/login');
                    store.setState({ currentPage: '/login' });
                    return;
                }

                const productId = Number((btn as HTMLElement).dataset.cartAdd);
                if (!productId) return;

                const button = btn as HTMLElement;
                const originalText = button.textContent || '🛒';
                button.textContent = '⏳';
                button.style.pointerEvents = 'none';

                const result = await cartService.addToCart(productId);

                if (result.success) {
                    button.textContent = '✅';
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.pointerEvents = '';
                    }, 1500);
                } else {
                    const errorMsg = result.error || '';
                    if (errorMsg.includes('already in cart')) {
                        button.textContent = '✅';
                    } else {
                        button.textContent = '❌';
                    }
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.pointerEvents = '';
                    }, 1500);
                }
            });
        });
    },
};
