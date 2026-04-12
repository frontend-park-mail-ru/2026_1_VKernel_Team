/**
 * Типы модуля страницы продавца
 */

export interface SellerProfile {
    id: number;
    name: string;
    avatar_path: string;
    rating: number;
    reviews_count: number;
    ads_count: number;
    created_at: string;
}

export interface SellerAd {
    id: number;
    title: string;
    description?: string;
    price: number;
    photos?: string[];
    views_count?: number;
    favorites_count?: number;
    created_at?: string;
    location?: string;
    status?: 'draft' | 'active' | 'reserved' | 'sold' | 'archived';
}

export interface FormattedSellerProfile {
    id: number;
    name: string;
    avatarUrl: string;
    rating: number;
    ratingStars: string;
    reviewsCount: number;
    reviewsText: string;
    adsCount: number;
    registrationDate: string;
}
