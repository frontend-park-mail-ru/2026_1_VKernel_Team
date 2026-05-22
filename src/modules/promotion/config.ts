export const PROMOTION_API_ENDPOINTS = {
    GET_PLANS: '/promotion/plans',
    GET_AD_PROMOTIONS: (adId: number | string) => `/ads/${adId}/promotions`,
    PURCHASE_PROMO: (adId: number | string) => `/ads/${adId}/promotions`,
    GET_USER_HISTORY: '/profile/promotions',
};
