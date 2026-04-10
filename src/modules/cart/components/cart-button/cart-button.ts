import '@modules/cart/components/cart-button/styles.css';
import { cartActions } from '@modules/cart/actions';
import { cartService } from '@modules/cart/service';
import { cartStore } from '@modules/cart/store';
import { store } from '@core/store';
import type { CartItem } from '@modules/cart/types';

export const CartButtonComponent = {
    getTemplate(): string {
        return `
<button class="rec-card-cart" data-cart-add="{{productId}}" title="В корзину">
    <svg class="cart-icon cart-icon--add" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
    <svg class="cart-icon cart-icon--check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
    <svg class="cart-icon cart-icon--spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M12 2a10 10 0 0 1 10 10"/>
    </svg>
</button>
        `.trim();
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
