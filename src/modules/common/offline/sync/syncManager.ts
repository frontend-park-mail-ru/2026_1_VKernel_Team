import {
    syncQueue,
    SyncOperation,
    SyncOperationType,
} from '@modules/common/offline/sync/syncQueue';
import { networkStatus } from '@modules/common/offline/network/networkStatus';
import { NotificationComponent } from '@modules/common/notifications/notification';

const MAX_RETRIES = 3;

export type SyncHandler = (op: SyncOperation) => Promise<'success' | 'conflict' | 'network_error'>;

class SyncManager {
    private isSyncing = false;
    private handlers = new Map<SyncOperationType, SyncHandler>();

    registerHandler(type: SyncOperationType, handler: SyncHandler): void {
        this.handlers.set(type, handler);
    }

    init(): void {
        networkStatus.subscribe((isOnline) => {
            if (isOnline) {
                this.sync();
            }
        });

        // Синхронизируем накопленные операции при старте, если онлайн
        if (networkStatus.isOnline) {
            this.sync();
        }
    }

    async sync(): Promise<void> {
        if (this.isSyncing || !networkStatus.isOnline) return;
        this.isSyncing = true;

        try {
            const operations = await syncQueue.getAll();
            if (operations.length === 0) return;

            let hasConflicts = false;

            for (const op of operations) {
                if (!networkStatus.isOnline) break;

                const handler = this.handlers.get(op.type);
                if (!handler) {
                    await syncQueue.remove(op.id!);
                    hasConflicts = true;
                    continue;
                }

                const result = await handler(op);

                if (result === 'success' || result === 'conflict') {
                    await syncQueue.remove(op.id!);
                    if (result === 'conflict') hasConflicts = true;
                } else if (result === 'network_error') {
                    if (op.retries + 1 >= MAX_RETRIES) {
                        await syncQueue.remove(op.id!);
                        hasConflicts = true;
                    } else {
                        await syncQueue.updateRetries(op.id!, op.retries + 1);
                    }
                    break;
                }
            }

            if (hasConflicts) {
                NotificationComponent.show({
                    type: 'warning',
                    message: 'Некоторые изменения не удалось применить.',
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            this.isSyncing = false;
        }
    }
}

export const syncManager = new SyncManager();
