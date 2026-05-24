import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import type { ApiResponse } from '@/types';
import type {
    AdminDeleteResponse,
    ModerationActionResponse,
    ModerationQueueResponse,
    ModerationSettingsResponse,
    PendingAdsResponse,
    RejectRequest,
} from './types';

export const moderationApi = {
    getSettings(): Promise<ApiResponse<ModerationSettingsResponse>> {
        return apiClient.get<ModerationSettingsResponse>(API_ENDPOINTS.MODERATION.SETTINGS);
    },

    updateSettings(enabled: boolean): Promise<ApiResponse<ModerationSettingsResponse>> {
        return apiClient.put<ModerationSettingsResponse>(API_ENDPOINTS.MODERATION.SETTINGS, {
            enabled,
        });
    },

    getQueue(): Promise<ApiResponse<ModerationQueueResponse>> {
        return apiClient.get<ModerationQueueResponse>(API_ENDPOINTS.MODERATION.QUEUE);
    },

    approve(adId: number | string): Promise<ApiResponse<ModerationActionResponse>> {
        return apiClient.post<ModerationActionResponse>(API_ENDPOINTS.MODERATION.APPROVE(adId), {});
    },

    reject(adId: number | string, reason: string): Promise<ApiResponse<ModerationActionResponse>> {
        const body: RejectRequest = reason ? { reason } : {};
        return apiClient.post<ModerationActionResponse>(
            API_ENDPOINTS.MODERATION.REJECT(adId),
            body,
        );
    },

    adminDelete(adId: number | string): Promise<ApiResponse<AdminDeleteResponse>> {
        return apiClient.delete<AdminDeleteResponse>(API_ENDPOINTS.MODERATION.ADMIN_DELETE(adId));
    },

    getPendingAds(userId: number | string): Promise<ApiResponse<PendingAdsResponse>> {
        return apiClient.get<PendingAdsResponse>(API_ENDPOINTS.MODERATION.PENDING_ADS(userId));
    },
};
