import '@modules/profile/components/profile-sidebar/style.css';
import template from '@modules/profile/components/profile-sidebar/profile-sidebar.hbs?raw';
import { eventBus } from '@/core/eventBus'; // Импортируем шину событий

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
                // Вместо ProfileController.switchTab кидаем событие
                eventBus.emit('profile:switch-tab', tab);
            }

            if (target.closest('[data-action="logout"]')) {
                // Вместо ProfileController.handleLogout кидаем событие
                eventBus.emit('profile:logout');
            }
        });
    }
};
