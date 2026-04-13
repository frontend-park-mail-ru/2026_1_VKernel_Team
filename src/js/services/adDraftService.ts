import { cloverDB } from '@modules/common/offline/db/indexedDB';

const STORE_NAME = 'adDrafts';

interface AdDraftRecord {
    id: string;
    formData: {
        title: string;
        category_id: number;
        price: number;
        description: string;
        location: string;
        category_characteristics: Array<{ category_characteristic_id: number; value: string }>;
        custom_characteristics: Array<{ name: string; value: string }>;
    };
    photos: Blob[];
    photoNames: string[];
    photoTypes: string[];
    timestamp: number;
}

export class AdDraftService {
    private static currentDraftId: string | null = null;

    private static generateId(): string {
        return 'draft_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    static async save(formData: any, photoFiles: File[]): Promise<string> {
        const id = this.generateId();
        this.currentDraftId = id;

        const photos: Blob[] = photoFiles.map((f) => new Blob([f], { type: f.type }));
        const photoNames = photoFiles.map((f) => f.name);
        const photoTypes = photoFiles.map((f) => f.type);

        const record: AdDraftRecord = {
            id,
            formData: {
                title: formData.title || '',
                category_id: formData.category_id || 0,
                price: formData.price || 0,
                description: formData.description || '',
                location: formData.location || '',
                category_characteristics: formData.category_characteristics || [],
                custom_characteristics: formData.custom_characteristics || [],
            },
            photos,
            photoNames,
            photoTypes,
            timestamp: Date.now(),
        };

        await cloverDB.put<AdDraftRecord>(STORE_NAME, record);
        return id;
    }

    static async get(draftId?: string): Promise<{ formData: any; photoFiles: File[] } | null> {
        const id = draftId || this.currentDraftId;
        if (!id) {
            const all = await cloverDB.getAll<AdDraftRecord>(STORE_NAME);
            if (all.length === 0) return null;
            const latest = all.sort((a, b) => b.timestamp - a.timestamp)[0];
            return this.recordToResult(latest);
        }

        try {
            const record = await cloverDB.get<AdDraftRecord>(STORE_NAME, id);
            if (!record) return null;
            return this.recordToResult(record);
        } catch (e) {
            console.error('Error loading draft:', e);
            return null;
        }
    }

    private static recordToResult(record: AdDraftRecord): { formData: any; photoFiles: File[] } {
        const photoFiles = record.photos.map(
            (blob, i) =>
                new File([blob], record.photoNames[i] || `photo_${i}.jpg`, {
                    type: record.photoTypes[i] || 'image/jpeg',
                }),
        );

        return {
            formData: record.formData,
            photoFiles,
        };
    }

    static async clear(draftId?: string): Promise<void> {
        const id = draftId || this.currentDraftId;
        if (id) {
            await cloverDB.delete(STORE_NAME, id);
        }
        this.currentDraftId = null;
    }

    static async hasDraft(): Promise<boolean> {
        try {
            const all = await cloverDB.getAll<AdDraftRecord>(STORE_NAME);
            return all.length > 0;
        } catch {
            return false;
        }
    }

    static getCurrentDraftId(): string | null {
        return this.currentDraftId;
    }
}
