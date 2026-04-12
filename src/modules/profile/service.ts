import { API_ENDPOINTS, apiClient } from '@/api/apiClient';
import { PROFILE_CONFIG } from './config';
// Заменяем ProfileData на User
import type { User } from '@/types';

export const ProfileService = {
  async getProfile() {
    // Используем User вместо ProfileData
    return apiClient.get<User>(PROFILE_CONFIG.API.GET_PROFILE);
  },

  async updateName(newName: string) {
    return apiClient.patch<User>(PROFILE_CONFIG.API.UPDATE_PROFILE, { name: newName });
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return fetch(`/api/v1${PROFILE_CONFIG.API.UPLOAD_AVATAR}`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }).then(res => res.json());
  },
  
  async logout() {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
  }
};
