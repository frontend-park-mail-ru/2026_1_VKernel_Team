import '@modules/cart/components/cart-order-summary/styles.css';
import template from '@modules/cart/components/cart-order-summary/cart-order-summary.hbs?raw';

export const CartOrderSummaryComponent = {
    getTemplate(): string {
        return template;
    },
};
