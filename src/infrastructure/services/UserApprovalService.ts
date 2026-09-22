import type {
  UserApprovalQueryParams,
  UserApprovalsResponse,
  UpdateUserApprovalStatusPayload,
  UpdateUserApprovalBulkStatusPayload,
} from '../../core/domain/entities/UserApproval';
import type { UserApprovalRepository } from '../../core/domain/repositories/UserApprovalRepository';
import api from '../api/ApiClient';

export class UserApprovalService implements UserApprovalRepository {
  async getUserApprovals(params?: UserApprovalQueryParams): Promise<UserApprovalsResponse> {
    try {
      const cleanParams: Record<string, any> = {};
      if (params) {
        if (params.page !== undefined) cleanParams.page = params.page;
        if (params.limit !== undefined) cleanParams.limit = params.limit;
        if (params.status !== undefined && params.status !== '') cleanParams.status = params.status;
        if (params.level !== undefined && params.level !== '') cleanParams.level = params.level;
        if (params.unit_code !== undefined && params.unit_code.trim() !== '') {
          cleanParams.unit_code = params.unit_code.trim();
        }
        if (params.search !== undefined && params.search.trim() !== '') {
          cleanParams.search = params.search.trim();
        }
        if (params.order_by !== undefined && params.order_by !== '') {
          cleanParams.order_by = params.order_by;
        }
        if (params.order_direction !== undefined) {
          cleanParams.order_direction = params.order_direction;
        }
      }

      const { data } = await api.get('/new/user-approvals', { params: cleanParams });
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  async updateStatus(payload: UpdateUserApprovalStatusPayload): Promise<any> {
    try {
      const { data } = await api.post(`/new/user-approvals/${payload.id}/status`, payload);
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  async updateBulkStatus(payload: UpdateUserApprovalBulkStatusPayload): Promise<any> {
    try {
      const { data } = await api.post('/new/user-approvals/bulk-status', payload);
      return data;
    } catch (error: any) {
      throw error;
    }
  }
}
