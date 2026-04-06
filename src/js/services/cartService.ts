/**
 * Сервис для работы с корзиной
 * @module cartService
 */
import { apiClient, API_ENDPOINTS } from '@/api/apiClient';
import { CONFIG } from '@/core/config';
import type {
    CartResponse,
    CheckoutResponse,
    CartItem,
    CartSellerGroup,
} from '@/types';

const cartService = {
    async getCart() {
        return apiClient.get<CartResponse>(API_ENDPOINTS.CART.GET);
    },

    async addToCart(productId: number) {
        return apiClient.post(API_ENDPOINTS.CART.ADD, {
            product_id: productId,
        });
    },

    async removeFromCart(productId: number) {
        return apiClient.delete(API_ENDPOINTS.CART.REMOVE(productId));
    },

    async checkout() {
        return apiClient.post<CheckoutResponse>(
            API_ENDPOINTS.CART.CHECKOUT,
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
        return imagePath.startsWith('http')
            ? imagePath
            : `${CONFIG.API.BASE_URL}${imagePath}`;
    },

    /**
     * Форматирует цену для отображения
     */
    formatPrice(price: number): string {
        return price === 0 ? 'Бесплатно' : `${price.toLocaleString('ru-RU')} ₽`;
    },
};

export { cartService };
