import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../lib/axios';
import { clientService } from './clientService';

// Mock the api module
vi.mock('../lib/axios');

describe('clientService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getAllClients', () => {
    it('fetches all clients correctly', async () => {
      const mockData = [{ id: 1, name: 'Client A' }];
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await clientService.getAllClients();

      expect(api.get).toHaveBeenCalledWith('/clients', { params: undefined });
      expect(result).toEqual(mockData);
    });
  });

  describe('getApprovedClients', () => {
    it('fetches approved clients correctly', async () => {
      const mockData = [{ id: 2, name: 'Client B' }];
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await clientService.getApprovedClients();

      expect(api.get).toHaveBeenCalledWith('/clients/approved');
      expect(result).toEqual(mockData);
    });
  });
});
