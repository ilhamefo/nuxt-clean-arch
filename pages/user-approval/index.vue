<template>
  <div class="min-h-screen bg-slate-50/70 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="rounded-2xl bg-white border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <!-- Header -->
        <div class="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#28536B]/10 text-[#28536B] border border-[#28536B]/20">
                <span class="w-1.5 h-1.5 rounded-full bg-[#28536B]"></span>
                Total {{ store.total }} Pengajuan
              </span>
            </div>
            <h1 class="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#28536B]">
              User Approval
            </h1>
            <p class="mt-1 text-sm text-slate-500 max-w-2xl">
              Daftar permohonan registrasi user, persetujuan akun, penugasan level organisasi, unit kerja, dan peran.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="handleRefresh"
              :disabled="store.loading"
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#28536B] hover:bg-[#204458] rounded-xl transition-all duration-150 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <svg
                :class="['w-4 h-4 text-white transition-transform duration-500', store.loading ? 'animate-spin' : '']"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <!-- Search Input -->
          <div class="relative flex-1 max-w-lg">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <svg class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              v-model="searchInput"
              type="text"
              placeholder="Cari nama user, email, username, NIP..."
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#28536B] focus:bg-white focus:ring-2 focus:ring-[#28536B]/20"
            />
            <button
              v-if="searchInput"
              @click="searchInput = ''"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Status Filters, Level Filters, and Page Size -->
          <div class="flex flex-wrap items-center gap-3">
            <!-- Level Filter Dropdown -->
            <div class="flex items-center gap-2 text-xs font-medium text-slate-500">
              <select
                id="levelFilter"
                v-model="levelFilter"
                @change="onChangeLevel"
                class="rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-[#28536B] focus:ring-2 focus:ring-[#28536B]/20"
              >
                <option value="">Semua Level</option>
                <option :value="0">Level 0 (Pusat)</option>
                <option :value="1">Level 1 (Induk)</option>
                <option :value="2">Level 2 (Area/UP3)</option>
                <option :value="3">Level 3 (Unit/ULP)</option>
              </select>
            </div>

            <!-- Status Tabs -->
            <div class="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold">
              <button
                type="button"
                @click="onSelectStatus('')"
                :class="[
                  statusFilter === ''
                    ? 'bg-[#28536B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#28536B] hover:bg-white/60',
                  'px-3.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer'
                ]"
              >
                Semua
              </button>
              <button
                type="button"
                @click="onSelectStatus(0)"
                :class="[
                  statusFilter === 0
                    ? 'bg-[#FFF3EB] text-[#A24D18] border border-[#FFC49B] shadow-xs'
                    : 'text-slate-600 hover:text-[#A24D18] hover:bg-white/60 border border-transparent',
                  'px-3.5 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer'
                ]"
              >
                <span class="w-2 h-2 rounded-full bg-[#FFC49B]"></span>
                Menunggu
              </button>
              <button
                type="button"
                @click="onSelectStatus(1)"
                :class="[
                  statusFilter === 1
                    ? 'bg-[#EDF7EC] text-[#346034] border border-[#8FB78F] shadow-xs'
                    : 'text-slate-600 hover:text-[#346034] hover:bg-white/60 border border-transparent',
                  'px-3.5 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer'
                ]"
              >
                <span class="w-2 h-2 rounded-full bg-[#8FB78F]"></span>
                Disetujui
              </button>
              <button
                type="button"
                @click="onSelectStatus(2)"
                :class="[
                  statusFilter === 2
                    ? 'bg-[#FDF0F4] text-[#8E2542] border border-[#F3A5BC] shadow-xs'
                    : 'text-slate-600 hover:text-[#8E2542] hover:bg-white/60 border border-transparent',
                  'px-3.5 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer'
                ]"
              >
                <span class="w-2 h-2 rounded-full bg-[#F3A5BC]"></span>
                Ditolak
              </button>
            </div>

            <!-- Page Size Dropdown -->
            <div class="flex items-center gap-2 text-xs font-medium text-slate-500">
              <select
                id="pageSize"
                v-model="selectedLimit"
                @change="onChangeLimit"
                class="rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-medium text-slate-700 outline-none focus:border-[#28536B] focus:ring-2 focus:ring-[#28536B]/20"
              >
                <option :value="10">10 / hal</option>
                <option :value="25">25 / hal</option>
                <option :value="50">50 / hal</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Bulk Selection Alert / Banner when items selected -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="selectedUserIds.length > 0"
            class="mt-4 p-3.5 bg-[#28536B]/10 border border-[#28536B]/20 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div class="flex items-center gap-2.5">
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#28536B] text-white text-xs font-bold">
                {{ selectedUserIds.length }}
              </span>
              <span class="text-xs font-semibold text-[#28536B]">
                {{ selectedUserIds.length }} user menunggu persetujuan dipilih
              </span>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                @click="openBulkApproveModal"
                :disabled="store.isBulkLoading"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#8FB78F] hover:bg-[#749E74] rounded-lg shadow-xs transition duration-150 disabled:opacity-50 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Setujui Massal ({{ selectedUserIds.length }})</span>
              </button>

              <button
                type="button"
                @click="openBulkRejectModal"
                :disabled="store.isBulkLoading"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#8E2542] bg-[#FDF0F4] hover:bg-[#FACEE0] border border-[#F3A5BC] rounded-lg transition duration-150 disabled:opacity-50 cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Tolak Massal ({{ selectedUserIds.length }})</span>
              </button>

              <button
                type="button"
                @click="clearSelection"
                class="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition cursor-pointer"
              >
                Batal Pilihan
              </button>
            </div>
          </div>
        </transition>

        <!-- Table View -->
        <div class="mt-6 overflow-hidden rounded-2xl border border-[#B4CCCF]/40 bg-white shadow-xs">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead class="bg-slate-50/90 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <!-- Checkbox Column Header -->
                  <th scope="col" class="py-3.5 pl-5 pr-2 w-10 text-center">
                    <label class="inline-flex items-center justify-center cursor-pointer">
                      <input
                        ref="selectAllCheckboxRef"
                        type="checkbox"
                        :checked="isAllSelected"
                        :disabled="selectableUsers.length === 0 || store.loading"
                        @change="toggleSelectAll"
                        class="w-4 h-4 rounded border-slate-300 text-[#28536B] focus:ring-[#28536B]/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        title="Pilih semua user menunggu pada halaman ini"
                      />
                    </label>
                  </th>

                  <th
                    v-for="col in tableColumns"
                    :key="col.key"
                    scope="col"
                    :class="[
                      col.headerClass,
                      col.sortable ? 'cursor-pointer select-none group transition-colors duration-150' : '',
                      col.sortable && store.orderBy === col.key
                        ? 'bg-[#28536B]/5 text-[#28536B]'
                        : (col.sortable ? 'hover:bg-slate-100/70 text-slate-600' : 'text-slate-500')
                    ]"
                    @click="col.sortable ? handleSort(col.key) : undefined"
                    :title="col.sortable ? `Urutkan berdasarkan ${col.label}` : undefined"
                  >
                    <div :class="['flex items-center gap-1.5', col.align === 'right' ? 'justify-end' : '']">
                      <span :class="col.sortable && store.orderBy === col.key ? 'font-bold text-[#28536B]' : 'group-hover:text-[#28536B]'">
                        {{ col.label }}
                      </span>
                      <span v-if="col.sortable" class="inline-flex flex-col">
                        <svg
                          v-if="store.orderBy === col.key && store.orderDirection === 'asc'"
                          class="w-3.5 h-3.5 text-[#28536B]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                        <svg
                          v-else-if="store.orderBy === col.key && store.orderDirection === 'desc'"
                          class="w-3.5 h-3.5 text-[#28536B]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2.5"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                        <svg
                          v-else
                          class="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                <!-- Skeleton Loading -->
                <tr v-if="store.loading && !store.approvals.length" v-for="i in 5" :key="'skeleton-' + i" class="animate-pulse">
                  <td class="py-4 pl-5 pr-2"><div class="h-4 w-4 rounded bg-slate-200 mx-auto"></div></td>
                  <td class="py-4 pl-4 pr-4">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 rounded-full bg-slate-200"></div>
                      <div class="space-y-2">
                        <div class="h-4 w-32 rounded bg-slate-200"></div>
                        <div class="h-3 w-24 rounded bg-slate-100"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4"><div class="h-4 w-28 rounded bg-slate-200"></div></td>
                  <td class="px-4 py-4"><div class="h-4 w-24 rounded bg-slate-200"></div></td>
                  <td class="px-4 py-4"><div class="h-4 w-20 rounded bg-slate-200"></div></td>
                  <td class="px-4 py-4"><div class="h-6 w-20 rounded-full bg-slate-200"></div></td>
                  <td class="px-4 py-4"><div class="h-4 w-24 rounded bg-slate-200"></div></td>
                  <td class="py-4 pl-4 pr-6 text-right"><div class="inline-block h-8 w-24 rounded-lg bg-slate-200"></div></td>
                </tr>

                <!-- Empty State -->
                <tr v-else-if="!store.loading && !store.approvals.length">
                  <td :colspan="tableColumns.length + 1" class="py-12 text-center">
                    <div class="flex flex-col items-center justify-center">
                      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                        <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                      </div>
                      <p class="text-base font-bold text-slate-800">Tidak ada data user approval</p>
                      <p class="text-xs text-slate-500 mt-1 max-w-sm">
                        Tidak ditemukan permohonan registrasi user dengan filter yang dipilih.
                      </p>
                      <button
                        type="button"
                        @click="handleReset"
                        class="mt-4 px-4 py-2 text-xs font-semibold text-[#28536B] bg-[#28536B]/10 hover:bg-[#28536B]/20 rounded-xl transition cursor-pointer"
                      >
                        Reset Filter & Pencarian
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Data Rows -->
                <tr
                  v-else
                  v-for="item in store.approvals"
                  :key="item.id"
                  :class="[
                    selectedUserIds.includes(item.id) ? 'bg-[#28536B]/5' : 'hover:bg-slate-50/70',
                    'transition-colors duration-150'
                  ]"
                >
                  <!-- Checkbox Row Cell -->
                  <td class="py-4 pl-5 pr-2 w-10 text-center">
                    <label v-if="item.status === 0" class="inline-flex items-center justify-center cursor-pointer">
                      <input
                        type="checkbox"
                        :value="item.id"
                        v-model="selectedUserIds"
                        class="w-4 h-4 rounded border-slate-300 text-[#28536B] focus:ring-[#28536B]/20 cursor-pointer"
                      />
                    </label>
                    <span v-else class="inline-block w-4 h-4 rounded border border-slate-200 bg-slate-100 opacity-40 cursor-not-allowed mx-auto" title="Sudah diproses"></span>
                  </td>

                  <!-- User Info -->
                  <td class="py-4 pl-4 pr-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <div
                        :class="[
                          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2 ring-white shadow-xs',
                          getUserAvatarBg(item.full_name || item.username || item.email)
                        ]"
                      >
                        {{ getInitials(item.full_name || item.username || 'User') }}
                      </div>
                      <div class="min-w-0">
                        <div class="text-sm font-bold text-slate-900 truncate">
                          {{ item.full_name || 'Unnamed User' }}
                        </div>
                        <div class="text-xs text-slate-500 truncate mt-0.5">
                          {{ item.email || item.username || '-' }}
                        </div>
                        <div v-if="item.phone" class="text-[11px] text-slate-400 truncate mt-0.5">
                          📞 {{ item.phone }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Level & Unit -->
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex flex-col gap-1">
                      <span class="inline-flex items-center gap-1 text-xs font-semibold text-[#28536B]">
                        {{ formatLevelName(item.level) }}
                      </span>
                      <span class="text-xs text-slate-500">
                        {{ item.unit_name || item.unit_code || 'Pusat / Belum diatur' }}
                      </span>
                    </div>
                  </td>

                  <!-- Jabatan & NIP -->
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-xs font-medium text-slate-800">
                      {{ item.jabatan || '-' }}
                    </div>
                    <div class="text-[11px] text-slate-500 mt-0.5 font-mono">
                      NIP: {{ item.nip || '-' }}
                    </div>
                  </td>

                  <!-- Roles -->
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div v-if="item.roles && item.roles.length" class="flex flex-wrap gap-1 max-w-[200px]">
                      <span
                        v-for="role in item.roles"
                        :key="role.id"
                        class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60"
                      >
                        {{ role.name }}
                      </span>
                    </div>
                    <span v-else class="text-xs text-slate-400 italic">Belum ada role</span>
                  </td>

                  <!-- Status Badge -->
                  <td class="px-4 py-4 whitespace-nowrap">
                    <!-- Status 0: Menunggu (Peach Palette) -->
                    <span
                      v-if="item.status === 0"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF3EB] text-[#A24D18] border border-[#FFC49B]"
                    >
                      <span class="w-1.5 h-1.5 rounded-full bg-[#FFC49B] animate-pulse"></span>
                      Menunggu
                    </span>

                    <!-- Status 1: Disetujui (Matcha & Pistachio Palette) -->
                    <span
                      v-else-if="item.status === 1"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EDF7EC] text-[#346034] border border-[#8FB78F]"
                    >
                      <svg class="w-3.5 h-3.5 text-[#8FB78F]" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      Disetujui
                    </span>

                    <!-- Status 2: Ditolak (Orchid Palette) -->
                    <span
                      v-else-if="item.status === 2"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF0F4] text-[#8E2542] border border-[#F3A5BC]"
                    >
                      <svg class="w-3.5 h-3.5 text-[#F3A5BC]" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                      Ditolak
                    </span>

                    <span
                      v-else
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600"
                    >
                      Status {{ item.status }}
                    </span>
                  </td>

                  <!-- Tanggal Registrasi -->
                  <td class="px-4 py-4 whitespace-nowrap text-xs text-slate-500">
                    {{ formatDate(item.created_at) }}
                  </td>

                  <!-- Aksi -->
                  <td class="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                    <div v-if="item.status === 0" class="inline-flex items-center gap-2">
                      <!-- Setujui Button (Matcha Theme) -->
                      <button
                        type="button"
                        @click="openApproveModal(item)"
                        :disabled="store.actionLoadingId === item.id || store.isBulkLoading"
                        class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#8FB78F] hover:bg-[#749E74] rounded-lg shadow-xs transition duration-150 disabled:opacity-50 cursor-pointer"
                        title="Setujui Registrasi"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Setujui</span>
                      </button>

                      <!-- Tolak Button (Orchid Theme) -->
                      <button
                        type="button"
                        @click="openRejectModal(item)"
                        :disabled="store.actionLoadingId === item.id || store.isBulkLoading"
                        class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#8E2542] bg-[#FDF0F4] hover:bg-[#FACEE0] border border-[#F3A5BC] rounded-lg transition duration-150 disabled:opacity-50 cursor-pointer"
                        title="Tolak Registrasi"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Tolak</span>
                      </button>
                    </div>

                    <div v-else class="text-xs text-slate-400 font-medium">
                      <span v-if="item.status === 1" class="inline-flex items-center gap-1 text-[#346034]">
                        <svg class="w-3.5 h-3.5 text-[#8FB78F]" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                        Disetujui
                      </span>
                      <span v-else-if="item.status === 2" class="inline-flex items-center gap-1 text-[#8E2542]">
                        <svg class="w-3.5 h-3.5 text-[#F3A5BC]" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        Ditolak
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <div class="text-xs text-slate-600">
              Menampilkan
              <span class="font-bold text-slate-800">{{ startRecord }}</span>
              sampai
              <span class="font-bold text-slate-800">{{ endRecord }}</span>
              dari
              <span class="font-bold text-slate-800">{{ store.total }}</span>
              user
            </div>

            <!-- Page Buttons -->
            <div class="flex items-center gap-1 self-center sm:self-auto">
              <button
                type="button"
                @click="onGoToPage(store.page - 1)"
                :disabled="store.page <= 1 || store.loading"
                class="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Sebelumnya
              </button>

              <template v-for="(pageNum, idx) in visiblePages" :key="'page-' + idx">
                <span v-if="pageNum === '...'" class="px-2 text-xs text-slate-400">...</span>
                <button
                  v-else
                  type="button"
                  @click="onGoToPage(Number(pageNum))"
                  :disabled="store.loading"
                  :class="[
                    store.page === pageNum
                      ? 'bg-[#28536B] text-white font-bold border-[#28536B] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-medium',
                    'w-8 h-8 flex items-center justify-center text-xs border rounded-lg transition cursor-pointer'
                  ]"
                >
                  {{ pageNum }}
                </button>
              </template>

              <button
                type="button"
                @click="onGoToPage(store.page + 1)"
                :disabled="store.page >= totalPages || store.loading"
                class="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve User Modal -->
    <div
      v-if="approveModalState.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity overflow-y-auto"
    >
      <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 my-8">
        <!-- Modal Header -->
        <div class="flex items-start gap-3.5 border-b border-slate-100 pb-4">
          <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#EDF7EC] text-[#346034] border border-[#8FB78F]/30">
            <svg class="h-6 w-6 text-[#8FB78F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-slate-900">
              Setujui Registrasi User
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Tentukan level organisasi, unit kerja, peran (role), dan jabatan untuk user ini.
            </p>
          </div>
          <button
            type="button"
            @click="closeApproveModal"
            class="text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- User Summary -->
        <div v-if="approveModalState.item" class="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
          <div
            :class="[
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2 ring-white shadow-xs',
              getUserAvatarBg(approveModalState.item.full_name || approveModalState.item.username)
            ]"
          >
            {{ getInitials(approveModalState.item.full_name || approveModalState.item.username) }}
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-bold text-slate-900 truncate">
              {{ approveModalState.item.full_name || 'Unnamed User' }}
            </div>
            <div class="text-xs text-slate-500 truncate">
              {{ approveModalState.item.email || approveModalState.item.username }}
            </div>
          </div>
        </div>

        <!-- Form Inputs Part 1 -->
        <div class="mt-4 space-y-4">
          <!-- Level -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="approve-level">
              Level Organisasi <span class="text-rose-500">*</span>
            </label>
            <select
              id="approve-level"
              v-model="approveForm.level"
              class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#28536B] focus:ring-2 focus:ring-[#28536B]/20"
            >
              <option :value="0">Level 0 (Pusat)</option>
              <option :value="1">Level 1 (Induk / UPI)</option>
              <option :value="2">Level 2 (Area / UP3)</option>
              <option :value="3">Level 3 (Unit / ULP)</option>
            </select>
          </div>

          <!-- Unit Code / Name -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">
              Unit Kerja
            </label>
            <ClientOnly>
              <VSelect
                key="approve-unit-select"
                :options="userStore.units"
                :placeholder="'Pilih Unit Kerja...'"
                label="label"
                :reduce="(unit: Unit) => unit"
                v-model="selectedUnit"
                :filterable="true"
                :searchable="true"
                :loading="userStore.loading"
                :clearSearchOnSelect="false"
                :multiple="false"
                class="v-select text-xs"
              />
              <template #fallback>
                <div class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-400">
                  Memuat data unit...
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Role Assignment -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">
              Penugasan Peran (Roles) <span class="text-rose-500">*</span>
            </label>
            <ClientOnly>
              <VSelect
                key="approve-roles-select"
                :options="userStore.roles"
                :placeholder="'Pilih satu atau beberapa role...'"
                label="name"
                :reduce="(role: Role) => role"
                v-model="selectedRoles"
                :filterable="true"
                :searchable="true"
                :loading="userStore.loading"
                :clearSearchOnSelect="true"
                :multiple="true"
                class="v-select text-xs"
              />
              <template #fallback>
                <div class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-400">
                  Memuat data role...
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Jabatan & NIP -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="approve-jabatan">
                Jabatan
              </label>
              <input
                id="approve-jabatan"
                type="text"
                v-model="approveForm.jabatan"
                placeholder="cth: Staff Operasional"
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#28536B] focus:ring-2 focus:ring-[#28536B]/20"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="approve-nip">
                NIP
              </label>
              <input
                id="approve-nip"
                type="text"
                v-model="approveForm.nip"
                placeholder="cth: 123456789"
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#28536B] focus:ring-2 focus:ring-[#28536B]/20"
              />
            </div>
          </div>
        </div>

        <p class="mt-4 text-xs text-slate-500 leading-relaxed">
          Tindakan ini akan menyetujui akun user dan menerapkan peran serta unit kerja yang dipilih secara otomatis.
        </p>

        <!-- Modal Actions -->
        <div class="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            @click="closeApproveModal"
            :disabled="isSubmittingModal"
            class="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            @click="confirmApproveUser"
            :disabled="isSubmittingModal"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#8FB78F] hover:bg-[#749E74] rounded-xl shadow-xs transition duration-150 disabled:opacity-50 cursor-pointer"
          >
            <svg v-if="isSubmittingModal" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmittingModal ? 'Menyimpan...' : 'Ya, Setujui Akun' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Confirmation Modal -->
    <div
      v-if="rejectModalState.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
    >
      <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <!-- Modal Header -->
        <div class="flex items-start gap-3.5">
          <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#FDF0F4] text-[#8E2542] border border-[#F3A5BC]/30">
            <svg class="h-6 w-6 text-[#8E2542]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">
              Tolak Registrasi User?
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Konfirmasi penolakan permohonan pendaftaran akun
            </p>
          </div>
        </div>

        <!-- Detail Box -->
        <div v-if="rejectModalState.item" class="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
          <div
            :class="[
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2 ring-white shadow-xs',
              getUserAvatarBg(rejectModalState.item.full_name || rejectModalState.item.username)
            ]"
          >
            {{ getInitials(rejectModalState.item.full_name || rejectModalState.item.username) }}
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-bold text-slate-900 truncate">
              {{ rejectModalState.item.full_name || 'Unnamed User' }}
            </div>
            <div class="text-xs text-slate-500 truncate">
              {{ rejectModalState.item.email || rejectModalState.item.username }}
            </div>
          </div>
        </div>

        <p class="mt-4 text-xs text-slate-600 leading-relaxed">
          Tindakan ini akan menolak registrasi user dan menandai permohonan akun sebagai <strong class="text-[#8E2542]">Ditolak</strong> di sistem.
        </p>

        <!-- Modal Actions -->
        <div class="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            @click="closeRejectModal"
            :disabled="isSubmittingModal"
            class="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            @click="confirmRejectUser"
            :disabled="isSubmittingModal"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#D04F73] hover:bg-[#AD3454] rounded-xl shadow-xs transition duration-150 disabled:opacity-50 cursor-pointer"
          >
            <svg v-if="isSubmittingModal" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmittingModal ? 'Memproses...' : 'Ya, Tolak' }}</span>
          </button>
        </div>
      </div>
    </div>
    <!-- Bulk Approve Modal (Option A) -->
    <div
      v-if="bulkApproveModalState.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity overflow-y-auto"
    >
      <div class="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 my-8 max-h-[90vh] flex flex-col">
        <!-- Modal Header -->
        <div class="flex items-start gap-3.5 border-b border-slate-100 pb-4">
          <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#EDF7EC] text-[#346034] border border-[#8FB78F]/30">
            <svg class="h-6 w-6 text-[#8FB78F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-slate-900">
              Setujui {{ selectedUsers.length }} User Sekaligus (Bulk Approve)
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Tentukan level organisasi, unit kerja, dan peran (roles) yang akan diterapkan ke seluruh user terpilih.
            </p>
          </div>
          <button
            type="button"
            @click="closeBulkApproveModal"
            class="text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="overflow-y-auto pr-1 flex-1">
          <!-- Selected Users Preview -->
          <div class="mt-4">
            <div class="text-xs font-semibold text-slate-700 mb-2">
              Daftar User Terpilih ({{ selectedUsers.length }})
            </div>
            <div class="max-h-36 overflow-y-auto rounded-xl border border-slate-200/80 bg-slate-50/50 p-2 divide-y divide-slate-100">
              <div
                v-for="user in selectedUsers"
                :key="'bulk-item-' + user.id"
                class="py-1.5 px-2 flex items-center justify-between gap-3 text-xs"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <div
                    :class="[
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      getUserAvatarBg(user.full_name || user.username)
                    ]"
                  >
                    {{ getInitials(user.full_name || user.username) }}
                  </div>
                  <div class="truncate">
                    <span class="font-semibold text-slate-800">{{ user.full_name || user.username }}</span>
                    <span class="text-slate-400 ml-1.5 text-[11px]">({{ user.email || user.username }})</span>
                  </div>
                </div>
                <div v-if="user.nip" class="text-[11px] text-slate-500 font-mono shrink-0">
                  NIP: {{ user.nip }}
                </div>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="mt-4 space-y-4">
            <!-- Level -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5" for="bulk-approve-level">
                Level Organisasi <span class="text-rose-500">*</span>
              </label>
              <select
                id="bulk-approve-level"
                v-model="bulkApproveForm.level"
                class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-[#28536B] focus:ring-2 focus:ring-[#28536B]/20"
              >
                <option :value="0">Level 0 (Pusat)</option>
                <option :value="1">Level 1 (Induk / UPI)</option>
                <option :value="2">Level 2 (Area / UP3)</option>
                <option :value="3">Level 3 (Unit / ULP)</option>
              </select>
            </div>

            <!-- Unit Code / Name -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Unit Kerja
              </label>
              <ClientOnly>
                <VSelect
                  key="bulk-approve-unit-select"
                  :options="userStore.units"
                  :placeholder="'Pilih Unit Kerja untuk seluruh user terpilih...'"
                  label="label"
                  :reduce="(unit: Unit) => unit"
                  v-model="bulkSelectedUnit"
                  :filterable="true"
                  :searchable="true"
                  :loading="userStore.loading"
                  :clearSearchOnSelect="false"
                  :multiple="false"
                  class="v-select text-xs"
                />
                <template #fallback>
                  <div class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-400">
                    Memuat data unit...
                  </div>
                </template>
              </ClientOnly>
            </div>
            <!-- Role Assignment (Required) -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                Penugasan Peran (Roles) <span class="text-rose-500">*</span>
              </label>
              <ClientOnly>
                <VSelect
                  key="bulk-approve-roles-select"
                  :options="userStore.roles"
                  :placeholder="'Pilih satu atau beberapa role untuk seluruh user terpilih...'"
                  label="name"
                  :reduce="(role: Role) => role"
                  v-model="bulkSelectedRoles"
                  :filterable="true"
                  :searchable="true"
                  :loading="userStore.loading"
                  :clearSearchOnSelect="true"
                  :multiple="true"
                  class="v-select text-xs"
                />
                <template #fallback>
                  <div class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-400">
                    Memuat data role...
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>

          <p class="mt-4 text-xs text-slate-500 leading-relaxed bg-amber-50/70 border border-amber-200/60 p-3 rounded-xl">
            💡 <strong>Catatan:</strong> Level, unit kerja, dan peran di atas akan diterapkan serentak ke <strong class="text-amber-800">{{ selectedUsers.length }} user</strong> terpilih, sementara data NIP dan Jabatan bawaan masing-masing user akan tetap dipertahankan.
          </p>
        </div>

        <!-- Modal Actions -->
        <div class="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            @click="closeBulkApproveModal"
            :disabled="isSubmittingModal || store.isBulkLoading"
            class="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            @click="confirmBulkApprove"
            :disabled="isSubmittingModal || store.isBulkLoading"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#8FB78F] hover:bg-[#749E74] rounded-xl shadow-xs transition duration-150 disabled:opacity-50 cursor-pointer"
          >
            <svg v-if="isSubmittingModal || store.isBulkLoading" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmittingModal || store.isBulkLoading ? 'Memproses Persetujuan...' : `Setujui ${selectedUsers.length} User` }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Reject Modal -->
    <div
      v-if="bulkRejectModalState.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
    >
      <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        <!-- Modal Header -->
        <div class="flex items-start gap-3.5 border-b border-slate-100 pb-4">
          <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#FDF0F4] text-[#8E2542] border border-[#F3A5BC]/30">
            <svg class="h-6 w-6 text-[#8E2542]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-slate-900">
              Tolak {{ selectedUsers.length }} User Sekaligus?
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Konfirmasi penolakan permohonan pendaftaran akun secara massal.
            </p>
          </div>
          <button
            type="button"
            @click="closeBulkRejectModal"
            class="text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="overflow-y-auto pr-1 flex-1 mt-4">
          <!-- Selected Users Preview -->
          <div>
            <div class="text-xs font-semibold text-slate-700 mb-2">
              Daftar User yang akan Ditolak ({{ selectedUsers.length }})
            </div>
            <div class="max-h-48 overflow-y-auto rounded-xl border border-rose-100 bg-rose-50/30 p-2 divide-y divide-rose-100/60">
              <div
                v-for="user in selectedUsers"
                :key="'bulk-reject-item-' + user.id"
                class="py-1.5 px-2 flex items-center justify-between gap-3 text-xs"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <div
                    :class="[
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      getUserAvatarBg(user.full_name || user.username)
                    ]"
                  >
                    {{ getInitials(user.full_name || user.username) }}
                  </div>
                  <div class="truncate">
                    <span class="font-semibold text-slate-800">{{ user.full_name || user.username }}</span>
                    <span class="text-slate-400 ml-1.5 text-[11px]">({{ user.email || user.username }})</span>
                  </div>
                </div>
                <div v-if="user.nip" class="text-[11px] text-slate-500 font-mono shrink-0">
                  NIP: {{ user.nip }}
                </div>
              </div>
            </div>
          </div>

          <p class="mt-4 text-xs text-slate-600 leading-relaxed">
            Tindakan ini akan menolak seluruh <strong class="text-[#8E2542]">{{ selectedUsers.length }} permohonan registrasi user</strong> terpilih dan menandai statusnya sebagai <strong class="text-[#8E2542]">Ditolak</strong> di sistem.
          </p>
        </div>

        <!-- Modal Actions -->
        <div class="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            @click="closeBulkRejectModal"
            :disabled="isSubmittingModal || store.isBulkLoading"
            class="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            @click="confirmBulkReject"
            :disabled="isSubmittingModal || store.isBulkLoading"
            class="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#D04F73] hover:bg-[#AD3454] rounded-xl shadow-xs transition duration-150 disabled:opacity-50 cursor-pointer"
          >
            <svg v-if="isSubmittingModal || store.isBulkLoading" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmittingModal || store.isBulkLoading ? 'Memproses...' : `Ya, Tolak ${selectedUsers.length} User` }}</span>
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useUserApprovalStore } from '../../src/presentation/stores/userApproval';
import { useUserStore } from '../../src/presentation/stores/user';
import type { UserApprovalItem } from '../../src/core/domain/entities/UserApproval';
import type { Role, Unit } from '../../src/core/domain/entities/User';

const store = useUserApprovalStore();
const userStore = useUserStore();
const snackbar = useSnackbar();

const searchInput = ref('');
const statusFilter = ref<number | ''>('');
const levelFilter = ref<number | ''>('');
const selectedLimit = ref(10);
const isSubmittingModal = ref(false);

// Multi-Selection State
const selectedUserIds = ref<string[]>([]);
const selectAllCheckboxRef = ref<HTMLInputElement | null>(null);

// Table Column Definitions
const tableColumns = [
  { key: 'full_name', label: 'User', headerClass: 'py-3.5 pl-4 pr-4', sortable: true },
  { key: 'level', label: 'Level & Unit', headerClass: 'px-4 py-3.5', sortable: true },
  { key: 'jabatan', label: 'Jabatan & NIP', headerClass: 'px-4 py-3.5', sortable: true },
  { key: 'roles', label: 'Peran (Role)', headerClass: 'px-4 py-3.5', sortable: false },
  { key: 'status', label: 'Status', headerClass: 'px-4 py-3.5', sortable: true },
  { key: 'created_at', label: 'Tanggal Registrasi', headerClass: 'px-4 py-3.5', sortable: true },
  { key: 'actions', label: 'Aksi', headerClass: 'py-3.5 pl-4 pr-6', align: 'right', sortable: false },
];

// Single Approve Modal State & Form
const approveModalState = reactive<{
  isOpen: boolean;
  item: UserApprovalItem | null;
}>({
  isOpen: false,
  item: null,
});

const selectedRoles = ref<Role[]>([]);
const selectedUnit = ref<Unit | null>(null);

const approveForm = reactive({
  level: 0,
  jabatan: '',
  nip: '',
  unit_code: '',
  unit_name: '',
});

// Single Reject Modal State
const rejectModalState = reactive<{
  isOpen: boolean;
  item: UserApprovalItem | null;
}>({
  isOpen: false,
  item: null,
});

// Bulk Approve Modal State & Form (Option A)
const bulkApproveModalState = reactive<{
  isOpen: boolean;
}>({
  isOpen: false,
});

const bulkSelectedRoles = ref<Role[]>([]);
const bulkSelectedUnit = ref<Unit | null>(null);
const bulkApproveForm = reactive({
  level: 0,
  unit_code: '',
  unit_name: '',
});

// Bulk Reject Modal State
const bulkRejectModalState = reactive<{
  isOpen: boolean;
}>({
  isOpen: false,
});

// Computeds for Selectable Pending Users
const selectableUsers = computed(() => {
  return store.approvals.filter((item) => item.status === 0);
});

const selectedUsers = computed(() => {
  return store.approvals.filter((item) => selectedUserIds.value.includes(item.id));
});

const isAllSelected = computed(() => {
  if (!selectableUsers.value.length) return false;
  return selectableUsers.value.every((u) => selectedUserIds.value.includes(u.id));
});

// Sync indeterminate state on the select-all checkbox
watch([selectedUserIds, selectableUsers], () => {
  if (selectAllCheckboxRef.value) {
    const totalSelectable = selectableUsers.value.length;
    const selectedCount = selectableUsers.value.filter((u) =>
      selectedUserIds.value.includes(u.id)
    ).length;

    selectAllCheckboxRef.value.indeterminate =
      selectedCount > 0 && selectedCount < totalSelectable;
  }
});

const toggleSelectAll = () => {
  const pendingIds = selectableUsers.value.map((u) => u.id);
  if (isAllSelected.value) {
    selectedUserIds.value = selectedUserIds.value.filter((id) => !pendingIds.includes(id));
  } else {
    const combined = new Set([...selectedUserIds.value, ...pendingIds]);
    selectedUserIds.value = Array.from(combined);
  }
};

const clearSelection = () => {
  selectedUserIds.value = [];
};


// Pagination Computeds
const totalPages = computed(() => {
  return Math.ceil((store.total || 0) / (store.limit || 10)) || 1;
});

const startRecord = computed(() => {
  if (!store.total) return 0;
  return (store.page - 1) * store.limit + 1;
});

const endRecord = computed(() => {
  if (!store.total) return 0;
  return Math.min(store.page * store.limit, store.total);
});

const visiblePages = computed(() => {
  const current = store.page;
  const total = totalPages.value;
  const delta = 1;
  const range: (number | string)[] = [];

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    } else if (range[range.length - 1] !== '...') {
      range.push('...');
    }
  }

  return range;
});

// Helpers
const formatLevelName = (level: number | null | undefined): string => {
  if (level === null || level === undefined) return 'Level -';
  switch (level) {
    case 0:
      return 'Level 0 (Pusat)';
    case 1:
      return 'Level 1 (Induk)';
    case 2:
      return 'Level 2 (UP3)';
    case 3:
      return 'Level 3 (ULP)';
    default:
      return `Level ${level}`;
  }
};

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
};

const getInitials = (name: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

// Avatar Palette Classes based on the requested theme
const avatarColors = [
  'bg-[#28536B] text-white',      // Indigo
  'bg-[#8FB78F] text-white',      // Matcha
  'bg-[#CBE6C7] text-[#28536B]',  // Pistachio
  'bg-[#B4CCCF] text-[#28536B]',  // Azure
  'bg-[#F3A5BC] text-[#8E2542]',  // Orchid
  'bg-[#FFC49B] text-[#A24D18]',  // Peach
];

const getUserAvatarBg = (seed: string): string => {
  if (!seed) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
};

// Sorting Handler
const handleSort = (columnKey: string) => {
  clearSelection();
  store.setSorting(columnKey);
};

// Filter & Search Handlers
const debouncedSearch = useDebounceFn((query: string) => {
  clearSelection();
  store.setSearch(query);
}, 350);

watch(searchInput, (val) => {
  debouncedSearch(val);
});

const onSelectStatus = (status: number | '') => {
  clearSelection();
  statusFilter.value = status;
  store.setStatus(status);
};

const onChangeLevel = () => {
  clearSelection();
  store.setLevel(levelFilter.value);
};

const onChangeLimit = () => {
  clearSelection();
  store.limit = selectedLimit.value;
  store.setPage(1);
};

const onGoToPage = (targetPage: number) => {
  if (targetPage < 1 || targetPage > totalPages.value) return;
  clearSelection();
  store.setPage(targetPage);
};

const handleRefresh = async () => {
  try {
    clearSelection();
    await store.fetchApprovals();
    snackbar.add({
      type: 'success',
      text: 'Data user approval berhasil diperbarui',
      title: 'Refresh Sukses',
    });
  } catch (error: any) {
    snackbar.add({
      type: 'error',
      text: error.message || 'Gagal memuat ulang data',
      title: 'Error',
    });
  }
};

const handleReset = () => {
  clearSelection();
  searchInput.value = '';
  statusFilter.value = '';
  levelFilter.value = '';
  store.resetFilters();
};

// Watch Level changes in Approve Modal to load corresponding units
watch(() => approveForm.level, async (newLevel) => {
  if (approveModalState.isOpen && newLevel !== null && newLevel !== undefined) {
    try {
      await userStore.getUnitsNew(`${newLevel}`);
      if (selectedUnit.value) {
        const found = userStore.units.find((u) => u.code === selectedUnit.value?.code);
        selectedUnit.value = found || null;
      }
    } catch (err) {
      console.error('Error fetching units for level:', newLevel, err);
    }
  }
});

// Watch selectedUnit to sync unit_code and unit_name
watch(selectedUnit, (unit) => {
  if (unit) {
    approveForm.unit_code = unit.code;
    approveForm.unit_name = unit.label;
  } else {
    approveForm.unit_code = '';
    approveForm.unit_name = '';
  }
});

// Approve Modal Handlers
const openApproveModal = async (item: UserApprovalItem) => {
  approveModalState.item = item;
  approveForm.level = item.level ?? 0;
  approveForm.jabatan = item.jabatan ?? '';
  approveForm.nip = item.nip ?? '';
  approveForm.unit_code = item.unit_code ?? '';
  approveForm.unit_name = item.unit_name ?? '';

  // Load available roles if empty
  if (!userStore.roles.length) {
    try {
      await userStore.getRolesNew();
    } catch (err) {
      console.error('Error loading roles:', err);
    }
  }

  // Load units for user's level
  try {
    await userStore.getUnitsNew(`${approveForm.level}`);
    if (item.unit_code) {
      const foundUnit = userStore.units.find((u) => u.code === item.unit_code);
      selectedUnit.value = foundUnit || (item.unit_name ? { code: item.unit_code, label: item.unit_name } : null);
    } else {
      selectedUnit.value = null;
    }
  } catch (err) {
    console.error('Error loading units:', err);
    selectedUnit.value = null;
  }

  // Populate roles
  if (item.roles && Array.isArray(item.roles) && item.roles.length > 0) {
    selectedRoles.value = [...item.roles];
  } else {
    selectedRoles.value = [];
  }

  approveModalState.isOpen = true;
};

const closeApproveModal = () => {
  approveModalState.isOpen = false;
  approveModalState.item = null;
  selectedRoles.value = [];
  selectedUnit.value = null;
};

const confirmApproveUser = async () => {
  if (!approveModalState.item) return;

  if (!selectedRoles.value.length) {
    snackbar.add({
      type: 'warning',
      text: 'Silakan pilih minimal 1 peran (role) untuk user ini.',
      title: 'Peran Diperlukan',
    });
    return;
  }

  isSubmittingModal.value = true;
  const userId = approveModalState.item.id;
  const roleIds = selectedRoles.value.map((r) => r.id);

  try {
    await store.updateStatus({
      id: userId,
      status: 1, // ACCEPT
      roles: roleIds,
      level: approveForm.level,
      unit_code: approveForm.unit_code,
      unit_name: approveForm.unit_name,
      jabatan: approveForm.jabatan,
      nip: approveForm.nip,
    });

    closeApproveModal();
    snackbar.add({
      type: 'success',
      text: `User ${approveModalState.item?.full_name || ''} berhasil disetujui`,
      title: 'Persetujuan Berhasil',
    });
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || error?.message || 'Gagal menyetujui user';
    snackbar.add({
      type: 'error',
      text: errorMsg,
      title: 'Gagal',
    });
  } finally {
    isSubmittingModal.value = false;
  }
};

// Reject Modal Handlers
const openRejectModal = (item: UserApprovalItem) => {
  rejectModalState.item = item;
  rejectModalState.isOpen = true;
};

const closeRejectModal = () => {
  rejectModalState.isOpen = false;
  rejectModalState.item = null;
};

const confirmRejectUser = async () => {
  if (!rejectModalState.item) return;

  isSubmittingModal.value = true;
  const userId = rejectModalState.item.id;
  const userName = rejectModalState.item.full_name || 'User';

  try {
    await store.updateStatus({
      id: userId,
      status: 2, // REJECT
    });

    closeRejectModal();
    snackbar.add({
      type: 'success',
      text: `Permohonan registrasi ${userName} telah ditolak`,
      title: 'Berhasil Ditolak',
    });
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || error?.message || 'Gagal menolak user';
    snackbar.add({
      type: 'error',
      text: errorMsg,
      title: 'Gagal',
    });
  } finally {
    isSubmittingModal.value = false;
  }
};

// Watch Level changes in Bulk Approve Modal
watch(() => bulkApproveForm.level, async (newLevel) => {
  if (bulkApproveModalState.isOpen && newLevel !== null && newLevel !== undefined) {
    try {
      await userStore.getUnitsNew(`${newLevel}`);
      if (bulkSelectedUnit.value) {
        const found = userStore.units.find((u) => u.code === bulkSelectedUnit.value?.code);
        bulkSelectedUnit.value = found || null;
      }
    } catch (err) {
      console.error('Error fetching units for bulk level:', newLevel, err);
    }
  }
});

// Watch bulkSelectedUnit to sync unit_code and unit_name
watch(bulkSelectedUnit, (unit) => {
  if (unit) {
    bulkApproveForm.unit_code = unit.code;
    bulkApproveForm.unit_name = unit.label;
  } else {
    bulkApproveForm.unit_code = '';
    bulkApproveForm.unit_name = '';
  }
});

// Bulk Approve Modal Handlers (Option A)
const openBulkApproveModal = async () => {
  if (!selectedUsers.value.length) {
    snackbar.add({
      type: 'warning',
      text: 'Pilih minimal 1 user untuk disetujui secara massal.',
      title: 'Peringatan',
    });
    return;
  }

  // Load roles if not yet loaded
  if (!userStore.roles.length) {
    try {
      await userStore.getRolesNew();
    } catch (err) {
      console.error('Error loading roles:', err);
    }
  }

  // Set default level from first selected user or 0
  const firstUser = selectedUsers.value[0];
  bulkApproveForm.level = firstUser?.level ?? 0;
  bulkApproveForm.unit_code = firstUser?.unit_code || '';
  bulkApproveForm.unit_name = firstUser?.unit_name || '';
  bulkSelectedRoles.value = [];

  try {
    await userStore.getUnitsNew(`${bulkApproveForm.level}`);
    if (firstUser?.unit_code) {
      const foundUnit = userStore.units.find((u) => u.code === firstUser.unit_code);
      bulkSelectedUnit.value = foundUnit || (firstUser.unit_name ? { code: firstUser.unit_code, label: firstUser.unit_name } : null);
    } else {
      bulkSelectedUnit.value = null;
    }
  } catch (err) {
    console.error('Error loading units for bulk approve:', err);
    bulkSelectedUnit.value = null;
  }

  bulkApproveModalState.isOpen = true;
};

const closeBulkApproveModal = () => {
  bulkApproveModalState.isOpen = false;
  bulkSelectedRoles.value = [];
  bulkSelectedUnit.value = null;
};

const confirmBulkApprove = async () => {
  if (!selectedUsers.value.length) return;

  if (!bulkSelectedRoles.value.length) {
    snackbar.add({
      type: 'warning',
      text: 'Silakan pilih minimal 1 peran (role) yang akan ditugaskan ke seluruh user terpilih.',
      title: 'Peran Diperlukan',
    });
    return;
  }

  isSubmittingModal.value = true;
  const roleIds = bulkSelectedRoles.value.map((r) => r.id);
  const count = selectedUsers.value.length;

  try {
    const items = selectedUsers.value.map((user) => ({
      id: user.id,
      roles: roleIds,
      status: 1, // ACCEPT
      level: bulkApproveForm.level,
      unit_code: bulkApproveForm.unit_code || user.unit_code || '',
      unit_name: bulkApproveForm.unit_name || user.unit_name || '',
      jabatan: user.jabatan || '',
      nip: user.nip || '',
    }));

    await store.updateBulkStatus({ items });

    closeBulkApproveModal();
    clearSelection();

    snackbar.add({
      type: 'success',
      text: `Sebanyak ${count} user berhasil disetujui secara massal.`,
      title: 'Persetujuan Massal Berhasil',
    });
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || error?.message || 'Gagal memproses persetujuan massal';
    snackbar.add({
      type: 'error',
      text: errorMsg,
      title: 'Gagal',
    });
  } finally {
    isSubmittingModal.value = false;
  }
};

// Bulk Reject Modal Handlers
const openBulkRejectModal = () => {
  if (!selectedUsers.value.length) {
    snackbar.add({
      type: 'warning',
      text: 'Pilih minimal 1 user untuk ditolak secara massal.',
      title: 'Peringatan',
    });
    return;
  }

  bulkRejectModalState.isOpen = true;
};

const closeBulkRejectModal = () => {
  bulkRejectModalState.isOpen = false;
};

const confirmBulkReject = async () => {
  if (!selectedUsers.value.length) return;

  isSubmittingModal.value = true;
  const count = selectedUsers.value.length;

  try {
    const items = selectedUsers.value.map((user) => ({
      id: user.id,
      roles: user.roles && Array.isArray(user.roles) ? user.roles.map((r) => r.id) : [],
      status: 2, // REJECT
      level: user.level ?? 0,
      unit_code: user.unit_code || '',
      unit_name: user.unit_name || '',
      jabatan: user.jabatan || '',
      nip: user.nip || '',
    }));

    await store.updateBulkStatus({ items });

    closeBulkRejectModal();
    clearSelection();

    snackbar.add({
      type: 'success',
      text: `Sebanyak ${count} permohonan registrasi user telah ditolak.`,
      title: 'Penolakan Massal Berhasil',
    });
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || error?.message || 'Gagal memproses penolakan massal';
    snackbar.add({
      type: 'error',
      text: errorMsg,
      title: 'Gagal',
    });
  } finally {
    isSubmittingModal.value = false;
  }
};


// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([
      store.fetchApprovals(),
      userStore.getRolesNew(),
    ]);
  } catch (error) {
    console.error('Error initializing user approval page:', error);
  }
});
</script>
