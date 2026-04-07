/**
 * Контроллер объявлений
 * Отображает список объявлений и управляет взаимодействием
 * НЕ импортирует AppController — разрываем цикл!
 */

import { adsActions } from '@/actions/adsActions';
import { cartActions } from '@/actions/cartActions';
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

        if (store.isAuthenticated) {
            await cartActions.loadCart();
        }

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

        this.markCartButtons();
        this.attachMainEventListeners();
    },

    formatAdCard(ad: any) {
        let imageUrl = this.UI_CONSTANTS.DEFAULT_AD_IMAGE;

        if (ad.photos && ad.photos.length > 0) {
            const photoPath = ad.photos[0]?.trim();

            if (photoPath) {
                const STATIC_BACKEND = 'http://clover-go.ru:8000';

                if (photoPath.startsWith('http')) {
                    // Уже полный URL — оставляем как есть
                    imageUrl = photoPath;
                } else {
                    // Локальный путь — добавляем бэкенд
                    // Убираем дублирующий слеш: "/static" + "/img/1.webp" → "/static/img/1.webp"
                    const normalized = photoPath.startsWith('/')
                        ? photoPath
                        : `/${photoPath}`;
                    imageUrl = `${STATIC_BACKEND}${normalized}`;
                }
            }
        }

        return {
            ...ad,
            formattedPrice:
                ad.price === 0
                    ? 'Бесплатно'
                    : ad.price.toLocaleString('ru-RU') + ' ₽',
            mainPhoto: imageUrl,
            image: imageUrl, // Для совместимости с шаблоном {{image}}
            views: ad.views_count || 0,
            createdDate: ad.created_at
                ? new Date(ad.created_at).toLocaleDateString('ru-RU')
                : '',
        };
    },

    markCartButtons(): void {
        const cartIds = new Set(store.cartItems.map((item) => item.product_id));
        document
            .querySelectorAll<HTMLElement>('[data-cart-add]')
            .forEach((btn) => {
                const id = Number(btn.dataset.cartAdd);
                if (cartIds.has(id)) {
                    btn.classList.add('in-cart');
                    btn.title = 'В корзине';
                }
            });
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
                const isInCart = button.classList.contains('in-cart');

                button.classList.remove('in-cart');
                button.classList.add('loading');

                if (isInCart) {
                    const removed = await cartActions.removeFromCart(productId);
                    button.classList.remove('loading');
                    if (removed) {
                        button.title = 'В корзину';
                    } else {
                        button.classList.add('in-cart');
                        button.title = 'В корзине';
                    }
                } else {
                    const result = await cartService.addToCart(productId);
                    button.classList.remove('loading');
                    if (result.success) {
                        button.classList.add('in-cart');
                        button.title = 'В корзине';
                        await cartActions.loadCart();
                    } else {
                        const errorMsg = result.error || '';
                        if (errorMsg.includes('already in cart')) {
                            button.classList.add('in-cart');
                            button.title = 'В корзине';
                        }
                    }
                }
            });
        });
    },
};
