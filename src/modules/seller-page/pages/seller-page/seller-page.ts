import '@modules/seller-page/pages/seller-page/seller-page.css';
import template from '@modules/seller-page/pages/seller-page/seller-page.hbs?raw';
import { SearchSectionComponent } from '@modules/common/components/search-section/search-section';
import { SellerInfoCardComponent } from '@modules/seller-page/components/seller-info-card/seller-info-card';
import { AdCardComponent } from '@modules/common/components/ad-card/ad-card';
import { CartButtonComponent } from '@modules/cart/components/cart-button/cart-button';
import { SellerTabsComponent } from '@modules/seller-page/components/seller-tabs/seller-tabs';
import type { HandlebarsTemplateFunction } from '@/types';

declare const Handlebars: any;

let compiledTemplate: HandlebarsTemplateFunction | null = null;

export function loadTemplates(): void {
    try {
        compiledTemplate = Handlebars.compile(template);

        Handlebars.registerPartial('search-section', SearchSectionComponent.getTemplate());

        Handlebars.registerPartial('seller-info-card', SellerInfoCardComponent.getTemplate());
        Handlebars.registerPartial('ad-card', AdCardComponent.getTemplate());
        Handlebars.registerPartial(
            'cart/components/cart-button/cart-button',
            CartButtonComponent.getTemplate(),
        );
        Handlebars.registerPartial('seller-tabs', SellerTabsComponent.getTemplate());
    } catch (error) {
        console.error('Failed to load seller-page templates:', error);
    }
}

export function getTemplate(): HandlebarsTemplateFunction | null {
    return compiledTemplate;
}
