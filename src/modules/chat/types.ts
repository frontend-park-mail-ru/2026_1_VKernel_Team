/**
 * Типы для модуля чатов
 */

export interface ChatAdPreview {
    ad_id: number;
    title: string;
    price: number;
    photo?: string;
    status?: string;
}

export interface ChatUserPreview {
    id: number;
    name: string;
    avatar_path?: string;
}

export interface ChatLastMessage {
    created_at: string;
    text: string;
    type: string;
}

export interface ChatPreview {
    chat_id: number;
    ad: ChatAdPreview;
    partner: ChatUserPreview;
    last_message?: ChatLastMessage;
}

export interface ChatListResponse {
    chats: ChatPreview[];
}

export interface ChatMessage {
    id: number;
    sender_id: number;
    text: string;
    type: 'text' | 'order' | string;
    created_at: string;
}

export interface ChatDetailResponse {
    chat_id: number;
    ad: ChatAdPreview;
    partner: ChatUserPreview;
    messages: ChatMessage[];
}

export interface OrderResponse {
    chat_id: number;
    message?: string;
}

export interface ConfirmOrderResponse {
    message?: string;
}
