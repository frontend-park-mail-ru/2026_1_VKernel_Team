import './styles.css';

export const CartPaymentOptionsComponent = {
    getTemplate(): string {
        return `
<!-- Способы оплаты -->
<div class="cart-payment">
    <h3 class="cart-payment-title">Способы оплаты</h3>
    <label class="cart-payment-option">
        <input type="radio" name="payment" value="wallet">
        <span class="cart-payment-radio"></span>
        <span>Кошелёк</span>
    </label>
    <label class="cart-payment-option">
        <input type="radio" name="payment" value="card" checked>
        <span class="cart-payment-radio"></span>
        <span>Карта или СБП</span>
    </label>
    <label class="cart-payment-option">
        <input type="radio" name="payment" value="on-delivery">
        <span class="cart-payment-radio"></span>
        <span>При получении</span>
    </label>
</div>
        `.trim();
    },

    initAll(): void {
        document
            .querySelectorAll<HTMLElement>('.cart-payment')
            .forEach((paymentContainer) => {
                if (
                    !paymentContainer.hasAttribute('data-payment-initialized')
                ) {
                    this.initPaymentOptions(paymentContainer);
                    paymentContainer.setAttribute(
                        'data-payment-initialized',
                        'true',
                    );
                }
            });
    },

    initPaymentOptions(paymentContainer: HTMLElement): void {
        const radioButtons =
            paymentContainer.querySelectorAll<HTMLInputElement>(
                'input[name="payment"]',
            );

        radioButtons.forEach((radio) => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    // TODO: обновить способ оплаты в store
                    const paymentMethod = radio.value;
                    console.log('Selected payment method:', paymentMethod);
                }
            });
        });
    },
};
