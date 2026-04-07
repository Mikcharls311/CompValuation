import { api } from './api';
import type { Task, TaskCreateInput, TaskUpdateInput, PaginatedResponse, TaskFilters } from '../types';

export const taskService = {
  async getTasks(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
    const { data } = await api.get<PaginatedResponse<Task>>('/tasks', { params: filters });
    return data;
  },

  async getTask(id: string): Promise<Task> {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },

  async createTask(input: TaskCreateInput): Promise<Task> {
    const { data } = await api.post<Task>('/tasks', input);
    return data;
  },

  async updateTask(id: string, input: TaskUpdateInput): Promise<Task> {
    const { data } = await api.patch<Task>(`/tasks/${id}`, input);
    return data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};
