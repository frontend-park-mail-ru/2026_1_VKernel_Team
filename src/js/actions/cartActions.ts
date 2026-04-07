/**
 * Действия для работы с корзиной
 */

import { cartService } from '@/services/cartService';
import { store } from '@/core/store';
import type { CartItem } from '@/types';

export const cartActions = {
    async loadCart(): Promise<void> {
        store.setState({ error: null });

        try {
            const result = await cartService.getCart();

            if (result.success && result.data) {
                store.setState({
                    cartItems: result.data.items || [],
                    cartTotal: result.data.total_price || 0,
                });
            } else {
                store.setState({
                    cartItems: [],
                    cartTotal: 0,
                    error: result.error || 'Не удалось загрузить корзину',
                });
            }
        } catch (error) {
            store.setState({
                error: 'Не удалось соединиться с сервером',
            });
        }
    },

    async removeFromCart(productId: number): Promise<boolean> {
        try {
            const result = await cartService.removeFromCart(productId);

            if (result.success) {
                const currentItems = store.getState().cartItems || [];
                const updatedItems = currentItems.filter(
                    (item: CartItem) => item.product_id !== productId,
                );
                const updatedTotal = updatedItems.reduce(
                    (sum: number, item: CartItem) => sum + item.price,
                    0,
                );

                store.setState({
                    cartItems: updatedItems,
                    cartTotal: updatedTotal,
                });
                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    },

    async checkout(): Promise<boolean> {
        store.setState({ error: null });

        try {
            const result = await cartService.checkout();

            if (result.success) {
                store.setState({
                    cartItems: [],
                    cartTotal: 0,
                });
                return true;
            }

            store.setState({
                error: result.error || 'Не удалось оформить заказ',
            });
            return false;
        } catch (error) {
            store.setState({
                error: 'Не удалось соединиться с сервером',
            });
            return false;
        }
    },
};
