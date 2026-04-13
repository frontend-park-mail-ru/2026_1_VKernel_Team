import { syncQueue, SyncOperation } from '@modules/common/offline/sync/syncQueue';
import { cartService } from '@modules/cart/service';
import { cartActions } from '@modules/cart/actions';
import { networkStatus } from '@modules/common/offline/network/networkStatus';
import { NotificationComponent } from '@modules/common/notifications/notification';

const MAX_RETRIES = 3;

class SyncManager {
    private isSyncing = false;

    init(): void {
        networkStatus.subscribe((isOnline) => {
            if (isOnline) {
                this.sync();
            }
        });
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

                const result = await this.executeOperation(op);

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

            if (networkStatus.isOnline) {
                await cartActions.loadCart();
            }

            if (hasConflicts) {
                NotificationComponent.show({
                    type: 'warning',
                    message: 'Некоторые изменения не удалось применить. Корзина обновлена.',
                    duration: 5000,
                });
            }
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    private async executeOperation(
        op: SyncOperation,
    ): Promise<'success' | 'conflict' | 'network_error'> {
        try {
            let result;

            switch (op.type) {
                case 'ADD_TO_CART':
                    result = await cartService.addToCart(op.payload.product_id);
                    break;
                case 'REMOVE_FROM_CART':
                    result = await cartService.removeFromCart(op.payload.product_id);
                    break;
                default:
                    return 'conflict';
            }

            if (result.success) return 'success';
            if (result.status === 0) return 'network_error';
            return 'conflict';
        } catch {
            return 'network_error';
        }
    }
}

export const syncManager = new SyncManager();
