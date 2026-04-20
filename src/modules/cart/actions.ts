/**
 * Действия для работы с корзиной
 */

import { cartService } from '@modules/cart/service';
import { cartStore } from '@modules/cart/store';
import { networkStatus } from '@modules/common/offline/network/networkStatus';
import { syncQueue } from '@modules/common/offline/sync/syncQueue';
import { NotificationComponent } from '@modules/common/notifications/notification';
import { adsService } from '@/services/adsServices';
import type { CartItem } from '@modules/cart/types';

function isNetworkError(result: { success: boolean; status?: number }): boolean {
    return !result.success && result.status === 0;
}

function enqueue(type: 'ADD_TO_CART' | 'REMOVE_FROM_CART', productId: number): void {
    syncQueue
        .add({ type, payload: { product_id: productId }, timestamp: Date.now() })
        .catch(() => {});
}

export const cartActions = {
    async loadFromCache(): Promise<void> {
        await cartStore.loadFromCache();
    },

    async loadCart(): Promise<void> {
        cartStore.setState({ error: null, isLoading: true });

        try {
            const result = await cartService.getCart();

            if (isNetworkError(result)) {
                // network unavailable
                cartStore.setState({ isLoading: false });
                return;
            }

            if (result.success && result.data) {
                const items = result.data.items || [];
                const fixedItems = await this.fixItemImages(items);
                cartStore.setState({
                    items: fixedItems,
                    total: result.data.total_price || 0,
                    isLoading: false,
                });
            } else {
                cartStore.setState({
                    error: result.error || 'Не удалось загрузить корзину',
                    isLoading: false,
                });
            }
        } catch {
            // network unavailable
            cartStore.setState({ isLoading: false });
        }
    },

    async addToCart(productId: number, product?: CartItem): Promise<boolean> {
        if (networkStatus.isOnline) {
            try {
                const result = await cartService.addToCart(productId);

                if (result.success) {
                    // network ok
                    await cartActions.loadCart();
                    return true;
                }

                if (isNetworkError(result)) {
                    // network unavailable
                } else {
                    return false;
                }
            } catch {
                // network unavailable
            }
        }

        // Офлайн-путь (или фолбек после сетевой ошибки)
        if (product) {
            const currentItems = cartStore.getState().items;
            const alreadyInCart = currentItems.some(
                (item: CartItem) => item.product_id === productId,
            );
            if (!alreadyInCart) {
                const updatedItems = [...currentItems, product];
                const updatedTotal = updatedItems.reduce(
                    (sum: number, item: CartItem) => sum + item.price,
                    0,
                );
                cartStore.setState({ items: updatedItems, total: updatedTotal });
            }
        }

        enqueue('ADD_TO_CART', productId);
        return true;
    },

    async removeFromCart(productId: number): Promise<boolean> {
        const currentItems = cartStore.getState().items;
        const updatedItems = currentItems.filter((item: CartItem) => item.product_id !== productId);
        const updatedTotal = updatedItems.reduce(
            (sum: number, item: CartItem) => sum + item.price,
            0,
        );
        cartStore.setState({ items: updatedItems, total: updatedTotal });

        if (networkStatus.isOnline) {
            try {
                const result = await cartService.removeFromCart(productId);

                if (isNetworkError(result)) {
                    // network unavailable
                } else {
                    if (result.success)
                        // network ok
                        return result.success;
                }
            } catch {
                // network unavailable
            }
        }

        enqueue('REMOVE_FROM_CART', productId);
        return true;
    },

    async fixItemImages(items: CartItem[]): Promise<CartItem[]> {
        const results = await Promise.all(
            items.map(async (item) => {
                try {
                    const result = await adsService.getAdById(item.product_id);
                    if (result.success && result.data?.photos?.length) {
                        const firstPhoto = result.data.photos[0]?.trim();
                        if (firstPhoto) {
                            return { ...item, image_path: firstPhoto };
                        }
                    }
                } catch {
                    // fallback to original image_path
                }
                return item;
            }),
        );
        return results;
    },

    async checkout(): Promise<boolean> {
        if (!networkStatus.isOnline) {
            NotificationComponent.show({
                type: 'warning',
                message: 'Оформление заказа недоступно без подключения к интернету',
            });
            return false;
        }

        cartStore.setState({ error: null });

        try {
            const result = await cartService.checkout();

            if (isNetworkError(result)) {
                // network unavailable
                NotificationComponent.show({
                    type: 'warning',
                    message: 'Оформление заказа недоступно без подключения к интернету',
                });
                return false;
            }

            if (result.success) {
                cartStore.setState({ items: [], total: 0 });
                return true;
            }

            cartStore.setState({
                error: result.error || 'Не удалось оформить заказ',
            });
            return false;
        } catch {
            // network unavailable
            NotificationComponent.show({
                type: 'warning',
                message: 'Оформление заказа недоступно без подключения к интернету',
            });
            return false;
        }
    },
};
