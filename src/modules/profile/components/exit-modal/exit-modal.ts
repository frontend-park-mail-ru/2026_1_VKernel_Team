import template from '@modules/profile/components/exit-modal/exit-modal.hbs';
import '@modules/common/components/modal/modal.scss';
import '@modules/profile/components/exit-modal/style.scss';

export class ExitModal {
    private container: HTMLElement | null = null;
    private onConfirm: () => void;
    constructor(onConfirm: () => void) {
        this.onConfirm = onConfirm;
    }

    public render() {
        if (document.querySelector('.js-exit-modal-overlay')) {
            return;
        }
        const wrapper = document.createElement('div');
        wrapper.innerHTML = template({});
        this.container = wrapper.firstElementChild as HTMLElement;
        document.body.appendChild(this.container);
        this.bindEvents();
        requestAnimationFrame(() => {
            this.container?.classList.add('is-open');
        });
    }

    private bindEvents() {
        if (!this.container) return;

        const overlay = this.container;
        const closeBtn = this.container.querySelector('.js-exit-modal-close');
        const cancelBtn = this.container.querySelector('.js-exit-modal-cancel');
        const confirmBtn = this.container.querySelector('.js-exit-modal-confirm');
        const handleClose = (e: Event) => {
            if (e.target === overlay || e.target === closeBtn || e.target === cancelBtn) {
                this.close();
            }
        };

        overlay.addEventListener('click', handleClose);
        closeBtn?.addEventListener('click', handleClose);
        cancelBtn?.addEventListener('click', handleClose);
        confirmBtn?.addEventListener('click', () => {
            this.onConfirm();
            this.close();
        });
    }

    public close() {
        if (!this.container) return;
        this.container.classList.remove('is-open');
        setTimeout(() => {
            this.container?.remove();
            this.container = null;
        }, 250);
    }
}
