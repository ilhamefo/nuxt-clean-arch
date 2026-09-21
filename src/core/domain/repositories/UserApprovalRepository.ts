import type {
  UserApprovalQueryParams,
  UserApprovalsResponse,
  UpdateUserApprovalStatusPayload,
  UpdateUserApprovalBulkStatusPayload,
} from '../entities/UserApproval';

export interface UserApprovalRepository {
  getUserApprovals(params?: UserApprovalQueryParams): Promise<UserApprovalsResponse>;
  updateStatus(payload: UpdateUserApprovalStatusPayload): Promise<any>;
  updateBulkStatus(payload: UpdateUserApprovalBulkStatusPayload): Promise<any>;
}
