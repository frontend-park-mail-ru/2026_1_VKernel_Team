import { apiClient } from '@/api/apiClient';
import { CONFIG } from '@/core/config';
import { renderStarsHTML } from '@/utils/icons';
import { REVIEWS_API_ENDPOINTS, REVIEWS_PAGE_SIZE } from './config';
import type {
    CreateReviewPayload,
    FormattedReview,
    Review,
    ReviewListResponse,
    ReviewSummary,
    UpdateReviewPayload,
} from './types';

const STATIC_BACKEND = CONFIG.API.BASE_URL;
const DEFAULT_AVATAR = '/images/logo/avatar.jpeg';
const DEFAULT_AD_IMAGE = '/images/default-ad.jpg';

function withCursor(url: string, cursor: number | null): string {
    const params = new URLSearchParams();
    params.set('limit', String(REVIEWS_PAGE_SIZE));
    if (cursor !== null && cursor !== undefined) {
        params.set('cursor', String(cursor));
    }
    return `${url}?${params.toString()}`;
}

function resolveMedia(path: string | undefined, fallback: string): string {
    if (!path) return fallback;
    const trimmed = path.trim();
    if (!trimmed) return fallback;
    if (trimmed.startsWith('http') || trimmed.startsWith('data:')) return trimmed;
    const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${STATIC_BACKEND}${normalized}`;
}

function formatDateRu(iso: string): string {
    if (!iso) return '';
    const date = new Date(iso);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

// Бэк отдаёт product как `{ad_id, title, photo, price, status}` — нормализуем
// под фронт-тип `{id, title, photo}`, чтобы остальной код мог сравнивать
// product.id с purchase.product_id.
function normalizeReview(raw: any): Review {
    if (!raw) return raw;
    const product = raw.product || {};
    return {
        ...raw,
        product: {
            id: product.id ?? product.ad_id ?? 0,
            title: product.title ?? '',
            photo: product.photo ?? '',
        },
    } as Review;
}

function normalizeList(res: any): any {
    if (!res?.data) return res;
    const reviews = Array.isArray(res.data.reviews) ? res.data.reviews.map(normalizeReview) : [];
    return { ...res, data: { ...res.data, reviews } };
}

export const reviewsService = {
    async listByUser(userId: number | string, cursor: number | null = null) {
        const res = await apiClient.get<ReviewListResponse>(
            withCursor(REVIEWS_API_ENDPOINTS.LIST_BY_USER(userId), cursor),
        );
        return normalizeList(res);
    },

    async summary(userId: number | string) {
        return apiClient.get<ReviewSummary>(REVIEWS_API_ENDPOINTS.SUMMARY(userId));
    },

    async myReviews(cursor: number | null = null) {
        const res = await apiClient.get<ReviewListResponse>(
            withCursor(REVIEWS_API_ENDPOINTS.MY, cursor),
        );
        return normalizeList(res);
    },

    async create(payload: CreateReviewPayload) {
        const res = await apiClient.post<Review>(REVIEWS_API_ENDPOINTS.CREATE, payload);
        if (res.success && res.data) {
            return { ...res, data: normalizeReview(res.data) };
        }
        return res;
    },

    async update(id: number, payload: UpdateReviewPayload) {
        const res = await apiClient.put<Review>(REVIEWS_API_ENDPOINTS.UPDATE(id), payload);
        if (res.success && res.data) {
            return { ...res, data: normalizeReview(res.data) };
        }
        return res;
    },

    async remove(id: number) {
        return apiClient.delete(REVIEWS_API_ENDPOINTS.DELETE(id));
    },

    format(review: Review): FormattedReview {
        const rating = Math.max(0, Math.min(5, Number(review.rating) || 0));
        const sender = review.sender || ({} as Review['sender']);
        const product = review.product || ({} as Review['product']);
        const isEdited =
            !!review.updated_at && !!review.created_at && review.updated_at !== review.created_at;

        return {
            id: review.id,
            rating,
            ratingStars: renderStarsHTML(rating),
            content: review.content || '',
            senderId: sender.id,
            senderName: sender.name || 'Пользователь',
            senderAvatar: resolveMedia(sender.avatar_path, DEFAULT_AVATAR),
            productId: product.id,
            productTitle: product.title || 'Товар',
            productPhoto: resolveMedia(product.photo, DEFAULT_AD_IMAGE),
            receiverId: review.receiver_id,
            createdDate: formatDateRu(review.created_at),
            isEdited,
        };
    },

    formatList(reviews: Review[] | undefined | null): FormattedReview[] {
        if (!Array.isArray(reviews)) return [];
        return reviews.map((r) => this.format(r));
    },

    buildDistributionBars(summary: ReviewSummary | null) {
        if (!summary) return [];
        const dist = summary.distribution || {};
        const counts = [5, 4, 3, 2, 1].map((star) => ({
            star,
            count: Number(dist[String(star)] ?? dist[star as any] ?? 0) || 0,
        }));
        const max = Math.max(1, ...counts.map((c) => c.count));
        return counts.map((c) => ({
            star: c.star,
            count: c.count,
            percent: Math.round((c.count / max) * 100),
        }));
    },
};
