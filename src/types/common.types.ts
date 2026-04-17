
export type TabType = 'all' | 'pending' | 'approved' | 'rejected';

export interface ActionDropdownProps {
  onStatusUpdate: (newStatus: 'approve' | 'reject') => void;
  currentStatus: string;
  isUpdating?: boolean;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  status?: string;
  search?: string;
}
