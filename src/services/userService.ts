import api from "../lib/axios";
import { Role } from "../types/roles.types";
import { UserProfile, PaginatedUsers } from "../types/user.types";
import { PaginationParams } from "../types/common.types";

export const userService = {
  async getMe(): Promise<UserProfile> {
    const response = await api.get("/users/me");
    return response.data;
  },

  async getMyStatus(): Promise<any> {
    const response = await api.get("/users/me/status");
    return response.data;
  },

  async getAllUsers(params: PaginationParams): Promise<PaginatedUsers> {
    const response = await api.get("/users/all", { params });
    return response.data;
  },

  async approveUser(userId: number, action: "approve" | "reject"): Promise<any> {
    const response = await api.patch(`/users/${userId}/approve`, null, {
      params: { action }
    });
    return response.data;
  },

  async bulkUpdateUserStatus(userIds: number[], action: "approve" | "reject"): Promise<any> {
    const response = await api.patch("/users/bulk-approve", {
      user_ids: userIds,
      action
    });
    return response.data;
  },

  async createUser(payload: any): Promise<UserProfile> {
    const response = await api.post("/users", payload);
    return response.data;
  },

  async updateUser(payload: any): Promise<UserProfile> {
    const response = await api.put("/users", payload);
    return response.data;
  },

  async deleteUser(userId: number): Promise<any> {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  async changeUserRole(userId: number): Promise<any> {
    const response = await api.put(`/users/change_role/${userId}`);
    return response.data;
  }
};
