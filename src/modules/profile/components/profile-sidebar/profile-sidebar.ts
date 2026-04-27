import '@modules/profile/components/profile-sidebar/style.scss';
import template from '@modules/profile/components/profile-sidebar/profile-sidebar.hbs';
import { eventBus } from '@/core/eventBus';
import { EditNameModal } from '@modules/profile/components/edit-name-modal/edit-name-modal';

export const ProfileSidebar = {
    _boundElement: null as HTMLElement | null,

    getTemplate() {
        return template;
    },

    init(): void {
        const sidebar = document.querySelector('#sidebarContainer') as HTMLElement | null;
        if (!sidebar || sidebar === this._boundElement) return;
        this._boundElement = sidebar;

        sidebar.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            const tabBtn = target.closest('.profile-nav-item[data-tab]');
            if (tabBtn) {
                const tab = (tabBtn as HTMLElement).dataset.tab;
                if (tab === 'messages') {
                    window.dispatchEvent(
                        new CustomEvent('app:navigate', { detail: { path: '/chats' } }),
                    );
                    return;
                }
                eventBus.emit('profile:switch-tab', tab);
                return;
            }

            if (target.closest('[data-action="open-edit-name"]')) {
                EditNameModal.open();
                return;
            }

            if (target.closest('[data-action="logout"]')) {
                e.stopPropagation();
                eventBus.emit('profile:logout');
            }
        });
    },
};
