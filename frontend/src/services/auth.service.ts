import { api } from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    const { data } = await api.post<AuthResponse>('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data;
  },

  async register(email: string, password: string, full_name: string): Promise<User> {
    const { data } = await api.post<User>('/auth/register', { email, password, full_name });
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout').catch(() => {}); // Best effort
  },
};
