import { API_ENDPOINTS, apiClient } from '@/api/apiClient';
import { PROFILE_CONFIG } from '@modules/profile/config';
import type { User } from '@/types';

export const ProfileService = {
    async getProfile() {
        return apiClient.get<User>(PROFILE_CONFIG.API.GET_PROFILE);
    },

    async updateName(newName: string) {
        return apiClient.patch<User>(PROFILE_CONFIG.API.UPDATE_PROFILE, { name: newName });
    },

    async getUserAds(userId: number | string) {
        return apiClient.get<any[]>(API_ENDPOINTS.USERS.GET_ADS(userId));
    },

    async uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await apiClient.post<User>(PROFILE_CONFIG.API.UPLOAD_AVATAR, formData);
            
            // Проверяем success
            if (!response.success) {
                throw new Error(response.error || 'Не удалось загрузить аватарку');
            }
            
            return response.data;
        } catch (error) {
            console.error('Ошибка в ProfileService.uploadAvatar:', error);
            throw error;
        }
    },

    async logout() {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    },
};
