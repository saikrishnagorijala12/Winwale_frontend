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
  client_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
}): Promise<any> => {
  const response = await api.get("/jobs", { params });
  return response.data;
};

export const fetchGenerationJobDetails = async (jobId: number): Promise<any> => {
  const response = await api.get(`/generate/${jobId}`);
  return response.data;
};

export const fetchAnalysisJobById = async (
  jobId: number,
  params?: {
    page?: number;
    page_size?: number;
    action_type?: string;
  }
): Promise<any> => {
  const response = await api.get(`/jobs/${jobId}`, { params });
  return response.data;
};

export const uploadCpl = async (clientId: number, files: File[]): Promise<any> => {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));
  const response = await api.post(`/cpl/${clientId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const approveAnalysisJob = async (jobId: number): Promise<any> => {
  const response = await api.post(`/jobs/${jobId}/status`, null, {
    params: { action: "approve" }
  });
  return response.data;
};

export const rejectAnalysisJob = async (jobId: number): Promise<any> => {
  const response = await api.post(`/jobs/${jobId}/status`, null, {
    params: { action: "reject" }
  });
  return response.data;
};


export const createAnalysisJob = async (
  data: CreateJobRequest
): Promise<CreateJobResponse> => {
  const response = await api.post<CreateJobResponse>("/jobs", data);
  return response.data;
};





export const startPriceModificationsExport = async (params: {
  client_id?: number | null;
  job_id?: number | null;
  types?: string[];
}): Promise<{ task_id: string }> => {
  const response = await api.post("/export/price-modifications", null, {
    params,
    paramsSerializer: {
      indexes: null,
    },
  });
  return response.data;
};

export const exportPriceModifications = async (params: {
  client_id?: number | null;
  job_id?: number | null;
  types?: string[];
}): Promise<Blob> => {
  const response = await api.get("/export/price-modifications", {
    params,
    responseType: "blob",
    paramsSerializer: {
      indexes: null,
    },
  });
  return response.data;
};

export const startProductsExport = async (params: {
  client_id?: number | null;
}): Promise<{ task_id: string }> => {
  const response = await api.post("/export/", null, { params });
  return response.data;
};

export const getExportDownloadUrl = async (taskId: string): Promise<{ url: string; filename: string }> => {
  const response = await api.get(`/export/download/${taskId}`);
  return response.data;
};
