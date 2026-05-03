import '@modules/profile/components/profile-avatar/style.scss';
import template from '@modules/profile/components/profile-avatar/profile-avatar.hbs';
import { ProfileService } from '@modules/profile/service';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';
import { networkStatus } from '@modules/common/offline/network/networkStatus';
import { syncQueue } from '@modules/common/offline/sync/syncQueue';
import { saveAvatarForSync, clearCachedAvatar } from '@modules/profile/sync-handler';

export const ProfileAvatar = {
    getTemplate() {
        return template;
    },

    init(): void {
        const avatarInput = document.querySelector(
            '.avatar-wrapper input[type="file"]',
        ) as HTMLInputElement;
        if (!avatarInput) return;

        avatarInput.addEventListener('change', async (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files?.length) {
                await this.handleUpload(target.files[0]);
                target.value = '';
            }
        });
    },

    async handleUpload(file: File): Promise<void> {
        const previewUrl = URL.createObjectURL(file);
        const allAvatars = document.querySelectorAll('.avatar-img, .header .avatar');
        allAvatars.forEach((img) => ((img as HTMLImageElement).src = previewUrl));

        if (!networkStatus.isOnline) {
            // Offline: сохраняем файл и ставим в очередь синхронизации
            try {
                const dataUrl = await saveAvatarForSync(file);
                store.setState({
                    user: { ...(store.user ?? {}), avatar: dataUrl, avatar_path: dataUrl },
                });
                await syncQueue.add({
                    type: 'UPLOAD_AVATAR',
                    payload: {},
                    timestamp: Date.now(),
                });
                uiActions.showSuccess('Аватар сохранён, обновится при подключении');
            } catch {
                uiActions.showError('Не удалось сохранить аватар');
            } finally {
                URL.revokeObjectURL(previewUrl);
            }
            return;
        }

        uiActions.showLoading(true);
        try {
            const res = await ProfileService.uploadAvatar(file);
            if (res && res.avatar_path) {
                store.setState({
                    user: {
                        ...(store.user ?? {}),
                        avatar: res.avatar_path,
                        avatar_path: res.avatar_path,
                    },
                });
                await clearCachedAvatar();
                uiActions.showSuccess('Аватар обновлен');
            }
        } catch {
            // Если запрос упал — сохраняем для синхронизации
            try {
                const dataUrl = await saveAvatarForSync(file);
                store.setState({
                    user: { ...(store.user ?? {}), avatar: dataUrl, avatar_path: dataUrl },
                });
                await syncQueue.add({
                    type: 'UPLOAD_AVATAR',
                    payload: {},
                    timestamp: Date.now(),
                });
                networkStatus.setOffline();
                uiActions.showSuccess('Аватар сохранён, обновится при подключении');
            } catch {
                uiActions.showError('Ошибка загрузки');
            }
        } finally {
            uiActions.showLoading(false);
            URL.revokeObjectURL(previewUrl);
        }
    },
};
