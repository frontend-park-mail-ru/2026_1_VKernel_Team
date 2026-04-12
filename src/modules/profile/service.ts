import { API_ENDPOINTS, apiClient } from '@/api/apiClient';
import { PROFILE_CONFIG } from './config';
import type { User, ApiResponse } from '@/types';

export const ProfileService = {
  async getProfile() {
    return apiClient.get<User>(PROFILE_CONFIG.API.GET_PROFILE);
  },

  async updateName(newName: string) {
    return apiClient.patch<User>(PROFILE_CONFIG.API.UPDATE_PROFILE, { name: newName });
  },

  async uploadAvatar(file: File): Promise<ApiResponse<User>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    // Используем базовый URL из apiClient
    const apiUrl = apiClient.getApiUrl(); 
    
    const response = await fetch(`${apiUrl}${PROFILE_CONFIG.API.UPLOAD_AVATAR}`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const data = await response.json();

    return {
      success: response.ok,
      data: data
    };
  },
  
  async logout() {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
  }
};
