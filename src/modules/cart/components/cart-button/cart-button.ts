import '@modules/cart/components/cart-button/styles.css';
import { cartActions } from '@modules/cart/actions';
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
                    const product = this.extractProductFromDOM(button, productId);
                    const added = await cartActions.addToCart(productId, product);
                    if (added) {
                        button.classList.add('in-cart');
                        button.title = 'В корзине';
                        this.updateButtonState(button, productId);
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

    extractProductFromDOM(button: HTMLElement, productId: number): CartItem | undefined {
        const card = button.closest('.rec-card') as HTMLElement | null;
        if (!card) return undefined;

        const title = card.querySelector('.rec-card-title')?.textContent?.trim() || '';
        const priceText = card.querySelector('.rec-card-price')?.textContent?.trim() || '';
        const price = priceText.toLowerCase().includes('бесплатно')
            ? 0
            : parseInt(priceText.replace(/\D/g, ''), 10) || 0;
        const image = card.querySelector('.rec-card-image')?.getAttribute('src') || '';
        const location = card.querySelector('.rec-card-location')?.textContent?.trim() || '';

        return {
            product_id: productId,
            title,
            price,
            image_path: image,
            seller_id: 0,
            seller_name: 'Продавец неизвестен',
            location,
        };
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
