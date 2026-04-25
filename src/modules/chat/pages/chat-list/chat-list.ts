import '@modules/chat/pages/chat-list/chat-list.css';
import template from '@modules/chat/pages/chat-list/chat-list.hbs?raw';
import { SearchSectionComponent } from '@modules/common/components/search-section/search-section';
import { ChatListItemComponent } from '@modules/chat/components/chat-list-item/chat-list-item';
import type { HandlebarsTemplateFunction } from '@/types';

declare const Handlebars: any;

let compiledTemplate: HandlebarsTemplateFunction | null = null;

export function loadTemplates(): void {
    try {
        compiledTemplate = Handlebars.compile(template);
        Handlebars.registerPartial('search-section', SearchSectionComponent.getTemplate());
        Handlebars.registerPartial('chat-list-item', ChatListItemComponent.getTemplate());
    } catch (error) {
        console.error('Failed to load chat-list templates:', error);
    }
}

export function getTemplate(): HandlebarsTemplateFunction | null {
    return compiledTemplate;
}
