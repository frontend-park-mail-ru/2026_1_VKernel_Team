import { apiClient } from '@/api/apiClient';

export interface PriceHistoryPoint {
    changed_at: string;
    price: number;
}

export interface PriceHistoryResponse {
    history: PriceHistoryPoint[];
}

export const priceHistoryApi = {
    async getPriceHistory(adId: number | string): Promise<PriceHistoryPoint[]> {
        const result = await apiClient.get<PriceHistoryResponse>(`/ads/${adId}/price-history`);

        if (result.success && result.data?.history) {
            return result.data.history;
        }

        // При 404 или других ошибках возвращаем пустой массив
        // Блок истории просто не покажется на странице
        return [];
    },
};
