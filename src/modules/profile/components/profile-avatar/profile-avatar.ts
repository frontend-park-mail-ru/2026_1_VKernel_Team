import  '@modules/profile/components/profile-avatar/style.css';
import template from '@modules/profile/components/profile-avatar/profile-avatar.hbs?raw';
import { ProfileService } from '@modules/profile/service';
import { store } from '@/core/store';
import { uiActions } from '@/actions/uiActions';

declare const Handlebars: any;

export const ProfileAvatar = {
    getTemplate() {
        return Handlebars.compile(template);
    },

    init(): void {
        const avatarInput = document.querySelector('.avatar-wrapper input[type="file"]') as HTMLInputElement;
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
        allAvatars.forEach(img => (img as HTMLImageElement).src = previewUrl);

        uiActions.showLoading(true);
        try {
            const res = await ProfileService.uploadAvatar(file);
            if (res && res.avatar_path) {
                store.setState({ user: { ...store.user, avatar_path: res.avatar_path } });
                uiActions.showSuccess('Аватар обновлен');
            }
        } catch (err) {
            uiActions.showError('Ошибка загрузки');
        } finally {
            uiActions.showLoading(false);
            URL.revokeObjectURL(previewUrl);
        }
    }
};
