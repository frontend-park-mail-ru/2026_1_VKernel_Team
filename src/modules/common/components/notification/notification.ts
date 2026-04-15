import './notification.css';

export type NotificationType = 'error' | 'success' | 'warning' | 'info';

const ICONS: Record<NotificationType, string> = {
    error: '✕',
    success: '✓',
    warning: '!',
    info: 'i',
};

const TITLES: Record<NotificationType, string> = {
    error: 'Ошибка',
    success: 'Успешно',
    warning: 'Внимание',
    info: 'Информация',
};

const MAX_VISIBLE = 5;
const DEFAULT_DURATION = 4000;

class NotificationManager {
    private container: HTMLElement | null = null;

    private getContainer(): HTMLElement {
        if (!this.container || !document.body.contains(this.container)) {
            const existing = document.getElementById('notification-container');
            if (existing) {
                this.container = existing;
                return this.container;
            }
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            document.body.appendChild(this.container);
        }
        return this.container;
    }

    show(message: string, type: NotificationType, duration = DEFAULT_DURATION): void {
        const container = this.getContainer();

        // Убираем самое старое уведомление, если их слишком много
        const existing = container.querySelectorAll('.notification');
        if (existing.length >= MAX_VISIBLE) {
            this.dismiss(existing[0] as HTMLElement);
        }

        const el = document.createElement('div');
        el.className = `notification notification-${type}`;
        el.setAttribute('role', 'alert');
        el.setAttribute('aria-live', 'polite');

        el.innerHTML = `
            <div class="notification-icon">${ICONS[type]}</div>
            <div class="notification-body">
                <div class="notification-title">${TITLES[type]}</div>
                <div class="notification-message"></div>
            </div>
            <button class="notification-close" aria-label="Закрыть">×</button>
            <div class="notification-progress" style="animation-duration:${duration}ms"></div>
        `;

        // Устанавливаем текст безопасно (без XSS)
        (el.querySelector('.notification-message') as HTMLElement).textContent = message;

        const timer = setTimeout(() => this.dismiss(el), duration);

        el.querySelector('.notification-close')!.addEventListener('click', () => {
            clearTimeout(timer);
            this.dismiss(el);
        });

        container.appendChild(el);
    }

    private dismiss(el: HTMLElement): void {
        if (!el.isConnected) return;
        el.classList.add('notification-exit');
        el.addEventListener('animationend', () => el.remove(), { once: true });
    }

    error(message: string, duration?: number): void {
        this.show(message, 'error', duration);
    }

    success(message: string, duration?: number): void {
        this.show(message, 'success', duration);
    }

    warning(message: string, duration?: number): void {
        this.show(message, 'warning', duration);
    }

    info(message: string, duration?: number): void {
        this.show(message, 'info', duration);
    }
}

export const notifications = new NotificationManager();
