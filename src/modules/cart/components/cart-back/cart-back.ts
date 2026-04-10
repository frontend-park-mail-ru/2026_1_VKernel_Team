/**
 * Cart back component
 * Простой компонент кнопки "назад" без логики
 */

import '@modules/cart/components/cart-back/styles.css';

export const CartBackComponent = {
    getTemplate(): string {
        return `
<div class="cart-back" data-nav="/">
    <span class="cart-back-arrow">←</span> Назад
</div>
        `.trim();
    },
};
