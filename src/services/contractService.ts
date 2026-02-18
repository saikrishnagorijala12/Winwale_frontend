import api from "../lib/axios";
import {
  ClientContractRead,
  ClientContractCreate,
  ClientContractBase,
} from "../types/contract.types";

export const contractService = {
  async getAllContracts(): Promise<ClientContractRead[]> {
    const response = await api.get("/contracts");
    return response.data;
  },

  async getContractByClientId(clientId: number): Promise<ClientContractRead> {
    const response = await api.get(`/contracts/${clientId}`);
    return response.data;
  },

  async createContract(
    clientId: number,
    data: Omit<ClientContractCreate, "client_id">
  ): Promise<ClientContractRead> {
    const response = await api.post(`/contracts/${clientId}`, data);
    return response.data;
  },

  async updateContract(
    clientId: number,
    data: Partial<ClientContractBase>
  ): Promise<ClientContractRead> {
    const response = await api.put(`/contracts/${clientId}`, data);
    return response.data;
  },

  async deleteContract(clientId: number): Promise<void> {
    await api.delete(`/contracts/${clientId}`);
  },
};