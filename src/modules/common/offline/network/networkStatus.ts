import { EventBus } from '@/core/eventBus';

const PING_INTERVAL = 5000;
const ONLINE_GRACE_MS = 3000;

class NetworkStatus {
    private _isOnline: boolean;
    private eventBus: EventBus;
    private pingTimer: ReturnType<typeof setInterval> | null = null;
    private _graceUntil: number = 0;

    constructor() {
        this._isOnline = navigator.onLine;
        this.eventBus = new EventBus();

        window.addEventListener('online', () => this.setOnline());
        window.addEventListener('offline', () => {
            this._graceUntil = 0;
            this._isOnline = false;
            this.eventBus.emit('change', false);
            this.startPing();
        });
    }

    get isOnline(): boolean {
        return this._isOnline;
    }

    setOffline(): void {
        if (!this._isOnline) return;
        // Не сбрасываем статус сразу после восстановления —
        // даём время синк-запросам завершиться
        if (Date.now() < this._graceUntil) return;
        this._isOnline = false;
        this.eventBus.emit('change', false);
        this.startPing();
    }

    setOnline(): void {
        if (this._isOnline) return;
        this._isOnline = true;
        this._graceUntil = Date.now() + ONLINE_GRACE_MS;
        this.stopPing();
        this.eventBus.emit('change', true);
    }

    subscribe(callback: (isOnline: boolean) => void): () => void {
        return this.eventBus.on('change', callback);
    }

    private startPing(): void {
        if (this.pingTimer) return;

        this.pingTimer = setInterval(async () => {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 3000);
                const response = await fetch('/api/v1/categories', {
                    method: 'GET',
                    signal: controller.signal,
                    cache: 'no-store',
                });
                clearTimeout(timeout);
                if (response.ok) {
                    this.setOnline();
                }
            } catch {
                // still offline
            }
        }, PING_INTERVAL);
    }

    private stopPing(): void {
        if (this.pingTimer) {
            clearInterval(this.pingTimer);
            this.pingTimer = null;
        }
    }
}

export const networkStatus = new NetworkStatus();
