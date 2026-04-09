/**
 * Действия для работы с корзиной
 */

import { cartService } from './service';
import { cartStore } from './store';
import type { CartItem } from './types';

export const cartActions = {
    async loadCart(): Promise<void> {
        cartStore.setState({ error: null, isLoading: true });

        try {
            const result = await cartService.getCart();

            if (result.success && result.data) {
                cartStore.setState({
                    items: result.data.items || [],
                    total: result.data.total_price || 0,
                    isLoading: false,
                });
            } else {
                cartStore.setState({
                    items: [],
                    total: 0,
                    error: result.error || 'Не удалось загрузить корзину',
                    isLoading: false,
                });
            }
        } catch (error) {
            cartStore.setState({
                error: 'Не удалось соединиться с сервером',
                isLoading: false,
            });
        }
    },

    async removeFromCart(productId: number): Promise<boolean> {
        try {
            const result = await cartService.removeFromCart(productId);

            if (result.success) {
                const currentItems = cartStore.getState().items;
                const updatedItems = currentItems.filter(
                    (item: CartItem) => item.product_id !== productId,
                );
                const updatedTotal = updatedItems.reduce(
                    (sum: number, item: CartItem) => sum + item.price,
                    0,
                );

                cartStore.setState({
                    items: updatedItems,
                    total: updatedTotal,
                });
                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    },

    async checkout(): Promise<boolean> {
        cartStore.setState({ error: null });

        try {
            const result = await cartService.checkout();

            if (result.success) {
                cartStore.setState({
                    items: [],
                    total: 0,
                });
                return true;
            }

            cartStore.setState({
                error: result.error || 'Не удалось оформить заказ',
            });
            return false;
        } catch (error) {
            cartStore.setState({
                error: 'Не удалось соединиться с сервером',
            });
            return false;
        }
    },
};
