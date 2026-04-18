import { syncManager } from '@modules/common/offline/sync/syncManager';
import { AdDraftService } from '@/services/adDraftService';
import { NotificationComponent } from '@modules/common/notifications/notification';
import type { SyncOperation } from '@modules/common/offline/sync/syncQueue';

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

async function handleCreateAd(
    op: SyncOperation,
): Promise<'success' | 'conflict' | 'network_error'> {
    const draftId = op.payload.draft_id as string;

    try {
        const draft = await AdDraftService.get(draftId);
        if (!draft) {
            return 'conflict';
        }

        const adData = {
            ...draft.formData,
            status: 'active',
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(adData));

        draft.photoFiles.forEach((file: File) => {
            formData.append('photos', file);
        });

        const token = localStorage.getItem('token');
        const csrfToken = getCookie('csrf_token');
        const headers: HeadersInit = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (csrfToken) headers['X-CSRF-Token'] = csrfToken;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('/api/v1/ads', {
            method: 'POST',
            headers,
            body: formData,
            credentials: 'include',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            await AdDraftService.clear(draftId);
            NotificationComponent.show({
                type: 'success',
                message: `Объявление "${adData.title}" опубликовано`,
                duration: 5000,
            });
            return 'success';
        }

        if (response.status === 0) return 'network_error';
        return 'conflict';
    } catch {
        return 'network_error';
    }
}

export function registerAdSyncHandler(): void {
    syncManager.registerHandler('CREATE_AD', handleCreateAd);
}
