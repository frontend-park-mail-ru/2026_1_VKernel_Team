import './profile.css';
import template from './profile.hbs?raw';
import { HeaderComponent } from '@modules/common/components/header/header';
import { SearchSectionComponent } from '@modules/common/components/search-section/search-section';
import { ProfileAvatar } from '@modules/profile/components/profile-avatar/profile-avatar';
import { ProfileSidebar } from '@modules/profile/components/profile-sidebar/profile-sidebar';
import { ProfileContent } from '@modules/profile/components/profile-content/profile-content';
import type { HandlebarsTemplateFunction } from '@/types';

declare const Handlebars: any;

let compiledTemplate: HandlebarsTemplateFunction | null = null;

/**
 * Загрузка шаблонов и регистрация всех подкомпонентов профиля
 */
export function loadTemplates(): void {
    try {
        compiledTemplate = Handlebars.compile(template);

        // Общие компоненты
        Handlebars.registerPartial('header', HeaderComponent.getTemplate());
        Handlebars.registerPartial('search-section', SearchSectionComponent.getTemplate());

        // Подкомпоненты профиля (регистрация как partials)
        Handlebars.registerPartial('profile-avatar', ProfileAvatar.getTemplate());
        Handlebars.registerPartial('profile-sidebar', ProfileSidebar.getTemplate());
        Handlebars.registerPartial('profile-content', ProfileContent.getTemplate());
        
    } catch (error) {
        console.error('Failed to load profile templates:', error);
    }
}

export function getTemplate(): HandlebarsTemplateFunction | null {
    return compiledTemplate;
}
