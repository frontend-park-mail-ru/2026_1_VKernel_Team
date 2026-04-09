/**
 * Компонент кнопки корзины
 */

import { cartActions } from './actions';
import { cartService } from './service';
import { cartStore } from './store';
import { store } from '@/core/store';

export class CartButton {
    private button: HTMLElement;

    constructor(buttonElement: HTMLElement) {
        this.button = buttonElement;
        this.init();
    }

    private init(): void {
        this.button.addEventListener('click', this.handleClick.bind(this));
        this.updateState();
    }

    private async handleClick(event: Event): Promise<void> {
        event.preventDefault();
        event.stopPropagation();

        if (!store.isAuthenticated) {
            window.history.pushState({}, '', '/login');
            store.setState({ currentPage: '/login' });
            return;
        }

        const productId = Number(this.button.dataset.cartAdd);
        if (!productId) return;

        const button = this.button;
        const isInCart = button.classList.contains('in-cart');

        button.classList.remove('in-cart');
        button.classList.add('loading');

        try {
            if (isInCart) {
                const removed = await cartActions.removeFromCart(productId);
                if (removed) {
                    button.title = 'В корзину';
                    this.updateState();
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
                    this.updateState();
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
    }

    private updateState(): void {
        const productId = Number(this.button.dataset.cartAdd);
        if (!productId) return;

        const cartIds = new Set(
            cartStore.getState().items.map((item) => item.product_id),
        );
        if (cartIds.has(productId)) {
            this.button.classList.add('in-cart');
            this.button.title = 'В корзине';
        } else {
            this.button.classList.remove('in-cart');
            this.button.title = 'В корзину';
        }
    }

    static initAll(): void {
        document
            .querySelectorAll<HTMLElement>('[data-cart-add]')
            .forEach((button) => {
                if (!button.hasAttribute('data-cart-initialized')) {
                    new CartButton(button);
                    button.setAttribute('data-cart-initialized', 'true');
                }
            });
    }
}
