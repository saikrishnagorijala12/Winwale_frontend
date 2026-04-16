import api from "../lib/axios";
import { Role } from "../types/roles.types";

export interface UserProfile {
  user_id: number;
  name: string;
  email: string;
  phone_no?: string;
  role: Role;
  is_active: boolean;
  is_deleted:boolean;
}

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await api.get("/users/me");
  return response.data;
}
