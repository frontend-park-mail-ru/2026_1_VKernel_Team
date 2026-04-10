/**
 * Cart item component
 * Простой компонент товара в корзине без логики
 */

import '@modules/cart/components/cart-item/styles.css';

export const CartItemComponent = {
    getTemplate(): string {
        return `
<div class="cart-item" data-product-id="{{product_id}}">
    <div class="cart-item-image">
        <img src="{{imageUrl}}" alt="{{title}}">
    </div>
    <div class="cart-item-info">
        <span class="cart-item-title">{{title}}</span>
        <span class="cart-item-price">{{formattedPrice}}</span>
    </div>
    <div class="cart-item-delivery">
        <div class="cart-item-address">
            <span class="cart-item-address-label">Адрес продавца:</span>
            <span class="cart-item-address-value">Москва</span>
        </div>
        <div class="cart-item-time">
            <span class="cart-item-time-icon">🕐</span>
            <span class="cart-item-schedule">Доставка сегодня</span>
        </div>
    </div>
    <button class="cart-item-delete" data-delete-id="{{product_id}}">
        🗑️
    </button>
</div>
        `.trim();
    },
};
