import template from '@modules/profile/components/close-ad-modal/close-ad-modal.hbs?raw';
import '@modules/common/components/modal/modal.css';
import '@modules/profile/components/close-ad-modal/style.css';
import { adsService } from '@/services/adsServices';
import { uiActions } from '@/actions/uiActions';
import { eventBus } from '@/core/eventBus';

declare const Handlebars: any;

export const CloseAdModal = {
    _pendingAdId: null as number | string | null,
    _boundElement: null as HTMLElement | null,

    getTemplate() {
        return Handlebars.compile(template);
    },

    init(): void {
        const modal = document.getElementById('closeAdModal');
        if (!modal || modal === this._boundElement) return;
        this._boundElement = modal;

        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            if (target === modal || target.closest('[data-action="cancel-close-ad"]')) {
                this.close();
                return;
            }

            if (target.closest('[data-action="confirm-close-ad"]')) {
                this.handleConfirm();
            }
        });
    },

    open(adId: number | string, adTitle: string): void {
        this._pendingAdId = adId;
        const modal = document.getElementById('closeAdModal');
        if (!modal) return;

        const titleEl = document.getElementById('closeAdTitle');
        if (titleEl) titleEl.textContent = `"${adTitle}"`;

        modal.style.display = 'flex';
    },

    close(): void {
        const modal = document.getElementById('closeAdModal');
        if (modal) modal.style.display = 'none';
        this._pendingAdId = null;
    },

    async handleConfirm(): Promise<void> {
        if (!this._pendingAdId) return;
        const adId = this._pendingAdId;

        uiActions.showLoading(true);
        try {
            const res = await adsService.closeAd(adId);
            if (res.success) {
                uiActions.showSuccess('Объявление закрыто');
                this.close();
                eventBus.emit('profile:ad-closed', adId);
            } else {
                uiActions.showError(res.error || 'Ошибка при закрытии объявления');
            }
        } catch {
            uiActions.showError('Ошибка при закрытии объявления');
        } finally {
            uiActions.showLoading(false);
        }
    },
};
