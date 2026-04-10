/**
 * Cart seller group component
 * Простой компонент группы товаров по продавцу без логики
 */

import './styles.css';

export const CartSellerGroupComponent = {
    getTemplate(): string {
        return `
<div class="cart-seller-group">
    <div class="cart-seller-header">
        <div class="cart-seller-name">{{sellerName}}</div>
    </div>
    {{#each items}}
        {{> cart-item this}}
    {{/each}}
</div>
        `.trim();
    },
};
