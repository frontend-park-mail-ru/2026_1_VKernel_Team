/**
 * Cart item component
 * Простой компонент товара в корзине без логики
 */

import '@modules/cart/components/cart-item/styles.scss';
import template from '@modules/cart/components/cart-item/cart-item.hbs?raw';

export const CartItemComponent = {
    getTemplate(): string {
        return template;
    },
};
