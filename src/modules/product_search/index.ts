// src/modules/product_search/index.ts
import './css/product_search.scss';

import template from './templates/product_search.hbs?raw';
import { HeaderComponent } from '@modules/common/components/header/header';
import { SearchSectionComponent } from '@modules/common/components/search-section/search-section';
import { AdCardComponent } from '@modules/common/components/ad-card/ad-card';
import { CartButtonComponent } from '@modules/cart/components/cart-button/cart-button';
import type { HandlebarsTemplateFunction } from '@/types';


declare const Handlebars: any;

let compiledTemplate: HandlebarsTemplateFunction | null = null;

export function loadTemplates(): void {
    try {
        compiledTemplate = Handlebars.compile(template);
        
        Handlebars.registerPartial('header', HeaderComponent.getTemplate());
        Handlebars.registerPartial('search-section', SearchSectionComponent.getTemplate());
        Handlebars.registerPartial('ad-card', AdCardComponent.getTemplate());
        Handlebars.registerPartial('cart-button', CartButtonComponent.getTemplate());
        Handlebars.registerPartial('common/components/ad-card/ad-card', AdCardComponent.getTemplate());
    } catch (error) {
        console.error('Failed to load product_search templates:', error);
    }
}

export function getTemplate(): HandlebarsTemplateFunction | null {
    return compiledTemplate;
}

export { ProductSearchController } from './controller';
export { productSearchService } from './service';
export { productSearchStore } from './store';
export type { SearchFilters, SortOrder, SearchState, PriceRange } from './types';
