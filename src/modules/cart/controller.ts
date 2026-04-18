/**
 * Cart controller
 * Рендеринг страницы корзины и обработка событий.
 */

import { cartActions } from '@modules/cart/actions';
import { cartService } from '@modules/cart/service';
import { cartStore } from '@modules/cart/store';
import { store } from '@/core/store';
import { networkStatus } from '@modules/common/offline/network/networkStatus';
import { getTemplate } from '@modules/cart/pages/cart/cart';

export const CartController = {
    async renderCart(): Promise<void> {
        // Сначала показываем кешированные данные
        await cartActions.loadFromCache();
        this.renderFromState();

        // Потом обновляем с сервера (не блокируя UI)
        if (networkStatus.isOnline) {
            await cartActions.loadCart();
            this.renderFromState();
        }
    },

    buildTemplateData() {
        const cartState = cartStore.getState();
        const items = cartState.items;
        const totalPrice = cartState.total;
        const sellerGroups = cartService.groupBySeller(items);

        const formattedGroups = sellerGroups.map((group) => ({
            ...group,
            items: group.items.map((item) => ({
                ...item,
                imageUrl: cartService.getImageUrl(item.image_path),
                formattedPrice: cartService.formatPrice(item.price),
                location: item.location || 'Не указано',
            })),
        }));

        return {
            isAuthenticated: store.isAuthenticated,
            user: store.user,
            isEmpty: items.length === 0,
            sellerGroups: formattedGroups,
            itemCount: items.length,
            totalFormatted: cartService.formatPrice(totalPrice),
        };
    },

    renderFromState(): void {
        const app = document.getElementById('app');
        const template = getTemplate();
        if (!app || !template) return;

        document.body.classList.remove('auth-page');

        const data = this.buildTemplateData();

        // Если корзина уже отрисована — обновляем только контент, не трогая header
        const existingCartPage = app.querySelector('.cart-page');
        if (existingCartPage) {
            const tmp = document.createElement('div');
            tmp.innerHTML = template(data);
            const newCartPage = tmp.querySelector('.cart-page');
            if (newCartPage) {
                existingCartPage.replaceWith(newCartPage);
                this.attachEventListeners();
                return;
            }
        }

        app.innerHTML = template(data);
        this.attachEventListeners();
    },

    attachEventListeners(): void {
        // Удаление товара из корзины
        document.querySelectorAll('[data-delete-id]').forEach((btn) => {
            btn.addEventListener('click', async (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = Number((btn as HTMLElement).dataset.deleteId);
                if (productId) {
                    const success = await cartActions.removeFromCart(productId);
                    if (success) {
                        this.renderFromState();
                    }
                }
            });
        });

        // Табы доставки
        document.querySelectorAll('.cart-delivery-tab').forEach((tab) => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.cart-delivery-tab').forEach((t) => {
                    t.classList.remove('active');
                    const check = t.querySelector('.cart-tab-check');
                    if (check) check.remove();
                });

                tab.classList.add('active');
                if (!tab.querySelector('.cart-tab-check')) {
                    const check = document.createElement('span');
                    check.className = 'cart-tab-check';
                    check.textContent = '✓';
                    tab.prepend(check);
                }
            });
        });

        // Оформление заказа
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', async () => {
                const success = await cartActions.checkout();
                if (success) {
                    this.renderFromState();
                }
            });
        }
    },
};
