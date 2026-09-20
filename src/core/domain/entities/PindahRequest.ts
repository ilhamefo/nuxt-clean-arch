import type { UserVCC } from './User';

export interface FileRecord {
  id: string;
  path: string;
  url?: string;
}

export interface PindahRequest {
  id: string;
  user_id: string;
  old_level: number;
  new_level: number;
  old_unit_code: string;
  new_unit_code: string;
  old_unit_name?: string;
  new_unit_name?: string;
  surat_pindah: string;
  status: number; // 0: BARU/PENDING, 1: ACCEPT/APPROVED, 2: REJECT/REJECTED
  created_at: string;
  updated_at: string;
  user?: UserVCC;
  file?: FileRecord;
}

export interface PindahRequestQueryParams {
  page?: number;
  limit?: number;
  status?: number | string;
  user_id?: string;
  search?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

export interface PindahRequestsResponse {
  data: PindahRequest[];
  message: string;
  page: number;
  page_size: number;
  status: number;
  total: number;
}

export interface UpdatePindahRequestStatusPayload {
  id: string;
  status: number; // 0: BARU, 1: ACCEPT, 2: REJECT
}
