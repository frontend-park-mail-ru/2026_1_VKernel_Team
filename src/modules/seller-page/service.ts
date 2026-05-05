import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import { CONFIG } from '@/core/config';
import { SELLER_API_ENDPOINTS } from '@modules/seller-page/config';
import { renderStarsHTML } from '@/utils/icons';
import type { SellerProfile, SellerAd, FormattedSellerProfile } from './types';

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

interface SellerAdsResponse {
    ads: SellerAd[];
}

const sellerService = {
    async getProfile(sellerId: number | string) {
        return apiClient.get<SellerProfile>(API_ENDPOINTS.USERS.GET_BY_ID(sellerId));
    },

    async getAds(sellerId: number | string) {
        const result = await apiClient.get<SellerAdsResponse>(SELLER_API_ENDPOINTS.ADS(sellerId));

        if (!result.success) {
            return {
                success: false as const,
                error: result.error,
                status: result.status,
            };
        }

        return {
            success: true as const,
            data: Array.isArray(result.data?.ads) ? result.data.ads : [],
        };
    },

    getImageUrl(imagePath: string): string {
        if (!imagePath) return DEFAULT_AD_IMAGE;
        if (imagePath.startsWith('http')) return imagePath;

        const normalized = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${STATIC_BACKEND}${normalized}`;
    },

    getAvatarUrl(avatarPath: string): string {
        if (!avatarPath) return DEFAULT_AVATAR;
        if (avatarPath.startsWith('http')) return avatarPath;

        const normalized = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
        return `${STATIC_BACKEND}${normalized}`;
    },

    formatPrice(price: number): string {
        return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} \u20BD`;
    },

    getReviewSuffix(count: number): string {
        const mod100 = count % 100;
        if (mod100 >= 11 && mod100 <= 14) return 'ов';

        const mod10 = count % 10;
        if (mod10 === 1) return '';
        if (mod10 >= 2 && mod10 <= 4) return 'а';

        return 'ов';
    },

    formatProfile(profile: SellerProfile): FormattedSellerProfile {
        const avatarUrl = this.getAvatarUrl(profile.avatar_path);

        const rating = profile.rating ?? 0;
        const ratingStars = renderStarsHTML(rating);

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
                imageUrl = this.getImageUrl(photoPath);
            }
        }

        return {
            ...ad,
            formattedPrice: this.formatPrice(ad.price),
            image: imageUrl,
            views: ad.views_count || 0,
            location: ad.location || 'Москва',
            createdDate: ad.created_at ? new Date(ad.created_at).toLocaleDateString('ru-RU') : '',
        };
    },
};

export { sellerService };
