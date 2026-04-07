export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface TaskFilters {
  status?: Task['status'];
  priority?: Task['priority'];
  page?: number;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  status: Task['status'];
  priority: Task['priority'];
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
}

export interface UserCreateInput {
  email: string;
  password: string;
  full_name: string;
}

export interface UserUpdateInput {
  full_name?: string;
  password?: string;
}

export interface Stats {
  total: number;
  by_status: {
    todo: number;
    in_progress: number;
    done: number;
  };
  by_priority: {
    low: number;
    medium: number;
    high: number;
  };
}
