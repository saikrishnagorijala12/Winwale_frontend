import api from "../lib/axios";
import { ClientListRead } from "../types/contract.types";
import { Client } from "../types/product.types";

export const clientService = {
  async getAllClients(): Promise<ClientListRead[]> {
    const response = await api.get("/clients");
    return response.data;
  },
   async getApprovedClients(): Promise<Client[]> {
    const response = await api.get("/clients/approved");
    return response.data;
  },
};