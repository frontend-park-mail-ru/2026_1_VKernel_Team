export interface WalletBalance {
    balance: number;
    currency: string;
}

export interface Transaction {
    id: number;
    amount: number;
    type: 'topup' | 'promotion_charge' | 'refund';
    reference_id?: number;
    created_at: string;
}

export interface TransactionsResponse {
    items: Transaction[];
    next_cursor?: number;
}

export interface TopupRequest {
    amount: number;
    idempotency_key: string;
}

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'cancelled';

export interface TopupResponse {
    balance: number;
    payment_id: number;
    status: PaymentStatus;
    // Непустой только для асинхронных провайдеров (ЮКасса). Фронт должен сделать
    // window.location.href = confirmation_url, юзер оплачивает на стороне ЮКассы.
    confirmation_url?: string;
}

export interface PaymentStatusResponse {
    payment_id: number;
    status: PaymentStatus;
    amount: number;
    confirmation_url?: string;
}

export interface WalletState {
    balance: number;
    currency: string;
    transactions: Transaction[];
    nextCursor: number | null;
    error: string | null;
    isLoading: boolean;
}
