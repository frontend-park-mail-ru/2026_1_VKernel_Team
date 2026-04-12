import '@modules/cart/components/cart-delivery-tabs/styles.css';
import template from '@modules/cart/components/cart-delivery-tabs/cart-delivery-tabs.hbs?raw';

export const CartDeliveryTabsComponent = {
    getTemplate(): string {
        return template;
    },

    initAll(): void {
        document.querySelectorAll<HTMLElement>('.cart-delivery-tabs').forEach((tabsContainer) => {
            if (!tabsContainer.hasAttribute('data-delivery-initialized')) {
                this.initTabs(tabsContainer);
                tabsContainer.setAttribute('data-delivery-initialized', 'true');
            }
        });
    },

    initTabs(tabsContainer: HTMLElement): void {
        const tabs = tabsContainer.querySelectorAll<HTMLElement>('.cart-delivery-tab');

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                // Убираем активный класс у всех табов
                tabs.forEach((t) => t.classList.remove('active'));

                // Добавляем активный класс к выбранному табу
                tab.classList.add('active');

                // TODO: обновить способ доставки в store
                const deliveryType = tab.dataset.delivery;
                console.log('Selected delivery type:', deliveryType);
            });
        });
    },
};
