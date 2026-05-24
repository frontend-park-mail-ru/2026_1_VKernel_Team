export const REVIEWS_API_ENDPOINTS = {
    LIST_BY_USER: (id: number | string) => `/users/${id}/reviews`,
    SUMMARY: (id: number | string) => `/users/${id}/reviews/summary`,
    MY: '/profile/reviews',
    CREATE: '/reviews',
    UPDATE: (id: number | string) => `/reviews/${id}`,
    DELETE: (id: number | string) => `/reviews/${id}`,
};

export const REVIEWS_PAGE_SIZE = 20;
export const REVIEW_CONTENT_MIN = 5;
export const REVIEW_CONTENT_MAX = 2000;
export const REVIEW_RATING_MIN = 1;
export const REVIEW_RATING_MAX = 5;

export const REVIEW_BACKEND_ERRORS: Record<string, string> = {
    'rating must be between 1 and 5': 'Выберите оценку от 1 до 5 звёзд',
    'content length must be between 5 and 2000': 'Текст должен быть от 5 до 2000 символов',
    'cannot review yourself': 'Нельзя оставить отзыв самому себе',
    'product was not purchased': 'Сначала запросите этот товар у продавца в чате',
    'receiver is not the seller of this product': 'Этот продавец не продаёт этот товар',
    'review already exists': 'Вы уже оставили отзыв на этот товар',
    'not review author': 'Можно редактировать только свои отзывы',
    'review not found': 'Отзыв не найден',
    'product not found': 'Товар не найден',
};

export function mapBackendError(raw: string | undefined | null): string {
    if (!raw) return 'Не удалось опубликовать. Попробуйте позже';
    const normalized = raw.trim().toLowerCase();
    const found = Object.keys(REVIEW_BACKEND_ERRORS).find((k) =>
        normalized.includes(k.toLowerCase()),
    );
    return found ? REVIEW_BACKEND_ERRORS[found] : raw;
}

export function declensionReviews(count: number): string {
    const mod100 = count % 100;
    if (mod100 >= 11 && mod100 <= 14) return 'отзывов';
    const mod10 = count % 10;
    if (mod10 === 1) return 'отзыв';
    if (mod10 >= 2 && mod10 <= 4) return 'отзыва';
    return 'отзывов';
}
