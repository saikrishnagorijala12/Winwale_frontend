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
};