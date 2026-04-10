# Cart module architecture

## Компонентная модель

`src/modules/cart` — это модуль корзины. Внутри него есть:

- `controller.ts` — top-level cart component controller.
  - отвечает за загрузку данных, рендер страницы корзины и привязку событий.
- `styles.css` — стили компонента корзины (только layout и общие стили).
- `templates/cart.hbs` — основной шаблон cart-компонента.
- `components/` — папка с подкомпонентами:
  - `cart-back/` — компонент кнопки "назад"
    - `cart-back.hbs` — шаблон
    - `cart-back.ts` — js-обертка (импортирует css, возвращает hbs)
    - `styles.css` — стили компонента
  - `cart-item/` — компонент товара в корзине
    - `cart-item.hbs` — шаблон
    - `cart-item.ts` — js-обертка
    - `styles.css` — стили компонента
  - `cart-seller-group/` — компонент группы товаров по продавцу
    - `cart-seller-group.hbs` — шаблон
    - `cart-seller-group.ts` — js-обертка
    - `styles.css` — стили компонента
  - `cart-button/` — компонент кнопки добавления в корзину
    - `cart-button.hbs` — шаблон
    - `cart-button.ts` — js с логикой
    - `styles.css` — стили компонента
  - `cart-contacts-form/` — компонент формы контактов (пока отключен)
    - `cart-contacts-form.hbs` — шаблон
    - `cart-contacts-form.ts` — js-обертка
    - `styles.css` — стили компонента
  - `cart-delivery-tabs/` — компонент табов способа доставки (пока отключен)
    - `cart-delivery-tabs.hbs` — шаблон
    - `cart-delivery-tabs.ts` — js с логикой переключения
    - `styles.css` — стили компонента
  - `cart-order-summary/` — компонент блока заказа
    - `cart-order-summary.hbs` — шаблон
    - `cart-order-summary.ts` — js с логикой оформления
    - `styles.css` — стили компонента
  - `cart-payment-options/` — компонент способов оплаты (пока отключен)
    - `cart-payment-options.hbs` — шаблон
    - `cart-payment-options.ts` — js с логикой выбора
    - `styles.css` — стили компонента
- `cartButton.ts` — устаревший файл, заменен на `components/cart-button/cart-button.ts`

## Разграничение

- `CartController` = компонент страницы корзины.
- `templates/cart/cart.hbs` = шаблон этого компонента.
- `components/*/` = полноценные компоненты с hbs + ts + css.
- `AppController` загружает cart-компонент и регистрирует его partial'ы через Handlebars.

## Что важно

- Каждый компонент имеет свою папку с `*.hbs`, `*.ts`, `styles.css`.
- Компоненты без логики имеют "тупую" ts-обертку, которая просто импортирует css и возвращает hbs.
- Компоненты с логикой (cart-button, cart-delivery-tabs, cart-order-summary, cart-payment-options) имеют полноценный js с методами.
- Стили компонентов копируются webpack'ом в `css/cart/[name].css`.
- Некоторые компоненты (contacts-form, delivery-tabs, payment-options) пока отключены в шаблоне cart.hbs, но готовы к использованию.
- Такая модель позволяет изолировать стили и логику каждого компонента.
