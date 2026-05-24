import template from '@modules/reviews/components/review-delete-modal/review-delete-modal.hbs';
import '@modules/common/components/modal/modal.scss';
import '@modules/reviews/components/review-delete-modal/review-delete-modal.scss';
import { reviewsActions } from '@modules/reviews/actions';

function ensureContainer(): HTMLElement {
    let root = document.getElementById('modal-root');
    if (!root) {
        root = document.createElement('div');
        root.id = 'modal-root';
        document.getElementById('app')?.appendChild(root);
    }
    return root;
}

export const ReviewDeleteModal = {
    _pendingId: null as number | null,
    _boundElement: null as HTMLElement | null,
    _isDeleting: false,

    getTemplate() {
        return template;
    },

    ensureMounted(): HTMLElement | null {
        let modal = document.getElementById('reviewDeleteModal');
        if (!modal) {
            const container = ensureContainer();
            container.insertAdjacentHTML('beforeend', template({}));
            modal = document.getElementById('reviewDeleteModal');
        }
        if (modal && this._boundElement !== modal) {
            this._boundElement = modal;
            this.bindEvents(modal);
        }
        return modal;
    },

    bindEvents(modal: HTMLElement): void {
        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            if (target === modal || target.closest('[data-action="cancel-delete-review"]')) {
                this.close();
                return;
            }

            if (target.closest('[data-action="confirm-delete-review"]')) {
                void this.handleConfirm();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display !== 'none') {
                this.close();
            }
        });
    },

    open(reviewId: number, previewText: string = ''): void {
        const modal = this.ensureMounted();
        if (!modal) return;
        this._pendingId = reviewId;

        const previewEl = document.getElementById('reviewDeleteModalPreview');
        if (previewEl) {
            const trimmed = previewText.trim();
            previewEl.textContent = trimmed.length > 200 ? `${trimmed.slice(0, 200)}…` : trimmed;
        }

        modal.style.display = 'flex';
    },

    close(): void {
        const modal = document.getElementById('reviewDeleteModal');
        if (modal) modal.style.display = 'none';
        this._pendingId = null;
    },

    async handleConfirm(): Promise<void> {
        if (this._pendingId === null || this._isDeleting) return;
        const id = this._pendingId;
        const confirmBtn = document.querySelector<HTMLButtonElement>(
            '[data-action="confirm-delete-review"]',
        );
        this._isDeleting = true;
        if (confirmBtn) confirmBtn.disabled = true;

        try {
            await reviewsActions.deleteReview(id);
        } finally {
            this._isDeleting = false;
            if (confirmBtn) confirmBtn.disabled = false;
            this.close();
        }
    },
};
