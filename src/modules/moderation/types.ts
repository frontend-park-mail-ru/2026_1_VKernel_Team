import type { Ad } from '@/types';

export interface ModerationSettingsResponse {
    enabled: boolean;
}

export interface ModerationQueueResponse {
    ads: Ad[];
}

export interface ModerationActionResponse {
    status: string;
}

export interface RejectRequest {
    reason?: string;
}

export interface PendingAdsResponse {
    ads: Ad[];
}

export interface AdminDeleteResponse {
    status: string;
}
