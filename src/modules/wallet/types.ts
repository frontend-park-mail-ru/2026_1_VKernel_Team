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

export interface TopupResponse {
    balance: number;
    payment_id: number;
}

export interface WalletState {
    balance: number;
    currency: string;
    transactions: Transaction[];
    nextCursor: number | null;
    error: string | null;
    isLoading: boolean;
}
