/**
 * Сервис для работы с корзиной
 * @module cartService
 */
import { apiClient } from '@/api/apiClient';
import { CONFIG } from '@/core/config';
import { CART_API_ENDPOINTS } from './config';
import type {
    CartResponse,
    CheckoutResponse,
    CartItem,
    CartSellerGroup,
} from './types';

const cartService = {
    async getCart() {
        return apiClient.get<CartResponse>(CART_API_ENDPOINTS.GET);
    },

    async addToCart(productId: number) {
        return apiClient.post(CART_API_ENDPOINTS.ADD, {
            product_id: productId,
        });
    },

    async removeFromCart(productId: number) {
        return apiClient.delete(CART_API_ENDPOINTS.REMOVE(productId));
    },

    async checkout() {
        return apiClient.post<CheckoutResponse>(
            CART_API_ENDPOINTS.CHECKOUT,
            {},
        );
    },

    /**
     * Группирует товары корзины по продавцам
     */
    groupBySeller(items: CartItem[]): CartSellerGroup[] {
        const groups: Record<number, CartSellerGroup> = {};

        for (const item of items) {
            if (!groups[item.seller_id]) {
                groups[item.seller_id] = {
                    seller_name: item.seller_name,
                    seller_id: item.seller_id,
                    items: [],
                };
            }
            groups[item.seller_id].items.push(item);
        }

        return Object.values(groups);
    },

    /**
     * Формирует URL изображения товара
     */
    getImageUrl(imagePath: string): string {
        if (!imagePath) return '/images/default-ad.jpg';
        if (imagePath.startsWith('http')) return imagePath;

        const normalized = imagePath.startsWith('/')
            ? imagePath
            : `/${imagePath}`;
        return `${CONFIG.API.BASE_URL}${normalized}`;
    },

    /**
     * Форматирует цену для отображения
     */
    formatPrice(price: number): string {
        return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`;
    },
};

export { cartService };
