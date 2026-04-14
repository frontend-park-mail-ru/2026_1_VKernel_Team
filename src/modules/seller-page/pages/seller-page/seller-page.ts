import '@modules/seller-page/pages/seller-page/seller-page.css';
import template from '@modules/seller-page/pages/seller-page/seller-page.hbs?raw';
import { HeaderComponent } from '@modules/common/components/header/header';
import { SearchSectionComponent } from '@modules/common/components/search-section/search-section';
import { SellerInfoCardComponent } from '@modules/seller-page/components/seller-info-card/seller-info-card';
import { SellerAdCardComponent } from '@modules/seller-page/components/seller-ad-card/seller-ad-card';
import { SellerTabsComponent } from '@modules/seller-page/components/seller-tabs/seller-tabs';
import type { HandlebarsTemplateFunction } from '@/types';

declare const Handlebars: any;

let compiledTemplate: HandlebarsTemplateFunction | null = null;

export function loadTemplates(): void {
    try {
        compiledTemplate = Handlebars.compile(template);

        Handlebars.registerPartial('header', HeaderComponent.getTemplate());
        Handlebars.registerPartial('search-section', SearchSectionComponent.getTemplate());

        Handlebars.registerPartial('seller-info-card', SellerInfoCardComponent.getTemplate());
        Handlebars.registerPartial('seller-ad-card', SellerAdCardComponent.getTemplate());
        Handlebars.registerPartial('seller-tabs', SellerTabsComponent.getTemplate());
    } catch (error) {
        console.error('Failed to load seller-page templates:', error);
    }
}

export function getTemplate(): HandlebarsTemplateFunction | null {
    return compiledTemplate;
}
