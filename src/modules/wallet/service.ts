import { apiClient } from '@/api/apiClient';
import { WALLET_API_ENDPOINTS } from './config';
import type {
    WalletBalance,
    TransactionsResponse,
    TopupResponse,
    PaymentStatusResponse,
} from './types';

const walletService = {
    async getBalance() {
        return apiClient.get<WalletBalance>(WALLET_API_ENDPOINTS.GET_BALANCE);
    },

    async topup(amount: number, idempotencyKey: string) {
        return apiClient.post<TopupResponse>(WALLET_API_ENDPOINTS.TOPUP, {
            amount,
            idempotency_key: idempotencyKey,
        });
    },

    async getTransactions(limit: number = 20, cursor?: number) {
        let url = `${WALLET_API_ENDPOINTS.GET_TRANSACTIONS}?limit=${limit}`;
        if (cursor !== undefined) {
            url += `&cursor=${cursor}`;
        }
        return apiClient.get<TransactionsResponse>(url);
    },

    async getPaymentStatus(paymentId: number) {
        return apiClient.get<PaymentStatusResponse>(
            `${WALLET_API_ENDPOINTS.GET_PAYMENT_STATUS}/${paymentId}`,
        );
    },
};

export { walletService };
