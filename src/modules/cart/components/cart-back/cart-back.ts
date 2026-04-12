/**
 * Cart back component
 * Простой компонент кнопки "назад" без логики
 */

import '@modules/cart/components/cart-back/styles.css';
import template from '@modules/cart/components/cart-back/cart-back.hbs?raw';

export const CartBackComponent = {
    getTemplate(): string {
        return template;
    },
};
