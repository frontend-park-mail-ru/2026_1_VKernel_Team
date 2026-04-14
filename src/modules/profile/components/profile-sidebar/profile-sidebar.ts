import './style.css'; // Стили сайдбара
import template from './profile-sidebar.hbs?raw';
import { ProfileController } from '../../controller';

declare const Handlebars: any;

export const ProfileSidebar = {
    getTemplate() {
        return Handlebars.compile(template);
    },

    init(): void {
        const sidebar = document.querySelector('.profile-sidebar');
        if (!sidebar) return;

        sidebar.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const tabBtn = target.closest('.profile-nav-item[data-tab]');
            if (tabBtn) {
                const tab = (tabBtn as HTMLElement).dataset.tab;
                ProfileController.switchTab(tab as any);
            }
            if (target.closest('[data-action="logout"]')) {
                ProfileController.handleLogout();
            }
        });
    }
};
