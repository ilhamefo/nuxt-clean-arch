import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  PindahRequest,
  PindahRequestQueryParams,
  UpdatePindahRequestStatusPayload,
} from '../../core/domain/entities/PindahRequest';
import { PindahRequestService } from '../../infrastructure/services/PindahRequestService';

const pindahRequestService = new PindahRequestService();

export const usePindahRequestStore = defineStore('pindahRequest', () => {
  const requests = ref<PindahRequest[]>([]);
  const total = ref(0);
  const page = ref(1);
  const limit = ref(10);
  const statusFilter = ref<number | ''>('');
  const searchQuery = ref('');
  const orderBy = ref<string>('created_at');
  const orderDirection = ref<'asc' | 'desc'>('desc');
  const loading = ref(false);
  const actionLoadingId = ref<string | null>(null);
  const error = ref<string | null>(null);

  async function fetchRequests(customParams?: Partial<PindahRequestQueryParams>) {
    loading.value = true;
    error.value = null;

    try {
      const queryParams: PindahRequestQueryParams = {
        page: customParams?.page ?? page.value,
        limit: customParams?.limit ?? limit.value,
        status: customParams?.status !== undefined ? customParams.status : statusFilter.value,
        search: customParams?.search !== undefined ? customParams.search : searchQuery.value,
        order_by: customParams?.order_by ?? orderBy.value,
        order_direction: customParams?.order_direction ?? orderDirection.value,
      };

      const response = await pindahRequestService.getPindahRequests(queryParams);

      requests.value = response?.data ?? [];
      total.value = response?.total ?? 0;
      page.value = response?.page ?? queryParams.page ?? 1;
      limit.value = response?.page_size ?? queryParams.limit ?? 10;
      return response;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message || 'Gagal memuat data mutasi user';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateStatus(payload: UpdatePindahRequestStatusPayload) {
    actionLoadingId.value = payload.id;
    error.value = null;

    try {
      const response = await pindahRequestService.updateStatus(payload);
      // Refresh current page after status update
      await fetchRequests();
      return response;
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message || 'Gagal mengubah status mutasi user';
      throw err;
    } finally {
      actionLoadingId.value = null;
    }
  }

  function setPage(newPage: number) {
    page.value = newPage;
    return fetchRequests({ page: newPage });
  }

  function setStatus(status: number | '') {
    statusFilter.value = status;
    page.value = 1;
    return fetchRequests({ page: 1, status });
  }

  function setSearch(query: string) {
    searchQuery.value = query;
    page.value = 1;
    return fetchRequests({ page: 1, search: query });
  }

  function setSorting(columnKey: string, direction?: 'asc' | 'desc') {
    if (orderBy.value === columnKey) {
      orderDirection.value = direction ?? (orderDirection.value === 'asc' ? 'desc' : 'asc');
    } else {
      orderBy.value = columnKey;
      orderDirection.value = direction ?? (columnKey === 'created_at' || columnKey === 'updated_at' ? 'desc' : 'asc');
    }
    page.value = 1;
    return fetchRequests({
      page: 1,
      order_by: orderBy.value,
      order_direction: orderDirection.value,
    });
  }

  function resetFilters() {
    searchQuery.value = '';
    statusFilter.value = '';
    orderBy.value = 'created_at';
    orderDirection.value = 'desc';
    page.value = 1;
    return fetchRequests({
      page: 1,
      search: '',
      status: '',
      order_by: 'created_at',
      order_direction: 'desc',
    });
  }

  return {
    requests,
    total,
    page,
    limit,
    statusFilter,
    searchQuery,
    orderBy,
    orderDirection,
    loading,
    actionLoadingId,
    error,
    fetchRequests,
    updateStatus,
    setPage,
    setStatus,
    setSearch,
    setSorting,
    resetFilters,
  };
});

