/**
 * Cart page component
 * Шаблон + стили + инициализация подкомпонентов.
 */

import '@modules/cart/pages/cart/cart.scss';
import template from '@modules/cart/pages/cart/cart.hbs?raw';
import { HeaderComponent } from '@modules/common/components/header/header';
import { SearchSectionComponent } from '@modules/common/components/search-section/search-section';
import { CartBackComponent } from '@modules/cart/components/cart-back/cart-back';
import { CartItemComponent } from '@modules/cart/components/cart-item/cart-item';
import { CartSellerGroupComponent } from '@modules/cart/components/cart-seller-group/cart-seller-group';
import { CartButtonComponent } from '@modules/cart/components/cart-button/cart-button';
import { CartOrderSummaryComponent } from '@modules/cart/components/cart-order-summary/cart-order-summary';
import { CartContactsFormComponent } from '@modules/cart/components/cart-contacts-form/cart-contacts-form';
import { CartDeliveryTabsComponent } from '@modules/cart/components/cart-delivery-tabs/cart-delivery-tabs';
import { CartPaymentOptionsComponent } from '@modules/cart/components/cart-payment-options/cart-payment-options';
import type { HandlebarsTemplateFunction } from '@/types';

declare const Handlebars: any;

let compiledTemplate: HandlebarsTemplateFunction | null = null;

export function loadTemplates(): void {
    try {
        compiledTemplate = Handlebars.compile(template);

        // Общие компоненты-partials
        Handlebars.registerPartial('header', HeaderComponent.getTemplate());
        Handlebars.registerPartial('search-section', SearchSectionComponent.getTemplate());

        // Компоненты корзины
        Handlebars.registerPartial('cart-back', CartBackComponent.getTemplate());
        Handlebars.registerPartial('cart-item', CartItemComponent.getTemplate());
        Handlebars.registerPartial('cart-seller-group', CartSellerGroupComponent.getTemplate());
        Handlebars.registerPartial('cart-button', CartButtonComponent.getTemplate());
        Handlebars.registerPartial('cart-order-summary', CartOrderSummaryComponent.getTemplate());
        Handlebars.registerPartial('cart-contacts-form', CartContactsFormComponent.getTemplate());
        Handlebars.registerPartial('cart-delivery-tabs', CartDeliveryTabsComponent.getTemplate());
        Handlebars.registerPartial(
            'cart-payment-options',
            CartPaymentOptionsComponent.getTemplate(),
        );
    } catch (error) {
        console.error('Failed to load cart templates:', error);
    }
}

export function getTemplate(): HandlebarsTemplateFunction | null {
    return compiledTemplate;
}
