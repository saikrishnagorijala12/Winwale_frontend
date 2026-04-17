import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../lib/axios';
import { userService } from './userService';

vi.mock('../lib/axios');

describe('userService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches the current user profile', async () => {
    const mockData = { user_id: 1, name: 'Alex User', email: 'alex@example.com' };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await userService.getMe();

    expect(api.get).toHaveBeenCalledWith('/users/me');
    expect(result).toEqual(mockData);
  });

  it('fetches the current user status', async () => {
    const mockData = { status: 'pending' };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await userService.getMyStatus();

    expect(api.get).toHaveBeenCalledWith('/users/me/status');
    expect(result).toEqual(mockData);
  });

  it('fetches all users with pagination params', async () => {
    const params = { page: 2, page_size: 20, search: 'alex' } as any;
    const mockData = { users: [], total_count: 0, page: 2, page_size: 20, total_pages: 0 };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await userService.getAllUsers(params);

    expect(api.get).toHaveBeenCalledWith('/users/all', { params });
    expect(result).toEqual(mockData);
  });

  it('updates a user status with an action param', async () => {
    const mockData = { success: true };
    (api.patch as any).mockResolvedValue({ data: mockData });

    const result = await userService.approveUser(7, 'approve');

    expect(api.patch).toHaveBeenCalledWith('/users/7/approve', null, {
      params: { action: 'approve' }
    });
    expect(result).toEqual(mockData);
  });

  it('bulk updates user statuses', async () => {
    const mockData = { updated: 2 };
    (api.patch as any).mockResolvedValue({ data: mockData });

    const result = await userService.bulkUpdateUserStatus([1, 2], 'reject');

    expect(api.patch).toHaveBeenCalledWith('/users/bulk-approve', {
      user_ids: [1, 2],
      action: 'reject'
    });
    expect(result).toEqual(mockData);
  });

  it('creates a user', async () => {
    const payload = { name: 'Taylor', email: 'taylor@example.com' };
    const mockData = { user_id: 5, ...payload };
    (api.post as any).mockResolvedValue({ data: mockData });

    const result = await userService.createUser(payload);

    expect(api.post).toHaveBeenCalledWith('/users', payload);
    expect(result).toEqual(mockData);
  });

  it('updates a user', async () => {
    const payload = { user_id: 5, name: 'Taylor Updated' };
    const mockData = { ...payload, email: 'taylor@example.com' };
    (api.put as any).mockResolvedValue({ data: mockData });

    const result = await userService.updateUser(payload);

    expect(api.put).toHaveBeenCalledWith('/users', payload);
    expect(result).toEqual(mockData);
  });

  it('deletes a user', async () => {
    const mockData = { success: true };
    (api.delete as any).mockResolvedValue({ data: mockData });

    const result = await userService.deleteUser(3);

    expect(api.delete).toHaveBeenCalledWith('/users/3');
    expect(result).toEqual(mockData);
  });

  it('changes a user role', async () => {
    const mockData = { role: 'admin' };
    (api.put as any).mockResolvedValue({ data: mockData });

    const result = await userService.changeUserRole(11);

    expect(api.put).toHaveBeenCalledWith('/users/change_role/11');
    expect(result).toEqual(mockData);
  });
});
