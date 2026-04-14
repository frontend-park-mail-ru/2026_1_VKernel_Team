import '@modules/profile/components/profile-avatar/style.css';
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
        const avatarInput = document.querySelector(
            '.avatar-wrapper input[type="file"]',
        ) as HTMLInputElement;
        if (!avatarInput) return;

        // Важно: чтобы срабатывало даже при выборе того же самого файла второй раз
        avatarInput.addEventListener('click', (e) => {
            (e.target as HTMLInputElement).value = ''; 
        });

        avatarInput.addEventListener('change', async (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files?.length) {
                await this.handleUpload(target.files[0]);
            }
        });
    },

    async handleUpload(file: File): Promise<void> {
        const previewUrl = URL.createObjectURL(file);
        const allAvatars = document.querySelectorAll<HTMLImageElement>('.avatar-img, .header .avatar');
        
        // 1. Показываем локальное превью
        allAvatars.forEach((img) => (img.src = previewUrl));

        uiActions.showLoading(true);
        try {
            const res = await ProfileService.uploadAvatar(file);
            
            // 2. Опираемся ТОЛЬКО на поля, которые есть в вашем интерфейсе User (avatar_path или avatar)
            const newAvatar = res?.avatar_path || res?.avatar;

            if (res && newAvatar) {
                // 3. Безопасно обновляем стор (учитывая, что user может быть null)
                const currentUser = store.user || {};
                
                store.setState({ 
                    user: { 
                        ...currentUser, 
                        avatar_path: newAvatar,
                        avatar: newAvatar 
                    } 
                });

                // 4. Заменяем превью на постоянный URL с сервера 
                allAvatars.forEach((img) => (img.src = newAvatar));
                
                uiActions.showSuccess('Аватар обновлен');
            } else {
                throw new Error('Сервер не вернул путь к аватарке');
            }
        } catch (err: any) {
            uiActions.showError(err.message || 'Ошибка загрузки');
            // В случае ошибки возвращаем старую аватарку из стора
            const oldAvatar = store.user?.avatar_path || store.user?.avatar || '';
            allAvatars.forEach((img) => (img.src = oldAvatar));
        } finally {
            uiActions.showLoading(false);
            URL.revokeObjectURL(previewUrl);
        }
    },
};
