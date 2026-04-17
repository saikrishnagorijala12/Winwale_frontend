import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../lib/axios';
import { productService } from './productService';

vi.mock('../lib/axios');

describe('productService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches all products with params', async () => {
    const mockData = { items: [], total: 0, page: 1, page_size: 10, total_pages: 0 };
    const params = { page: 2, page_size: 25, search: 'desk', client_id: 4 };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await productService.getAllProducts(params);

    expect(api.get).toHaveBeenCalledWith('/products', { params });
    expect(result).toEqual(mockData);
  });

  it('fetches products for a specific client', async () => {
    const mockData = { items: [], total: 1, page: 1, page_size: 10, total_pages: 1 };
    const params = { page: 1, search: 'monitor' };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await productService.getProductsByClient(12, params);

    expect(api.get).toHaveBeenCalledWith('/products/client/12', { params });
    expect(result).toEqual(mockData);
  });

  it('uploads GSA products as multipart form data', async () => {
    const file = new File(['csv'], 'products.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const mockData = { upload_id: 'upload-1' };
    (api.post as any).mockResolvedValue({ data: mockData });

    const result = await productService.uploadGsaProducts(8, file);

    expect(api.post).toHaveBeenCalledWith(
      '/upload/8',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    expect(result).toEqual(mockData);
  });

  it('fetches upload status for a client', async () => {
    const mockData = { status: 'processing' };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await productService.getGsaUploadStatus(5);

    expect(api.get).toHaveBeenCalledWith('/upload/5/status');
    expect(result).toEqual(mockData);
  });

  it('resets upload status for a client', async () => {
    const mockData = { success: true };
    (api.post as any).mockResolvedValue({ data: mockData });

    const result = await productService.resetGsaUploadStatus(5);

    expect(api.post).toHaveBeenCalledWith('/upload/5/reset');
    expect(result).toEqual(mockData);
  });
});
