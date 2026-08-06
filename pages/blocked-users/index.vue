<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto flex min-h-screen w-full max-w-6xl items-start justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 sm:p-8">
        <div class="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">User Management</p>
            <h1 class="mt-2 text-3xl font-bold text-gray-900">Blocked Users</h1>
            <p class="mt-2 max-w-2xl text-sm text-gray-600">
              Cari user dan tampilkan hanya akun yang berstatus blocked.
            </p>
          </div>

        </div>

        <div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label class="mb-2 block text-sm font-semibold text-gray-700">Search User</label>
            <input v-model="searchQuery" type="text" placeholder="Cari nama, email, atau username..."
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
            <p class="mt-2 text-xs text-gray-500">
              Hasil yang tampil otomatis difilter hanya user dengan status blocked.
            </p>
          </div>

          <div class="flex gap-3">
            <button type="button" @click="runSearch"
              class="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
              :disabled="loading">
              {{ loading ? 'Mencari...' : 'Cari' }}
            </button>
            <button type="button" @click="clearSearch"
              class="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60"
              :disabled="loading">
              Reset
            </button>
          </div>
        </div>

        <div class="mt-8">
          <div v-if="loading && !blockedUsers.length"
            class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-gray-500">
            Memuat data blocked users...
          </div>

          <div v-else-if="!blockedUsers.length"
            class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
            <p class="text-lg font-semibold text-gray-900">Belum ada user blocked yang ditemukan</p>
            <p class="mt-2 text-sm text-gray-600">
              Coba masukkan kata kunci pencarian untuk memuat user, lalu sistem akan menampilkan yang berstatus blocked.
            </p>
          </div>

          <div v-else class="space-y-4">
            <article v-for="user in blockedUsers" :key="user.id"
              class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-red-200 hover:shadow-md">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-3">
                    <h2 class="text-lg font-bold text-gray-900">{{ user.full_name || 'Unnamed User' }}</h2>
                    <span class="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      Blocked
                    </span>
                    <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      Level {{ user.level ?? '-' }}
                    </span>
                  </div>

                  <div class="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                    <p><span class="font-semibold text-gray-800">Username:</span> {{ user.username || '-' }}</p>
                    <p><span class="font-semibold text-gray-800">Email:</span> {{ user.email || '-' }}</p>
                    <p><span class="font-semibold text-gray-800">Unit:</span> {{ user.unit_name || user.unit_code || '-'
                    }}</p>
                    <p><span class="font-semibold text-gray-800">Jabatan:</span> {{ user.jabatan || '-' }}</p>
                  </div>

                  <div class="mt-4 flex flex-wrap gap-2 ">
                    <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Status: {{ user.status ?? '-' }}
                    </span>
                    <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      Updated: {{ formatDate(user.updated_at) }}
                    </span>
                    <!--  -->
                    <label class="inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer" v-model="user.is_blocked"
                        @change="onToggleIsBlocked(user)" />

                      <div class="relative w-11 h-6 bg-gray-300 rounded-full
                        peer-checked:bg-blue-600
                        transition-colors duration-300
                        after:content-['']
                        after:absolute
                        after:top-0.5
                        after:left-0.5
                        after:w-5
                        after:h-5
                        after:bg-white
                        after:rounded-full
                        after:transition-transform
                        after:duration-300
                        peer-checked:after:translate-x-5">
                      </div>

                      <span class="ml-3 text-sm font-medium text-gray-900"
                        v-text="user.is_blocked ? 'Blocked' : 'Not Blocked'">
                      </span>
                    </label>
                  </div>
                </div>

                <div class="rounded-xl bg-gray-50 p-4 text-sm text-gray-600 ring-1 ring-gray-200 lg:w-56">
                  <p class="font-semibold text-gray-900">Roles</p>
                  <p class="mt-2 leading-6" v-if="user.roles && user.roles.length">
                    <span v-for="role in user.roles" :key="role.id"
                      class="mr-2 inline-flex rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                      {{ role.name }}
                    </span>
                  </p>
                  <p v-else class="mt-2 text-gray-500">Tidak ada role</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useUserStore } from '../../src/presentation/stores/user';
import type { UserVCC } from '~/core/domain/entities/User';

const userStore = useUserStore();
const loading = ref(false);
const searchQuery = ref('');
const snackbar = useSnackbar();

const blockedUsers = computed(() => userStore.searchResults);

const runSearch = async () => {
  const keyword = searchQuery.value.trim();

  loading.value = true;

  try {
    await userStore.searchUsersNew({ keyword, is_blocked: true });
  } catch (error) {
    console.error('Blocked users search error:', error);
  } finally {
    loading.value = false;
  }
};

const onSearch = useDebounceFn(runSearch, 300);

const clearSearch = () => {
  searchQuery.value = '';
  userStore.searchResults = [];
};

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

watch(searchQuery, () => {
  if (!searchQuery.value.trim()) {
    userStore.searchResults = [];
    return;
  }

  onSearch();
});

onMounted(async () => {
  await runSearch();
});

const onToggleIsBlocked = async (user: UserVCC) => {
  const previousBlockedState = !user.is_blocked;

  loading.value = true;

  try {
    const response = await userStore.updateIsBlocked({
      id: user.id,
      is_blocked: user.is_blocked,
    });

    if (response && response.status === 200) {
      snackbar.add({
        type: 'success',
        text: 'User updated successfully',
        title: 'Success',
      });
    } else if (response) {
      user.is_blocked = previousBlockedState;
      snackbar.add({
        type: 'error',
        text: response.message || `Update failed with status: ${response.data}`,
        title: 'Error',
      });
    } else {
      user.is_blocked = previousBlockedState;
      snackbar.add({
        type: 'error',
        text: 'No response received from server',
        title: 'Error',
      });
    }
  } catch (error: any) {
    console.error('Update error:', error);
    user.is_blocked = previousBlockedState;

    let errorMessage = 'Failed to update user';
    let statusCode = 'Unknown';

    if (error.response) {
      statusCode = error.response.status || 'Unknown';
      errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${statusCode}`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    snackbar.add({
      type: 'error',
      text: `${errorMessage} (Status: ${statusCode})`,
      title: 'Error',
    });
  } finally {
    loading.value = false;
  }
}
</script>