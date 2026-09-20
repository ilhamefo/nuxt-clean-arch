import type {
  PindahRequestQueryParams,
  PindahRequestsResponse,
  UpdatePindahRequestStatusPayload,
} from '../../core/domain/entities/PindahRequest';
import type { PindahRequestRepository } from '../../core/domain/repositories/PindahRequestRepository';
import api from '../api/ApiClient';

export class PindahRequestService implements PindahRequestRepository {
  async getPindahRequests(params?: PindahRequestQueryParams): Promise<PindahRequestsResponse> {
    try {
      const cleanParams: Record<string, any> = {};
      if (params) {
        if (params.page !== undefined) cleanParams.page = params.page;
        if (params.limit !== undefined) cleanParams.limit = params.limit;
        if (params.status !== undefined && params.status !== '') cleanParams.status = params.status;
        if (params.search !== undefined && params.search.trim() !== '') cleanParams.search = params.search.trim();
        if (params.user_id !== undefined && params.user_id !== '') cleanParams.user_id = params.user_id;
        if (params.order_by !== undefined && params.order_by !== '') cleanParams.order_by = params.order_by;
        if (params.order_direction !== undefined && params.order_direction !== '') {
          cleanParams.order_direction = params.order_direction;
        }
      }

      const { data } = await api.get('/new/pindah-requests', { params: cleanParams });
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  async updateStatus(payload: UpdatePindahRequestStatusPayload): Promise<any> {
    try {
      const { data } = await api.post(`/new/pindah-requests/${payload.id}/status`, payload);
      return data;
    } catch (error: any) {
      throw error;
    }
  }
}
