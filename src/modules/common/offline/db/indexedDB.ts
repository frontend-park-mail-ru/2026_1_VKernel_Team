export interface StoreSchema {
    name: string;
    keyPath?: string;
    autoIncrement?: boolean;
    recreate?: boolean;
    indexes?: { name: string; keyPath: string; unique?: boolean }[];
}

class CloverDB {
    private db: IDBDatabase | null = null;

    open(dbName: string, version: number, stores: StoreSchema[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                for (const schema of stores) {
                    if (db.objectStoreNames.contains(schema.name)) {
                        if (schema.recreate) {
                            db.deleteObjectStore(schema.name);
                        } else {
                            continue;
                        }
                    }

                    const store = db.createObjectStore(schema.name, {
                        keyPath: schema.keyPath,
                        autoIncrement: schema.autoIncrement,
                    });

                    if (schema.indexes) {
                        for (const idx of schema.indexes) {
                            store.createIndex(idx.name, idx.keyPath, {
                                unique: idx.unique ?? false,
                            });
                        }
                    }
                }
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    get<T>(storeName: string, key: string | number): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject(new Error('Database not opened'));

            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result as T | undefined);
            request.onerror = () => reject(request.error);
        });
    }

    getAll<T>(storeName: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject(new Error('Database not opened'));

            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result as T[]);
            request.onerror = () => reject(request.error);
        });
    }

    put<T>(storeName: string, value: T): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject(new Error('Database not opened'));

            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.put(value);

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    delete(storeName: string, key: string | number): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject(new Error('Database not opened'));

            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.delete(key);

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    replaceAll<T>(storeName: string, items: T[]): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject(new Error('Database not opened'));

            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.clear();
            for (const item of items) {
                store.put(item);
            }

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    clear(storeName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject(new Error('Database not opened'));

            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            store.clear();

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    close(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

export const cloverDB = new CloverDB();
