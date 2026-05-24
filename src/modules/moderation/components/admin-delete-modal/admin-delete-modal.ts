import template from '@modules/moderation/components/admin-delete-modal/admin-delete-modal.hbs';
import '@modules/common/components/modal/modal.scss';
import '@modules/moderation/styles/moderation.scss';
import { moderationApi } from '@modules/moderation/api';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus';

type Resolver = (deleted: boolean) => void;

export const AdminDeleteModal = {
    _pendingAdId: null as number | string | null,
    _boundElement: null as HTMLElement | null,
    _resolver: null as Resolver | null,

    getTemplate() {
        return template;
    },

    ensureMounted(): void {
        if (document.getElementById('adminDeleteModal')) return;
        const container = document.createElement('div');
        container.innerHTML = template({});
        document.body.appendChild(container.firstElementChild as HTMLElement);
    },

    init(): void {
        this.ensureMounted();
        const modal = document.getElementById('adminDeleteModal');
        if (!modal || modal === this._boundElement) return;
        this._boundElement = modal;

        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target === modal || target.closest('[data-action="cancel-admin-delete"]')) {
                this.close(false);
                return;
            }
            if (target.closest('[data-action="confirm-admin-delete"]')) {
                this.handleConfirm();
            }
        });
    },

    open(adId: number | string, adTitle: string): Promise<boolean> {
        this.init();
        this._pendingAdId = adId;
        const modal = document.getElementById('adminDeleteModal');
        const titleEl = document.getElementById('adminDeleteTitle');
        if (titleEl) titleEl.textContent = adTitle ? `"${adTitle}"` : '';
        if (modal) modal.style.display = 'flex';

        return new Promise((resolve) => {
            this._resolver = resolve;
        });
    },

    close(deleted: boolean): void {
        const modal = document.getElementById('adminDeleteModal');
        if (modal) modal.style.display = 'none';
        const resolver = this._resolver;
        this._pendingAdId = null;
        this._resolver = null;
        if (resolver) resolver(deleted);
    },

    async handleConfirm(): Promise<void> {
        if (this._pendingAdId == null) return;
        const adId = this._pendingAdId;

        uiActions.showLoading(true);
        try {
            const res = await moderationApi.adminDelete(adId);
            if (res.success) {
                uiActions.showSuccess('Объявление удалено');
                eventBus.emit('moderation:ad-deleted', adId);
                this.close(true);
            } else {
                uiActions.showError(res.error || 'Не удалось удалить объявление');
            }
        } catch {
            uiActions.showError('Не удалось удалить объявление');
        } finally {
            uiActions.showLoading(false);
        }
    },
};
