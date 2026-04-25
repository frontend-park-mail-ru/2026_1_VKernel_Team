/**
 * Сервис для работы с чатами
 */
import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import { CONFIG } from '@/core/config';
import type {
    ChatListResponse,
    ChatDetailResponse,
    OrderResponse,
    ConfirmOrderResponse,
} from '@modules/chat/types';

const DEFAULT_AD_IMAGE = '/images/default-ad.jpg';
const DEFAULT_AVATAR = '/images/logo/avatar.jpeg';

export const chatService = {
    async getChats() {
        return apiClient.get<ChatListResponse>(API_ENDPOINTS.CHATS.GET_ALL);
    },

    async getChatById(id: number | string) {
        return apiClient.get<ChatDetailResponse>(API_ENDPOINTS.CHATS.GET_BY_ID(id));
    },

    async createOrder(adId: number | string) {
        return apiClient.post<OrderResponse>(API_ENDPOINTS.CHATS.CREATE_ORDER(adId), {});
    },

    async confirmOrder(chatId: number | string) {
        return apiClient.post<ConfirmOrderResponse>(API_ENDPOINTS.CHATS.CONFIRM(chatId), {});
    },

    /**
     * Формирует URL изображения (объявление, аватар) с учётом базового API-адреса
     */
    buildMediaUrl(path?: string, fallback: string = DEFAULT_AD_IMAGE): string {
        if (!path) return fallback;
        const trimmed = path.trim();
        if (!trimmed) return fallback;
        if (
            trimmed.startsWith('http://') ||
            trimmed.startsWith('https://') ||
            trimmed.startsWith('data:')
        ) {
            return trimmed;
        }
        const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
        return `${CONFIG.API.BASE_URL}${normalized}`;
    },

    buildAvatarUrl(path?: string): string {
        return this.buildMediaUrl(path, DEFAULT_AVATAR);
    },

    formatPrice(price: number): string {
        return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`;
    },

    /**
     * Усекает текст до N символов, добавляя многоточие если был обрезан
     */
    truncate(text: string, max: number = 60): string {
        if (!text) return '';
        const clean = text.replace(/\s+/g, ' ').trim();
        if (clean.length <= max) return clean;
        return `${clean.slice(0, max).trim()}…`;
    },

    /**
     * Форматирует дату+время сообщения. Сегодня — «HH:MM», иначе «DD.MM.YYYY HH:MM».
     */
    formatMessageTime(dateString?: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        const now = new Date();
        const sameDay =
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate();

        if (sameDay) return time;
        return `${date.toLocaleDateString('ru-RU')} ${time}`;
    },
};
