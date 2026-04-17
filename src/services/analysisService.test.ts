import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../lib/axios';
import {
  fetchAnalysisJobs,
  fetchAnalysisJobById,
  createAnalysisJob,
  approveAnalysisJob,
  rejectAnalysisJob,
  startPriceModificationsExport
} from './analysisService';

// Mock the api module
vi.mock('../lib/axios');

describe('analysisService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchAnalysisJobs', () => {
    it('fetches jobs with params', async () => {
      const mockData = { items: [], total: 0 };
      (api.get as any).mockResolvedValue({ data: mockData });

      const params = { page: 1, status: 'pending' };
      const result = await fetchAnalysisJobs(params);

      expect(api.get).toHaveBeenCalledWith('/jobs', { params });
      expect(result).toEqual(mockData);
    });
  });

  describe('fetchAnalysisJobById', () => {
    it('fetches a single job by id', async () => {
      const mockData = { id: 1, status: 'active' };
      (api.get as any).mockResolvedValue({ data: mockData });

      const result = await fetchAnalysisJobById(1);

      expect(api.get).toHaveBeenCalledWith('/jobs/1', { params: undefined });
      expect(result).toEqual(mockData);
    });
  });

  describe('createAnalysisJob', () => {
    it('creates a job securely', async () => {
      const reqData = { client_id: 1, file_name: 'test.xlsx' } as any;
      const resData = { id: 2, status: 'pending' };
      (api.post as any).mockResolvedValue({ data: resData });

      const result = await createAnalysisJob(reqData);

      expect(api.post).toHaveBeenCalledWith('/jobs', reqData);
      expect(result).toEqual(resData);
    });
  });

  describe('approveAnalysisJob', () => {
    it('approves a job', async () => {
      const resData = { success: true };
      (api.post as any).mockResolvedValue({ data: resData });

      const result = await approveAnalysisJob(10);

      expect(api.post).toHaveBeenCalledWith('/jobs/10/status?action=approve');
      expect(result).toEqual(resData);
    });
  });

  describe('rejectAnalysisJob', () => {
    it('rejects a job', async () => {
      const resData = { success: true };
      (api.post as any).mockResolvedValue({ data: resData });

      const result = await rejectAnalysisJob(10);

      expect(api.post).toHaveBeenCalledWith('/jobs/10/status?action=reject');
      expect(result).toEqual(resData);
    });
  });

  describe('startPriceModificationsExport', () => {
    it('starts an export task', async () => {
      const taskResponse = { task_id: 'task-123' };
      (api.post as any).mockResolvedValue({ data: taskResponse });

      const params = { job_id: 5 };
      const result = await startPriceModificationsExport(params);

      expect(api.post).toHaveBeenCalledWith('/export/price-modifications', null, expect.objectContaining({
        params,
        paramsSerializer: { indexes: null }
      }));
      expect(result).toEqual(taskResponse);
    });
  });
});
