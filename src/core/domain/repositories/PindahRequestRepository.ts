import type {
  PindahRequestQueryParams,
  PindahRequestsResponse,
  UpdatePindahRequestStatusPayload,
} from '../entities/PindahRequest';

export interface PindahRequestRepository {
  getPindahRequests(params?: PindahRequestQueryParams): Promise<PindahRequestsResponse>;
  updateStatus(payload: UpdatePindahRequestStatusPayload): Promise<any>;
}
