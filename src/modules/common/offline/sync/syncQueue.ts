import { cloverDB } from '@modules/common/offline/db/indexedDB';

export interface SyncOperation {
    id?: number;
    type: 'ADD_TO_CART' | 'REMOVE_FROM_CART';
    payload: { product_id: number };
    timestamp: number;
    retries: number;
}

const STORE_NAME = 'syncQueue';

export const syncQueue = {
    async add(operation: Omit<SyncOperation, 'id' | 'retries'>): Promise<void> {
        await cloverDB.put<SyncOperation>(STORE_NAME, {
            ...operation,
            retries: 0,
        } as SyncOperation);
    },

    async getAll(): Promise<SyncOperation[]> {
        const ops = await cloverDB.getAll<SyncOperation>(STORE_NAME);
        return ops.sort((a, b) => a.timestamp - b.timestamp);
    },

    async remove(id: number): Promise<void> {
        await cloverDB.delete(STORE_NAME, id);
    },

    async updateRetries(id: number, retries: number): Promise<void> {
        const op = await cloverDB.get<SyncOperation>(STORE_NAME, id);
        if (op) {
            op.retries = retries;
            await cloverDB.put(STORE_NAME, op);
        }
    },

    async clear(): Promise<void> {
        await cloverDB.clear(STORE_NAME);
    },
};
