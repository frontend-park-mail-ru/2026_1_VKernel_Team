import '@modules/profile/components/profile-content/style.css';
import template from './profile-content.hbs?raw';
import { EditNameModal } from '../edit-name-modal/edit-name-modal';

declare const Handlebars: any;

export const ProfileContent = {
    getTemplate() {
        return Handlebars.compile(template);
    },

    init(): void {
        const content = document.querySelector('.profile-tab-content');
        if (!content) return;

        content.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            // Просто открываем модалку через её собственный метод
            if (target.closest('[data-action="open-edit-name"]')) {
                EditNameModal.open();
            }
        });
    }
};
