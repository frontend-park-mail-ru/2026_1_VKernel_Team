import '@modules/cart/components/cart-contacts-form/styles.css';
import template from '@modules/cart/components/cart-contacts-form/cart-contacts-form.hbs?raw';

export const CartContactsFormComponent = {
    getTemplate(): string {
        return template;
    },

    initAll(): void {
        // Инициализация формы контактов
        // TODO: добавить валидацию и обработку данных
    },
};
