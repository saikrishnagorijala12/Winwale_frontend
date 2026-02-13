import api from "../lib/axios";
import {
  AnalysisJob,
  AnalysisJobResponse,
  CreateJobRequest,
  CreateJobResponse,
  UpdateJobStatusResponse,
} from "../types/analysis.types";

/**
 * Fetch all analysis jobs
 */
export const fetchAnalysisJobs = async (): Promise<AnalysisJobResponse[]> => {
  const response = await api.get<AnalysisJobResponse[]>("/jobs");
  return response.data;
};

/**
 * Fetch a single analysis job by ID
 */
export const fetchAnalysisJobById = async (
  jobId: number
): Promise<AnalysisJob> => {
  const response = await api.get<AnalysisJob>(`/jobs/${jobId}`);
  return response.data;
};

/**
 * Create a new analysis job
 */
export const createAnalysisJob = async (
  data: CreateJobRequest
): Promise<CreateJobResponse> => {
  const response = await api.post<CreateJobResponse>("/jobs", data);
  return response.data;
};

/**
 * Approve an analysis job
 */
export const approveAnalysisJob = async (
  jobId: number
): Promise<UpdateJobStatusResponse> => {
  const response = await api.post<UpdateJobStatusResponse>(
    `/jobs/${jobId}/status?action=approve`
  );
  return response.data;
};

/**
 * Reject an analysis job
 */
export const rejectAnalysisJob = async (
  jobId: number
): Promise<UpdateJobStatusResponse> => {
  const response = await api.post<UpdateJobStatusResponse>(
    `/jobs/${jobId}/status?action=reject`
  );
  return response.data;
};