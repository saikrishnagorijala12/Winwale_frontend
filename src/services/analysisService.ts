import api from "../lib/axios";
import {
  AnalysisJob,
  AnalysisJobResponse,
  AnalysisJobsListResponse,
  CreateJobRequest,
  CreateJobResponse,
  UpdateJobStatusResponse,
} from "../types/analysis.types";


export const fetchAnalysisJobs = async (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  client_id?: number | "All";
  status?: string;
  date_from?: string;
  date_to?: string;
}): Promise<AnalysisJobsListResponse> => {
  const response = await api.get<AnalysisJobsListResponse>("/jobs", { params });
  return response.data;
};


export const fetchAnalysisJobById = async (
  jobId: number
): Promise<AnalysisJob> => {
  const response = await api.get<AnalysisJob>(`/jobs/${jobId}`);
  return response.data;
};


export const createAnalysisJob = async (
  data: CreateJobRequest
): Promise<CreateJobResponse> => {
  const response = await api.post<CreateJobResponse>("/jobs", data);
  return response.data;
};


export const approveAnalysisJob = async (
  jobId: number
): Promise<UpdateJobStatusResponse> => {
  const response = await api.post<UpdateJobStatusResponse>(
    `/jobs/${jobId}/status?action=approve`
  );
  return response.data;
};


export const rejectAnalysisJob = async (
  jobId: number
): Promise<UpdateJobStatusResponse> => {
  const response = await api.post<UpdateJobStatusResponse>(
    `/jobs/${jobId}/status?action=reject`
  );
  return response.data;
};