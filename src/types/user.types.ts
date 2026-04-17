import { Role } from "./roles.types";

export interface UserProfile {
  user_id: number;
  name: string;
  email: string;
  phone_no?: string;
  role: Role;
  is_active: boolean;
  is_deleted: boolean;
}

export interface User extends UserProfile {
  created_time?: string;
}

export interface PaginatedUsers {
  users: User[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  status_counts?: Record<string, number>;
}
