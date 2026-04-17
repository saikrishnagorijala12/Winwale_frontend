import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../lib/axios';
import { contractService } from './contractService';

vi.mock('../lib/axios');

describe('contractService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches all contracts', async () => {
    const mockData = [{ client_id: 1, contract_number: 'GS-001' }];
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await contractService.getAllContracts();

    expect(api.get).toHaveBeenCalledWith('/contracts');
    expect(result).toEqual(mockData);
  });

  it('fetches a contract by client id', async () => {
    const mockData = { client_id: 2, contract_number: 'GS-002' };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await contractService.getContractByClientId(2);

    expect(api.get).toHaveBeenCalledWith('/contracts/2');
    expect(result).toEqual(mockData);
  });

  it('creates a contract for a client', async () => {
    const payload = { contract_number: 'GS-003', origin_country: 'USA' };
    const mockData = { client_id: 3, ...payload };
    (api.post as any).mockResolvedValue({ data: mockData });

    const result = await contractService.createContract(3, payload);

    expect(api.post).toHaveBeenCalledWith('/contracts/3', payload);
    expect(result).toEqual(mockData);
  });

  it('updates a contract for a client', async () => {
    const payload = { contract_number: 'GS-004', is_hazardous: false };
    const mockData = { client_id: 4, ...payload };
    (api.put as any).mockResolvedValue({ data: mockData });

    const result = await contractService.updateContract(4, payload);

    expect(api.put).toHaveBeenCalledWith('/contracts/4', payload);
    expect(result).toEqual(mockData);
  });

  it('deletes a contract for a client', async () => {
    (api.delete as any).mockResolvedValue({});

    await contractService.deleteContract(9);

    expect(api.delete).toHaveBeenCalledWith('/contracts/9');
  });
});
