/**
 * Cart seller group component
 * Простой компонент группы товаров по продавцу без логики
 */

import '@modules/cart/components/cart-seller-group/styles.scss';
import template from '@modules/cart/components/cart-seller-group/cart-seller-group.hbs?raw';

export const CartSellerGroupComponent = {
    getTemplate(): string {
        return template;
    },
};
