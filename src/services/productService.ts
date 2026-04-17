import api from "../lib/axios";
import { ProductsList } from "../types/product.types";

export const productService = {
  async getAllProducts(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    client_id?: number;
  }): Promise<ProductsList> {
    const response = await api.get("/products", { params });
    return response.data;
  },

  async getProductsByClient(
    clientId: number,
    params?: {
      page?: number;
      page_size?: number;
      search?: string;
    }
  ): Promise<ProductsList> {
    const response = await api.get(`/products/client/${clientId}`, { params });
    return response.data;
  },

  async uploadGsaProducts(clientId: number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/upload/${clientId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async getGsaUploadStatus(clientId: number): Promise<any> {
    const response = await api.get(`/upload/${clientId}/status`);
    return response.data;
  },

  async resetGsaUploadStatus(clientId: number): Promise<any> {
    const response = await api.post(`/upload/${clientId}/reset`);
    return response.data;
  },
};