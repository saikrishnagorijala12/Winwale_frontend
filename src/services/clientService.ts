import api from "../lib/axios";
import { ClientListRead } from "../types/contract.types";

export const clientService = {
  async getAllClients(): Promise<ClientListRead[]> {
    const response = await api.get("/clients");
    return response.data;
  },
};