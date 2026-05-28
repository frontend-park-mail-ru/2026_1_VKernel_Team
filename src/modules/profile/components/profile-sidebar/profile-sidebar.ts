import '@modules/profile/components/profile-sidebar/style.scss';
import template from '@modules/profile/components/profile-sidebar/profile-sidebar.hbs';
import { eventBus } from '@/core/eventBus';
import { EditNameModal } from '@modules/profile/components/edit-name-modal/edit-name-modal';

function setNavOpen(root: HTMLElement, open: boolean): void {
    const nav = root.querySelector('.profile-nav') as HTMLElement | null;
    const overlay = root.querySelector('.profile-nav-overlay') as HTMLElement | null;

    if (!nav) return;

    nav.classList.toggle('is-open', open);

    if (overlay) {
        overlay.classList.toggle('is-open', open);
    }

    document.body.classList.toggle('profile-nav-locked', open);
}

export const ProfileSidebar = {
    _boundElement: null as HTMLElement | null,
    _isGlobalBound: false,

    getTemplate() {
        return template;
    },

    init(): void {
        const sidebar = document.querySelector<HTMLElement>('#sidebarContainer');

        if (!sidebar || sidebar === this._boundElement) return;

        this._boundElement = sidebar;

        if (!this._isGlobalBound) {
            document.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const toggleBtn = target.closest('[data-action="toggle-profile-nav"]');

                if (toggleBtn) {
                    e.stopPropagation();
                    e.preventDefault();

                    const currentSidebar = document.querySelector<HTMLElement>('#sidebarContainer');
                    if (currentSidebar) {
                        const nav = currentSidebar.querySelector('.profile-nav');
                        setNavOpen(currentSidebar, !nav?.classList.contains('is-open'));
                    }
                }
            });

            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const currentSidebar = document.querySelector<HTMLElement>('#sidebarContainer');
                    if (currentSidebar) setNavOpen(currentSidebar, false);
                }
            });

            this._isGlobalBound = true;
        }

        sidebar.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

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
    },
};
