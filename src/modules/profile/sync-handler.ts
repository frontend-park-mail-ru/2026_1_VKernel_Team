import { syncManager, SyncHandler } from '@modules/common/offline/sync/syncManager';
import { SyncOperation } from '@modules/common/offline/sync/syncQueue';
import { cloverDB } from '@modules/common/offline/db/indexedDB';
import { ProfileService } from '@modules/profile/service';
import { store } from '@/core/store';
import { NotificationComponent } from '@modules/common/notifications/notification';

const AVATAR_STORE = 'avatarQueue';
const USER_PROFILE_STORE = 'userProfile';

export interface AvatarQueueItem {
    id?: number;
    blob: Blob;
    fileName: string;
    fileType: string;
    previewDataUrl: string;
}

interface CachedAvatar {
    id: string;
    dataUrl: string;
}

export async function saveAvatarForSync(file: File): Promise<string> {
    const blob = file.slice();
    const previewDataUrl = await blobToDataUrl(blob);

    await cloverDB.clear(AVATAR_STORE);
    await cloverDB.put<AvatarQueueItem>(AVATAR_STORE, {
        blob,
        fileName: file.name,
        fileType: file.type,
        previewDataUrl,
    });

    // Сохраняем превью в IndexedDB для отображения при перезагрузке
    await cloverDB.put<CachedAvatar>(USER_PROFILE_STORE, {
        id: 'avatar',
        dataUrl: previewDataUrl,
    });

    return previewDataUrl;
}

export async function getCachedAvatarDataUrl(): Promise<string | null> {
    try {
        const cached = await cloverDB.get<CachedAvatar>(USER_PROFILE_STORE, 'avatar');
        return cached?.dataUrl ?? null;
    } catch {
        return null;
    }
}

export async function clearCachedAvatar(): Promise<void> {
    try {
        await cloverDB.delete(USER_PROFILE_STORE, 'avatar');
    } catch {
        // ignore
    }
}

function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}

const handleUpdateName: SyncHandler = async (op: SyncOperation) => {
    try {
        const newName = op.payload.name as string;
        if (!newName) return 'success';

        const res = await ProfileService.updateName(newName);
        if (res.success && res.data) {
            store.setState({ user: { ...(store.user ?? {}), name: res.data.name } });
            NotificationComponent.show({
                type: 'success',
                message: 'Имя синхронизировано',
                duration: 3000,
            });
            return 'success';
        }
        return 'conflict';
    } catch (error: any) {
        if (error?.message?.includes('fetch') || error?.name === 'TypeError') {
            return 'network_error';
        }
        return 'conflict';
    }
};

const handleAvatarUpload: SyncHandler = async (_op: SyncOperation) => {
    try {
        const items = await cloverDB.getAll<AvatarQueueItem>(AVATAR_STORE);
        if (items.length === 0) return 'success';

        const item = items[0];
        const file = new File([item.blob], item.fileName, { type: item.fileType });
        const res = await ProfileService.uploadAvatar(file);

        if (res && res.avatar_path) {
            store.setState({
                user: {
                    ...(store.user ?? {}),
                    avatar: res.avatar_path,
                    avatar_path: res.avatar_path,
                },
            });
            await cloverDB.clear(AVATAR_STORE);
            await clearCachedAvatar();
            NotificationComponent.show({
                type: 'success',
                message: 'Аватар синхронизирован',
                duration: 3000,
            });
            return 'success';
        }

        return 'conflict';
    } catch (error: any) {
        if (error?.message?.includes('fetch') || error?.name === 'TypeError') {
            return 'network_error';
        }
        return 'conflict';
    }
};

export function registerAvatarSyncHandler(): void {
    syncManager.registerHandler('UPLOAD_AVATAR', handleAvatarUpload);
    syncManager.registerHandler('UPDATE_NAME', handleUpdateName);
}
