import '@modules/common/components/modal/modal.scss';

export interface BaseModalOptions {
    id: string;
}

export function createBaseModal(options: BaseModalOptions) {
    const { id } = options;
    let _bound = false;

    function getElement(): HTMLElement | null {
        return document.getElementById(id);
    }

    function open(): void {
        const el = getElement();
        if (el) el.style.display = 'flex';
    }

    function close(): void {
        const el = getElement();
        if (el) el.style.display = 'none';
    }

    function isOpen(): boolean {
        const el = getElement();
        return el !== null && el.style.display !== 'none';
    }

    function bindBaseEvents(closeCallback?: () => void): void {
        const el = getElement();
        if (!el || _bound) return;
        _bound = true;

        el.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('[data-action="close-modal"]')) {
                if (closeCallback) closeCallback();
                else close();
                return;
            }
            if (e.target === el) {
                if (closeCallback) closeCallback();
                else close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen()) {
                if (closeCallback) closeCallback();
                else close();
            }
        });
    }

    function resetBound(): void {
        _bound = false;
    }

    return {
        getElement,
        open,
        close,
        isOpen,
        bindBaseEvents,
        resetBound,
        get id() {
            return id;
        },
    };
}
