import { apiClient } from './api';
import type { User, LoginCredentials } from '../types/auth.types';

interface LoginResponse {
  ok: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

interface VerifyResponse {
  ok: boolean;
  message?: string;
  data?: {
    user: User;
  };
}

export const authService = {
  /**
   * Login de usuario administrador
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', {
      identifier: credentials.identifier,
      password: credentials.password,
      rememberMe: credentials.rememberMe,
    });

    // Guardar token en localStorage
    if (response.ok && response.data.token) {
      localStorage.setItem('token', response.data.token);

      // Guardar usuario si rememberMe es true
      if (credentials.rememberMe) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }

    return response;
  },

  /**
   * Verificar token JWT
   */
  async verifyToken(): Promise<VerifyResponse> {
    try {
      const response = await apiClient.get<VerifyResponse>('/api/auth/verify');
      return response;
    } catch (error) {
      // Si el token es inválido o expiró, limpiar localStorage
      this.clearAuth();
      throw error;
    }
  },

  /**
   * Limpiar datos de autenticación
   */
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
