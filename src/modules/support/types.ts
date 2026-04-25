export interface SupportTicket {
    id: number;
    user_id: number;
    category: 'bug' | 'suggestion' | 'complaint';
    status: 'open' | 'in_progress' | 'closed';
    title: string;
    description: string;
    rating: number | null;
    created_at: string;
    updated_at: string;
}

export interface CreateTicketRequest {
    category: string;
    title: string;
    description: string;
}

export interface UpdateTicketRequest {
    category: string;
    title: string;
    description: string;
}
