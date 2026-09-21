import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  UserApprovalItem,
  UserApprovalQueryParams,
  UpdateUserApprovalStatusPayload,
  UpdateUserApprovalBulkStatusPayload,
} from '../../core/domain/entities/UserApproval';
import { UserApprovalService } from '../../infrastructure/services/UserApprovalService';

const userApprovalService = new UserApprovalService();

export const useUserApprovalStore = defineStore('userApproval', () => {
  const approvals = ref<UserApprovalItem[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const statusFilter = ref<number | ''>('');
  const levelFilter = ref<number | ''>('');
  const searchQuery = ref('');
  const orderBy = ref<string>('created_at');
  const orderDirection = ref<'asc' | 'desc'>('desc');
  const loading = ref(false);
  const actionLoadingId = ref<string | null>(null);
  const isBulkLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchApprovals(customParams?: Partial<UserApprovalQueryParams>) {
    loading.value = true;
    error.value = null;

    try {
      const queryParams: UserApprovalQueryParams = {
        page: customParams?.page ?? page.value,
        limit: customParams?.limit ?? limit.value,
        status: customParams?.status !== undefined ? customParams.status : statusFilter.value,
        level: customParams?.level !== undefined ? customParams.level : levelFilter.value,
        search: customParams?.search !== undefined ? customParams.search : searchQuery.value,
        order_by: customParams?.order_by ?? orderBy.value,
        order_direction: customParams?.order_direction ?? orderDirection.value,
      };

      const response = await userApprovalService.getUserApprovals(queryParams);

      approvals.value = response?.data ?? [];
      total.value = response?.total ?? 0;
      page.value = response?.page ?? queryParams.page ?? 1;
      limit.value = response?.page_size ?? queryParams.limit ?? 10;
      return response;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message || 'Gagal memuat data user approval';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateStatus(payload: UpdateUserApprovalStatusPayload) {
    actionLoadingId.value = payload.id;
    error.value = null;

    try {
      const response = await userApprovalService.updateStatus(payload);
      // Refresh current page after status update
      await fetchApprovals();
      return response;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message || 'Gagal mengubah status user approval';
      throw err;
    } finally {
      actionLoadingId.value = null;
    }
  }

  async function updateBulkStatus(payload: UpdateUserApprovalBulkStatusPayload) {
    isBulkLoading.value = true;
    error.value = null;

    try {
      const response = await userApprovalService.updateBulkStatus(payload);
      // Refresh current page after status update
      await fetchApprovals();
      return response;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message || 'Gagal mengubah status bulk user approval';
      throw err;
    } finally {
      isBulkLoading.value = false;
    }
  }

  function setPage(newPage: number) {
    page.value = newPage;
    return fetchApprovals({ page: newPage });
  }

  function setStatus(status: number | '') {
    statusFilter.value = status;
    page.value = 1;
    return fetchApprovals({ page: 1, status });
  }

  function setLevel(level: number | '') {
    levelFilter.value = level;
    page.value = 1;
    return fetchApprovals({ page: 1, level });
  }

  function setSearch(query: string) {
    searchQuery.value = query;
    page.value = 1;
    return fetchApprovals({ page: 1, search: query });
  }

  function setSorting(columnKey: string, direction?: 'asc' | 'desc') {
    if (orderBy.value === columnKey) {
      orderDirection.value = direction ?? (orderDirection.value === 'asc' ? 'desc' : 'asc');
    } else {
      orderBy.value = columnKey;
      orderDirection.value = direction ?? (columnKey === 'created_at' || columnKey === 'updated_at' ? 'desc' : 'asc');
    }
    page.value = 1;
    return fetchApprovals({
      page: 1,
      order_by: orderBy.value,
      order_direction: orderDirection.value,
    });
  }

  function resetFilters() {
    searchQuery.value = '';
    statusFilter.value = '';
    levelFilter.value = '';
    orderBy.value = 'created_at';
    orderDirection.value = 'desc';
    page.value = 1;
    return fetchApprovals({
      page: 1,
      search: '',
      status: '',
      level: '',
      order_by: 'created_at',
      order_direction: 'desc',
    });
  }

  return {
    approvals,
    total,
    page,
    limit,
    statusFilter,
    levelFilter,
    searchQuery,
    orderBy,
    orderDirection,
    loading,
    actionLoadingId,
    isBulkLoading,
    error,
    fetchApprovals,
    updateStatus,
    updateBulkStatus,
    setPage,
    setStatus,
    setLevel,
    setSearch,
    setSorting,
    resetFilters,
  };
});
