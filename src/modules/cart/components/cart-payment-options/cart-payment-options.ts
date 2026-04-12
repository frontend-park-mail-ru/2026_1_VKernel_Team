import '@modules/cart/components/cart-payment-options/styles.css';
import template from '@modules/cart/components/cart-payment-options/cart-payment-options.hbs?raw';

export const CartPaymentOptionsComponent = {
    getTemplate(): string {
        return template;
    },

    initAll(): void {
        document.querySelectorAll<HTMLElement>('.cart-payment').forEach((paymentContainer) => {
            if (!paymentContainer.hasAttribute('data-payment-initialized')) {
                this.initPaymentOptions(paymentContainer);
                paymentContainer.setAttribute('data-payment-initialized', 'true');
            }
        });
    },

    initPaymentOptions(paymentContainer: HTMLElement): void {
        const radioButtons =
            paymentContainer.querySelectorAll<HTMLInputElement>('input[name="payment"]');

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
