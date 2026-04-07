import { api } from './api';
import type { User, UserCreateInput, UserUpdateInput } from '../types';

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users');
    return data;
  },

  async createUser(input: UserCreateInput): Promise<User> {
    const { data } = await api.post<User>('/users', input);
    return data;
  },

  async updateUser(id: string, input: UserUpdateInput): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, input);
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
