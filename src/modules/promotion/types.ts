export interface PromotionPlan {
    id: number;
    code: string;
    kind: 'boost' | 'highlight';
    duration_days: number;
    price: number;
}

export interface ActivePromotion {
    id: number;
    product_id: number;
    kind: 'boost' | 'highlight';
    plan_code: string;
    starts_at: string;
    expires_at: string;
    price_paid: number;
}

export interface PurchasePromoRequest {
    plan_code: string;
    idempotency_key: string;
}

export interface PurchasePromoResponse {
    promotion: ActivePromotion;
    wallet_balance: number;
}

export interface PromoHistoryItem {
    id: number;
    product_id: number;
    kind: 'boost' | 'highlight';
    plan_code: string;
    starts_at: string;
    expires_at: string;
    price_paid: number;
}

export interface PromoHistoryResponse {
    items: PromoHistoryItem[];
    next_cursor?: number;
}

export interface PromotionState {
    plans: PromotionPlan[];
    adPromotions: Record<number, ActivePromotion[]>;
    userHistory: PromoHistoryItem[];
    nextCursor: number | null;
    isLoading: boolean;
    error: string | null;
}
