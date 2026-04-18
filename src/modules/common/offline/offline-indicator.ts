import { networkStatus } from '@modules/common/offline/network/networkStatus';
import { NotificationComponent } from '@modules/common/notifications/notification';

const INDICATOR_ID = 'offline-indicator';

let initialized = false;

function getOrCreateIndicator(): HTMLElement {
    let el = document.getElementById(INDICATOR_ID);
    if (!el) {
        el = document.createElement('div');
        el.id = INDICATOR_ID;
        el.style.cssText =
            'position:fixed;bottom:0;left:0;right:0;z-index:10001;' +
            'background:#424242;color:#fff;text-align:center;' +
            'padding:8px 16px;font-size:14px;' +
            'transition:transform 0.3s ease;transform:translateY(100%);';
        el.textContent = 'Нет подключения к интернету';
        document.body.appendChild(el);
    }
    return el;
}

function update(isOnline: boolean): void {
    const el = getOrCreateIndicator();
    el.style.transform = isOnline ? 'translateY(100%)' : 'translateY(0)';
}

export function initOfflineIndicator(): void {
    if (initialized) return;
    initialized = true;

    update(networkStatus.isOnline);

    networkStatus.subscribe((isOnline) => {
        update(isOnline);

        if (isOnline) {
            NotificationComponent.show({
                type: 'success',
                message: 'Подключение восстановлено',
                duration: 3000,
            });
        }
    });
}
