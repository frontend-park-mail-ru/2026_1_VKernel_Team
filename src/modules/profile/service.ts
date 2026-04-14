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

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file); 

    try {
      const response = await apiClient.post<User>(PROFILE_CONFIG.API.UPLOAD_AVATAR, formData);
      return response.data; 
    } catch (error) {
      console.error('Ошибка в ProfileService.uploadAvatar:', error);
      throw error;
    }
  },
  
  async logout() {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
  }
};
