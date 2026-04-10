import '@modules/cart/components/cart-order-summary/styles.css';

export const CartOrderSummaryComponent = {
    getTemplate(): string {
        return `
<!-- Блок заказа -->
<div class="cart-order-summary">
    <h3 class="cart-order-title">Ваш заказ</h3>
    <div class="cart-order-row">
        <span>Товары ({{itemCount}})</span>
        <span>{{totalFormatted}}</span>
    </div>
    <div class="cart-order-row cart-order-total">
        <span>Итого</span>
        <span class="cart-order-total-price">{{totalFormatted}}</span>
    </div>
    <button class="cart-checkout-btn" id="checkout-btn">
        Оформить заказ
    </button>
    <p class="cart-order-disclaimer">
        Нажимая кнопку, вы принимаете условия Клевер
        <a href="#" class="cart-order-link">Доставки</a> и подтверждаете достоверность указанных данных.
        <a href="#" class="cart-order-link">Политика конфиденциальности</a>
    </p>
</div>
        `.trim();
    },
};
