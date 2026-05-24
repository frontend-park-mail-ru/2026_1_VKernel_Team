import { moderationApi } from '@modules/moderation/api';
import { store } from '@/core/store';

export const MODERATION_COUNT_CHANGED_EVENT = 'moderation:count-changed';

let _count = 0;

export const moderationStore = {
    get count(): number {
        return _count;
    },

    set(next: number): void {
        const value = Math.max(0, Math.floor(next));
        if (value === _count) return;
        _count = value;
        window.dispatchEvent(new CustomEvent(MODERATION_COUNT_CHANGED_EVENT));
    },

    decrement(): void {
        this.set(_count - 1);
    },

    increment(): void {
        this.set(_count + 1);
    },

    async refreshFromServer(): Promise<void> {
        if (store.user?.role !== 'admin') {
            this.set(0);
            return;
        }
        const res = await moderationApi.getQueue();
        if (!res.success || !res.data) return;
        const data: any = res.data;
        let ads: any[] = [];
        if (Array.isArray(data.ads)) ads = data.ads;
        else if (Array.isArray(data)) ads = data;
        else {
            const arrays = Object.values(data).filter(Array.isArray);
            if (arrays.length > 0) ads = arrays[0] as any[];
        }
        this.set(ads.length);
    },
};
