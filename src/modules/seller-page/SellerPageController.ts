/**
 * Контроллер страницы продавца
 * Управляет загрузкой данных, рендером и взаимодействием
 */

import { store } from '@/core/store';
import { CONFIG } from '@/core/config';
import { sellerService } from './sellerService';
import type { SellerProfile, SellerAd, FormattedSellerProfile } from './types';
import type { HandlebarsTemplateFunction } from '@/types';

import './seller-page.css';

declare const Handlebars: any;

const STATIC_BACKEND = CONFIG.API.BASE_URL;
const DEFAULT_AVATAR = '/images/logo/avatar.jpeg';
const DEFAULT_AD_IMAGE = '/images/default-ad.jpg';

const MONTHS_GENITIVE = [
    'январе',
    'феврале',
    'марте',
    'апреле',
    'мае',
    'июне',
    'июле',
    'августе',
    'сентябре',
    'октябре',
    'ноябре',
    'декабре',
];

export const SellerPageController = {
    template: null as HandlebarsTemplateFunction | null,

    async loadTemplate(): Promise<void> {
        if (this.template) return;
        const response = await fetch('/templates/seller-page.hbs');
        const source = await response.text();
        this.template = Handlebars.compile(source);
    },

    async render(sellerId: string): Promise<void> {
        const app = document.getElementById('app');
        if (!app) return;

        await this.loadTemplate();

        const profileRes = await sellerService.getProfile(sellerId);
        if (!profileRes.success || !profileRes.data) {
            app.innerHTML =
                '<div class="seller-ads-empty" style="padding:80px 0">Продавец не найден</div>';
            return;
        }

        const seller = this.formatProfile(profileRes.data);

        const adsRes = await sellerService
            .getAds(sellerId)
            .catch(() => ({ success: false, data: [] as SellerAd[] }));
        const allAds =
            adsRes.success && Array.isArray(adsRes.data) ? adsRes.data : [];

        const activeStatuses = new Set(['active']);
        const closedStatuses = new Set(['reserved', 'sold', 'archived']);

        const activeAds = allAds
            .filter((ad: SellerAd) => {
                const status = ad.status?.toLowerCase();
                return status ? activeStatuses.has(status) : true;
            })
            .map((ad: SellerAd) => this.formatAdCard(ad));

        const closedAds = allAds
            .filter((ad: SellerAd) => {
                const status = ad.status?.toLowerCase();
                return status ? closedStatuses.has(status) : false;
            })
            .map((ad: SellerAd) => this.formatAdCard(ad));

        document.body.classList.remove('auth-page');

        app.innerHTML = this.template!({
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            seller,
            activeAds,
            closedAds,
            activeAdsCount: activeAds.length,
            closedAdsCount: closedAds.length,
        });

        this.attachEventListeners();
    },

    formatProfile(profile: SellerProfile): FormattedSellerProfile {
        let avatarUrl = DEFAULT_AVATAR;
        if (profile.avatar_path) {
            const path = profile.avatar_path.startsWith('/')
                ? profile.avatar_path
                : `/${profile.avatar_path}`;
            avatarUrl = profile.avatar_path.startsWith('http')
                ? profile.avatar_path
                : `${STATIC_BACKEND}${path}`;
        }

        const rating = profile.rating ?? 0;
        const fullStars = Math.round(rating);
        const displayStars = Math.min(fullStars, 5);
        const ratingStars =
            '&#9733;'.repeat(displayStars) + '&#9734;'.repeat(5 - displayStars);

        const reviewCount = profile.reviews_count ?? 0;
        const reviewSuffix = this.getReviewSuffix(reviewCount);
        const reviewsText = `${reviewCount} отзыв${reviewSuffix}`;

        let registrationDate = '';
        if (profile.created_at) {
            const date = new Date(profile.created_at);
            const month = MONTHS_GENITIVE[date.getMonth()];
            registrationDate = `в ${month} ${date.getFullYear()}`;
        }

        return {
            id: profile.id,
            name: profile.name || 'Без имени',
            avatarUrl,
            rating: Math.round(rating * 10) / 10,
            ratingStars,
            reviewsCount: reviewCount,
            reviewsText,
            adsCount: profile.ads_count ?? 0,
            registrationDate,
        };
    },

    formatAdCard(ad: SellerAd) {
        let imageUrl = DEFAULT_AD_IMAGE;
        if (ad.photos && ad.photos.length > 0) {
            const photoPath = ad.photos[0]?.trim();
            if (photoPath) {
                if (photoPath.startsWith('http')) {
                    imageUrl = photoPath;
                } else {
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
                    : ad.price.toLocaleString('ru-RU') + ' \u20BD',
            image: imageUrl,
            views: ad.views_count || 0,
            location: ad.location || 'Москва',
            createdDate: ad.created_at
                ? new Date(ad.created_at).toLocaleDateString('ru-RU')
                : '',
        };
    },

    getReviewSuffix(count: number): string {
        const mod100 = count % 100;
        if (mod100 >= 11 && mod100 <= 14) {
            return 'ов';
        }

        const mod10 = count % 10;
        if (mod10 === 1) {
            return '';
        }

        if (mod10 >= 2 && mod10 <= 4) {
            return 'а';
        }

        return 'ов';
    },

    attachEventListeners(): void {
        const tabs = document.querySelectorAll('.seller-tab');
        const contents = document.querySelectorAll('.seller-tab-content');

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const target = (tab as HTMLElement).dataset.tab;

                tabs.forEach((t) => t.classList.remove('seller-tab--active'));
                tab.classList.add('seller-tab--active');

                contents.forEach((c) => {
                    const content = c as HTMLElement;
                    if (content.dataset.tabContent === target) {
                        content.classList.remove('seller-tab-content--hidden');
                    } else {
                        content.classList.add('seller-tab-content--hidden');
                    }
                });
            });
        });
    },
};
