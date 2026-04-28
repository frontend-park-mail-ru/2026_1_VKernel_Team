import '@modules/chat/pages/chat-detail/chat-detail.css';
import template from '@modules/chat/pages/chat-detail/chat-detail.hbs?raw';
import { SearchSectionComponent } from '@modules/common/components/search-section/search-section';
import { ChatMessageComponent } from '@modules/chat/components/chat-message/chat-message';
import type { HandlebarsTemplateFunction } from '@/types';

declare const Handlebars: any;

let compiledTemplate: HandlebarsTemplateFunction | null = null;

export function loadTemplates(): void {
    try {
        compiledTemplate = Handlebars.compile(template);
        Handlebars.registerPartial('search-section', SearchSectionComponent.getTemplate());
        Handlebars.registerPartial('chat-message', ChatMessageComponent.getTemplate());
    } catch (error) {
        console.error('Failed to load chat-detail templates:', error);
    }
}

export function getTemplate(): HandlebarsTemplateFunction | null {
    return compiledTemplate;
}
