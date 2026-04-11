/**
 * Сервис для получения данных продавца
 */

import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import type { ApiResponse } from '@/types';
import type { SellerProfile, SellerAd } from './types';

interface SellerAdsResponse {
    ads: SellerAd[];
}

export const sellerService = {
    async getProfile(
        sellerId: number | string,
    ): Promise<ApiResponse<SellerProfile>> {
        return apiClient.get<SellerProfile>(
            API_ENDPOINTS.USERS.GET_BY_ID(sellerId),
        );
    },

    async getAds(sellerId: number | string): Promise<ApiResponse<SellerAd[]>> {
        const result = await apiClient.get<SellerAdsResponse>(
            `/users/${sellerId}/ads`,
        );

        if (!result.success) {
            return {
                success: false,
                error: result.error,
                status: result.status,
            };
        }

        return {
            success: true,
            data: Array.isArray(result.data?.ads) ? result.data.ads : [],
        };
    },
};
