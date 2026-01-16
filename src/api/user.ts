import api from "../lib/axios";

export interface UserProfile {
  user_id: number;
  name: string;
  email: string;
  phone_no?: string;
  role: string;
  is_active: boolean;
  is_deleted:boolean;
}

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await api.get("/users/me");
  return response.data;
}
