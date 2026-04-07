import { api } from './api';
import type { Stats } from '../types';

export const statsService = {
  async getStats(): Promise<Stats> {
    const { data } = await api.get<Stats>('/stats');
    return data;
  },
};
