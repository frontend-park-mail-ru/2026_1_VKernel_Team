import { apiClient } from '@api/apiClient';
import type { ApiResponse } from '@/types';
import type {
    SupportTicketAdmin,
    StatsResponse,
    ChangeStatusRequest,
    TicketStatusResponse,
} from '../types';

const ENDPOINTS = {
    ALL: '/support/tickets/all',
    STATS: '/support/tickets/stats',
    STATUS: (id: number) => `/support/tickets/${id}/status`,
};

export const adminApi = {
    async getAllTickets(): Promise<ApiResponse<SupportTicketAdmin[]>> {
        return apiClient.get<SupportTicketAdmin[]>(ENDPOINTS.ALL);
    },

    async getStats(): Promise<ApiResponse<StatsResponse>> {
        return apiClient.get<StatsResponse>(ENDPOINTS.STATS);
    },

    async changeStatus(
        id: number,
        data: ChangeStatusRequest,
    ): Promise<ApiResponse<TicketStatusResponse>> {
        return apiClient.patch<TicketStatusResponse>(ENDPOINTS.STATUS(id), data);
    },
};
