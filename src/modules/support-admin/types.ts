import type { SupportTicket } from '../support/types';

export type SupportTicketAdmin = SupportTicket;

export interface StatsResponse {
    total: number;
    by_status: Record<string, number>;
    by_category: Record<string, number>;
}

export interface ChangeStatusRequest {
    status: 'open' | 'in_progress' | 'closed';
}

export interface TicketStatusResponse {
    id: number;
    status: string;
    updated_at: string;
}
