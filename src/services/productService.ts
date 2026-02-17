import api from "../lib/axios";
import { ProductsList } from "../types/product.types";

export const productService = {
  async getAllProducts(): Promise<ProductsList> {
    const response = await api.get("/products");
    return response.data;
  },

  async getProductsByClient(clientId: number): Promise<ProductsList> {
    const response = await api.get(`/products/client/${clientId}`);
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