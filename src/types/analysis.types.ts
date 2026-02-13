export interface ModificationSummary {
  additions: number;
  deletions: number;
  priceIncreases: number;
  priceDecreases: number;
  descriptionChanges: number;
}

export interface ModificationAction {
  action_id: number;
  action_type:
  | "NEW_PRODUCT"
  | "REMOVED_PRODUCT"
  | "PRICE_INCREASE"
  | "PRICE_DECREASE"
  | "DESCRIPTION_CHANGE";
  product_id?: number | null;
  product_name?: string | null;
  manufacturer_part_number?: string | null;
  old_price?: number | null;
  new_price?: number | null;
  old_description?: string | null;
  new_description?: string | null;
  number_of_items_impacted?: number | null;
  created_time: string;
}

export interface AnalysisJobResponse {
  job_id: number;
  client_id: number;
  contract_number: string;
  client: string;
  user_id: number;
  user: string;
  status: "pending" | "approved" | "rejected";
  action_summary: Record<string, number>;
  created_time: string;
  updated_time: string;
}

export interface AnalysisJob extends AnalysisJobResponse {
  summary: ModificationSummary;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

export type StatusFilter = "All" | "pending" | "approved" | "rejected";

export interface CreateJobRequest {
  client_id: number;
  email: string;
}

export interface CreateJobResponse {
  job_id: number;
  client_id: number;
  status: string;
  created_time: string;
}

export interface UpdateJobStatusResponse {
  job_id: number;
  status: string;
  message: string;
}