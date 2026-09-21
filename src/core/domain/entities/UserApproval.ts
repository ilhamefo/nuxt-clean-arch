import type { Role } from './User';

export interface UserApprovalItem {
  id: string;
  email: string;
  username: string;
  full_name: string;
  jabatan?: string;
  nip?: string;
  level: number;
  unit_code?: string;
  unit_name?: string;
  status: number; // 0: BARU/PENDING, 1: ACCEPT/APPROVED, 2: REJECT/REJECTED
  roles: Role[] | null;
  is_blocked?: boolean;
  phone?: string | null;
  email_verified_at?: string | null;
  api_token?: string | null;
  last_login?: string | null;
  rejected_at?: string | null;
  remember_token?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface UserApprovalQueryParams {
  page?: number;
  limit?: number;
  status?: number | string;
  level?: number | string;
  unit_code?: string;
  search?: string;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
}

export interface UserApprovalsResponse {
  data: UserApprovalItem[];
  message: string;
  page: number;
  page_size: number;
  status: number;
  total: number;
}

export interface UpdateUserApprovalStatusPayload {
  id: string;
  status: number; // 1: ACCEPT, 2: REJECT
  roles?: string[];
  level?: number;
  unit_code?: string;
  unit_name?: string;
  jabatan?: string;
  nip?: string;
}

export interface UpdateUserApprovalBulkItemPayload {
  id: string;
  status: number; // 1: ACCEPT, 2: REJECT
  roles: string[];
  level?: number;
  unit_code?: string;
  unit_name?: string;
  jabatan?: string;
  nip?: string;
}

export interface UpdateUserApprovalBulkStatusPayload {
  items: UpdateUserApprovalBulkItemPayload[];
}

