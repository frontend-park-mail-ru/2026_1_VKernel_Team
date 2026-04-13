import { syncManager } from '@modules/common/offline/sync/syncManager';
import { cartService } from '@modules/cart/service';
import { cartActions } from '@modules/cart/actions';
import type { SyncOperation } from '@modules/common/offline/sync/syncQueue';

async function handleCartOperation(
    op: SyncOperation,
): Promise<'success' | 'conflict' | 'network_error'> {
    try {
        let result;

        if (op.type === 'ADD_TO_CART') {
            result = await cartService.addToCart(op.payload.product_id as number);
        } else if (op.type === 'REMOVE_FROM_CART') {
            result = await cartService.removeFromCart(op.payload.product_id as number);
        } else {
            return 'conflict';
        }

        if (result.success) {
            await cartActions.loadCart();
            return 'success';
        }
        if (result.status === 0) return 'network_error';
        return 'conflict';
    } catch {
        return 'network_error';
    }
}

export function registerCartSyncHandlers(): void {
    syncManager.registerHandler('ADD_TO_CART', handleCartOperation);
    syncManager.registerHandler('REMOVE_FROM_CART', handleCartOperation);
}
