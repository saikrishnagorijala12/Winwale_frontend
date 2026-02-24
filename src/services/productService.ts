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

  async exportProducts(clientId?: number): Promise<Blob> {
    const response = await api.get("/export/", {
      params: clientId ? { client_id: clientId } : {},
      responseType: "blob",
    });
    return response.data;
  },
};