import '@modules/common/notifications/notification.css';

export interface NotificationOptions {
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    duration?: number;
}

let counter = 0;

function ensureContainer(): HTMLElement {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }
    return container;
}

export const NotificationComponent = {
    show(options: NotificationOptions): string {
        const { type, message, duration = 4000 } = options;
        const id = `notification-${++counter}`;
        const container = ensureContainer();

        const el = document.createElement('div');
        el.id = id;
        el.className = `notification notification--${type}`;

        const messageSpan = document.createElement('span');
        messageSpan.className = 'notification__message';
        messageSpan.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification__close';
        closeBtn.setAttribute('aria-label', 'Закрыть');
        closeBtn.textContent = '\u00D7';
        closeBtn.addEventListener('click', () => NotificationComponent.hide(id));

        el.appendChild(messageSpan);
        el.appendChild(closeBtn);

        container.prepend(el);

        requestAnimationFrame(() => {
            el.classList.add('notification--visible');
        });

        if (duration > 0) {
            setTimeout(() => NotificationComponent.hide(id), duration);
        }

        return id;
    },

    hide(id: string): void {
        const el = document.getElementById(id);
        if (!el) return;

        el.classList.remove('notification--visible');
        el.classList.add('notification--hiding');

        el.addEventListener('transitionend', () => el.remove(), { once: true });
        setTimeout(() => el.remove(), 400);
    },
};
