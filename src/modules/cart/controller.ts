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
import { chatActions } from '@modules/chat/actions';
import { ICONS } from '@/utils/icons';

export const CartController = {
    async renderCart(): Promise<void> {
        // Сначала показываем кешированные данные, потом обновляем с сервера, чтобы UI не моргал пустой
        await cartActions.loadFromCache();
        this.renderFromState();

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
        const tmp = document.createElement('div');
        tmp.innerHTML = template(data);
        const newCartPage = tmp.querySelector('.cart-page');
        if (!newCartPage) return;

        const existingCartPage = app.querySelector('.cart-page');
        if (existingCartPage) {
            existingCartPage.replaceWith(newCartPage);
        } else {
            app.innerHTML = tmp.innerHTML;
        }

        this.attachEventListeners();
    },

    attachEventListeners(): void {
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

        document.querySelectorAll('[data-message-seller-id]').forEach((btn) => {
            btn.addEventListener('click', async (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
                const adId = Number((btn as HTMLElement).dataset.messageSellerId);
                if (!adId) return;

                const button = btn as HTMLButtonElement;
                button.disabled = true;
                window.dispatchEvent(new CustomEvent('app:loading', { detail: { show: true } }));

                try {
                    const chatId = await chatActions.createOrderForAd(adId);
                    if (chatId) {
                        window.dispatchEvent(
                            new CustomEvent('app:navigate', {
                                detail: { path: `/chats/${chatId}` },
                            }),
                        );
                    }
                } finally {
                    button.disabled = false;
                    window.dispatchEvent(
                        new CustomEvent('app:loading', { detail: { show: false } }),
                    );
                }
            });
        });

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
                    check.innerHTML = ICONS.check;
                    tab.prepend(check);
                }
            });
        });
    },
};
