import '@modules/cart/components/cart-button/styles.css';
import { cartActions } from '@modules/cart/actions';
import { cartService } from '@modules/cart/service';
import { cartStore } from '@modules/cart/store';
import { store } from '@core/store';
import type { CartItem } from '@modules/cart/types';
import template from '@modules/cart/components/cart-button/cart-button.hbs?raw';

export const CartButtonComponent = {
    getTemplate(): string {
        return template;
    },

    initAll(): void {
        document.querySelectorAll<HTMLElement>('[data-cart-add]').forEach((button) => {
            if (!button.hasAttribute('data-cart-initialized')) {
                this.initButton(button);
                button.setAttribute('data-cart-initialized', 'true');
            }
        });
    },

    initButton(button: HTMLElement): void {
        button.addEventListener('click', async (event: Event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!store.isAuthenticated) {
                window.history.pushState({}, '', '/login');
                store.setState({ currentPage: '/login' });
                return;
            }

            const productId = Number(button.dataset.cartAdd);
            if (!productId) return;

            const isInCart = button.classList.contains('in-cart');
            button.classList.remove('in-cart');
            button.classList.add('loading');

            try {
                if (isInCart) {
                    const removed = await cartActions.removeFromCart(productId);
                    if (removed) {
                        button.title = 'В корзину';
                        this.updateButtonState(button, productId);
                    } else {
                        button.classList.add('in-cart');
                        button.title = 'В корзине';
                    }
                } else {
                    const result = await cartService.addToCart(productId);
                    if (result.success) {
                        button.classList.add('in-cart');
                        button.title = 'В корзине';
                        await cartActions.loadCart();
                        this.updateButtonState(button, productId);
                    } else {
                        const errorMsg = result.error || '';
                        if (errorMsg.includes('already in cart')) {
                            button.classList.add('in-cart');
                            button.title = 'В корзине';
                        }
                    }
                }
            } catch (error) {
                console.error('Error handling cart button click:', error);
            } finally {
                button.classList.remove('loading');
            }
        });

        this.updateButtonState(button, Number(button.dataset.cartAdd));
    },

    updateButtonState(button: HTMLElement, productId: number): void {
        if (!productId) return;

        const cartIds = new Set(
            cartStore.getState().items.map((item: CartItem) => item.product_id),
        );
        if (cartIds.has(productId)) {
            button.classList.add('in-cart');
            button.title = 'В корзине';
        } else {
            button.classList.remove('in-cart');
            button.title = 'В корзину';
        }
    },
};
