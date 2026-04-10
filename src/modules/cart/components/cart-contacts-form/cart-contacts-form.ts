import '@modules/cart/components/cart-contacts-form/styles.css';

export const CartContactsFormComponent = {
    getTemplate(): string {
        return `
<!-- Форма контактов -->
<div class="cart-section cart-contacts">
    <div class="cart-form-group">
        <label class="cart-form-label">ФИО</label>
        <input type="text" class="cart-form-input" placeholder="Иванов Иван Иванович">
    </div>
    <div class="cart-form-group">
        <label class="cart-form-label">Телефон</label>
        <input type="tel" class="cart-form-input" placeholder="+7-__-__-__-__">
    </div>
    <div class="cart-form-group">
        <label class="cart-form-label">Почта</label>
        <input type="email" class="cart-form-input" placeholder="Ivanov@mail.ru">
    </div>
</div>
        `.trim();
    },

    initAll(): void {
        // Инициализация формы контактов
        // TODO: добавить валидацию и обработку данных
    },
};
