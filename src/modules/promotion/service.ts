import { apiClient } from '@/api/apiClient';
import { PROMOTION_API_ENDPOINTS } from './config';
import type {
    PromotionPlan,
    ActivePromotion,
    PurchasePromoResponse,
    PromoHistoryResponse,
} from './types';

const promotionService = {
    async getPlans() {
        return apiClient.get<PromotionPlan[]>(PROMOTION_API_ENDPOINTS.GET_PLANS);
    },

    async getAdPromotions(adId: number | string) {
        return apiClient.get<ActivePromotion[]>(PROMOTION_API_ENDPOINTS.GET_AD_PROMOTIONS(adId));
    },

    async purchasePromo(adId: number | string, planCode: string, idempotencyKey: string) {
        return apiClient.post<PurchasePromoResponse>(PROMOTION_API_ENDPOINTS.PURCHASE_PROMO(adId), {
            plan_code: planCode,
            idempotency_key: idempotencyKey,
        });
    },

    async getUserHistory(limit: number = 20, cursor?: number) {
        let url = `${PROMOTION_API_ENDPOINTS.GET_USER_HISTORY}?limit=${limit}`;
        if (cursor !== undefined) {
            url += `&cursor=${cursor}`;
        }
        return apiClient.get<PromoHistoryResponse>(url);
    },
};

export { promotionService };
