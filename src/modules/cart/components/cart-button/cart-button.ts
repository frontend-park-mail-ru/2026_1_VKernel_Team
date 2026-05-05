import '@modules/cart/components/cart-button/styles.scss';
import { cartActions } from '@modules/cart/actions';
import { cartStore } from '@modules/cart/store';
import { store } from '@core/store';
import { eventBus } from '@core/eventBus';
import { saveReturnTo } from '@/utils/returnTo';
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
                saveReturnTo();
                eventBus.emit('app:navigate', '/login');
                return;
            }

            // Защита от double-click
            if (button.dataset.cartLoading === '1') return;

            const productId = Number(button.dataset.cartAdd);
            if (!productId) return;

            // Если товар уже в корзине — просто переходим в корзину, без запроса.
            if (button.classList.contains('in-cart')) {
                eventBus.emit('app:navigate', '/cart');
                return;
            }

            button.dataset.cartLoading = '1';
            button.classList.add('loading');

            try {
                const product = this.extractProductFromDOM(button, productId);
                const added = await cartActions.addToCart(productId, product);
                if (added) {
                    button.classList.add('in-cart');
                    button.title = 'В корзине';
                    this.updateButtonState(button, productId);
                }
            } catch (error) {
                console.error('Error handling cart button click:', error);
            } finally {
                delete button.dataset.cartLoading;
                button.classList.remove('loading');
            }
        });

        this.updateButtonState(button, Number(button.dataset.cartAdd));
    },

    extractProductFromDOM(button: HTMLElement, productId: number): CartItem | undefined {
        const card = button.closest('.rec-card') as HTMLElement | null;

        if (card) {
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
                seller_id: Number(card.getAttribute('data-seller-id')) || 0,
                seller_name:
                    card.querySelector('.rec-card-seller')?.textContent?.trim() ||
                    'Продавец неизвестен',
                location,
            };
        }

        // Fallback: страница объявления (детальная), кнопка одиночная.
        // Читаем из data-* атрибутов кнопки или ближайших элементов.
        const titleAttr = button.dataset.productTitle;
        const priceAttr = button.dataset.productPrice;
        const imageAttr = button.dataset.productImage;
        const sellerIdAttr = button.dataset.productSellerId;
        const sellerNameAttr = button.dataset.productSellerName;
        const locationAttr = button.dataset.productLocation;

        if (titleAttr) {
            return {
                product_id: productId,
                title: titleAttr,
                price: Number(priceAttr) || 0,
                image_path: imageAttr || '',
                seller_id: Number(sellerIdAttr) || 0,
                seller_name: sellerNameAttr || 'Продавец неизвестен',
                location: locationAttr || '',
            };
        }

        return undefined;
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
