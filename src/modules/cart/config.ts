/**
 * Конфигурация API для модуля корзины
 */
export const CART_API_ENDPOINTS = {
    GET: '/cart',
    ADD: '/cart',
    REMOVE: (id: number | string) => `/cart/${id}`,
    CHECKOUT: '/cart/checkout',
};
