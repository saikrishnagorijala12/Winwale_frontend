import api from "../lib/axios";
import { ClientMinimal } from "../types/product.types";

export const clientService = {
  async getAllClients(params?: {
    page?: number;
    page_size?: number;
    status?: string;
    search?: string;
  }): Promise<any> {
    const response = await api.get("/clients", { params });
    return response.data;
  },

  async getApprovedClients(): Promise<ClientMinimal[]> {
    const response = await api.get("/clients/approved");
    return response.data;
  },

  async getClientById(clientId: number): Promise<any> {
    const response = await api.get(`/clients/${clientId}`);
    return response.data;
  },

  async createClient(payload: any): Promise<any> {
    const response = await api.post("/clients", payload);
    return response.data;
  },

  async updateClient(clientId: number, payload: any): Promise<any> {
    const response = await api.put(`/clients/${clientId}`, payload);
    return response.data;
  },

  async deleteClient(clientId: number): Promise<any> {
    const response = await api.delete(`/clients/${clientId}`);
    return response.data;
  },

  async uploadClientLogo(clientId: number, logoFile: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", logoFile);
    const response = await api.post(`/clients/${clientId}/logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async updateClientStatus(clientId: number, action: "approve" | "reject"): Promise<any> {
    const response = await api.patch(`/clients/${clientId}/approve`, null, {
      params: { action }
    });
    return response.data;
  },

  async bulkUpdateClientStatus(clientIds: number[], action: "approve" | "reject"): Promise<any> {
    const response = await api.patch("/clients/bulk-approve", {
      client_ids: clientIds,
      action
    });
    return response.data;
  },
};