import { apiClient } from '@api/apiClient';
import type { ApiResponse } from '@/types';
import type { SupportTicket, CreateTicketRequest, UpdateTicketRequest } from '../types';

const ENDPOINTS = {
    TICKETS: '/support/tickets',
    TICKET_BY_ID: (id: number) => `/support/tickets/${id}`,
};

export const supportApi = {
    async createTicket(data: CreateTicketRequest): Promise<ApiResponse<SupportTicket>> {
        return apiClient.post<SupportTicket>(ENDPOINTS.TICKETS, data);
    },

    async getMyTickets(): Promise<ApiResponse<SupportTicket[]>> {
        return apiClient.get<SupportTicket[]>(ENDPOINTS.TICKETS);
    },

    async getTicket(id: number): Promise<ApiResponse<SupportTicket>> {
        return apiClient.get<SupportTicket>(ENDPOINTS.TICKET_BY_ID(id));
    },

    async updateTicket(id: number, data: UpdateTicketRequest): Promise<ApiResponse<SupportTicket>> {
        return apiClient.put<SupportTicket>(ENDPOINTS.TICKET_BY_ID(id), data);
    },

    async rateTicket(id: number, rating: number): Promise<ApiResponse<SupportTicket>> {
        return apiClient.post<SupportTicket>(`${ENDPOINTS.TICKET_BY_ID(id)}/rate`, { rating });
    },
};
