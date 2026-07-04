import apiClient from '../client';
import type { ApiResponse, User, LoginCredentials, RegisterData } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await apiClient.post<ApiResponse<{ user: User }>>(
      '/users/login',
      credentials
    );
    return data;
  },

  async register(registerData: RegisterData) {
    const { data } = await apiClient.post<ApiResponse<{ user: User }>>(
      '/users/register',
      registerData
    );
    return data;
  },

  async logout() {
    const { data } = await apiClient.post<ApiResponse<null>>('/users/logout');
    return data;
  },

  async getMe() {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>('/users/me');
    return data;
  },
};
