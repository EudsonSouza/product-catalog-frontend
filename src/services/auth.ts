import { apiClient } from './api';
import { API_CONFIG, API_ENDPOINTS } from '@/lib/utils/constants';
import { User } from '@/lib/types/auth';

class AuthService {
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  login(): void {
    window.location.href = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
