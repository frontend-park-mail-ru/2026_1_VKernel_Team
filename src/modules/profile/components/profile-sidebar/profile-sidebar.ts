import '@modules/profile/components/profile-sidebar/style.scss';
import template from '@modules/profile/components/profile-sidebar/profile-sidebar.hbs';
import { eventBus } from '@/core/eventBus';
import { EditNameModal } from '@modules/profile/components/edit-name-modal/edit-name-modal';

function setNavOpen(root: HTMLElement, open: boolean): void {
    const nav = root.querySelector('.profile-nav') as HTMLElement | null;
    const overlay = root.querySelector('.profile-nav-overlay') as HTMLElement | null;
    if (!nav || !overlay) return;
    nav.classList.toggle('is-open', open);
    overlay.classList.toggle('is-open', open);
    document.body.classList.toggle('profile-nav-locked', open);
}

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

            if (target.closest('[data-action="toggle-profile-nav"]')) {
                e.stopPropagation();
                const nav = sidebar.querySelector('.profile-nav');
                setNavOpen(sidebar, !nav?.classList.contains('is-open'));
                return;
            }

            if (target.closest('[data-action="close-profile-nav"]')) {
                e.stopPropagation();
                setNavOpen(sidebar, false);
                return;
            }

            const tabBtn = target.closest('.profile-nav-item[data-tab]');
            if (tabBtn) {
                const tab = (tabBtn as HTMLElement).dataset.tab;
                setNavOpen(sidebar, false);
                if (tab === 'messages') {
                    window.dispatchEvent(
                        new CustomEvent('app:navigate', { detail: { path: '/chats' } }),
                    );
                    return;
                }
                if (tab === 'cart') {
                    window.dispatchEvent(
                        new CustomEvent('app:navigate', { detail: { path: '/cart' } }),
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
                setNavOpen(sidebar, false);
                eventBus.emit('profile:logout');
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setNavOpen(sidebar, false);
        });
    },
};
