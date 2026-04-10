import './styles.css';

export const CartDeliveryTabsComponent = {
    getTemplate(): string {
        return `
<!-- Способ получения -->
<div class="cart-section">
    <h2 class="cart-section-title">Способ получения</h2>
    <div class="cart-delivery-tabs">
        <button class="cart-delivery-tab active" data-delivery="pickup">
            <span class="cart-tab-check">✓</span> Самовывоз
        </button>
        <button class="cart-delivery-tab" data-delivery="point">
            Доставка в пункт выдачи
        </button>
        <button class="cart-delivery-tab" data-delivery="courier">
            Курьерская доставка
        </button>
    </div>
</div>
        `.trim();
    },

    initAll(): void {
        document
            .querySelectorAll<HTMLElement>('.cart-delivery-tabs')
            .forEach((tabsContainer) => {
                if (!tabsContainer.hasAttribute('data-delivery-initialized')) {
                    this.initTabs(tabsContainer);
                    tabsContainer.setAttribute(
                        'data-delivery-initialized',
                        'true',
                    );
                }
            });
    },

    initTabs(tabsContainer: HTMLElement): void {
        const tabs =
            tabsContainer.querySelectorAll<HTMLElement>('.cart-delivery-tab');

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
