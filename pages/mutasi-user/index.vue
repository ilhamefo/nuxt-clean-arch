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
                User Mutation
              </span>
              <span class="text-xs text-slate-400">•</span>
              <span class="text-xs font-medium text-slate-500">Total {{ store.total }} Pengajuan</span>
            </div>
            <h1 class="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#28536B]">
              Mutasi User
            </h1>
            <p class="mt-1 text-sm text-slate-500 max-w-2xl">
              Daftar permohonan mutasi user, status perpindahan level organisasi, dan unit kerja.
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

          <!-- Status & Controls -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center rounded-xl bg-slate-100/80 p-1 border border-slate-200/60 text-xs font-semibold">
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
        <!-- Table View -->
        <div class="mt-6 overflow-hidden rounded-2xl border border-[#B4CCCF]/40 bg-white shadow-xs">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead class="bg-slate-50/90 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
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
                <tr v-if="store.loading && !store.requests.length" v-for="i in 5" :key="'skeleton-' + i" class="animate-pulse">
                  <td class="py-4 pl-6 pr-4">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-10 rounded-full bg-slate-200"></div>
                      <div class="space-y-2">
                        <div class="h-4 w-32 rounded bg-slate-200"></div>
                        <div class="h-3 w-24 rounded bg-slate-100"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4"><div class="h-4 w-24 rounded bg-slate-200"></div></td>
                  <td class="px-4 py-4"><div class="h-4 w-28 rounded bg-slate-200"></div></td>
                  <td class="px-4 py-4"><div class="h-4 w-24 rounded bg-slate-200"></div></td>
                  <td class="px-4 py-4"><div class="h-4 w-28 rounded bg-slate-200"></div></td>
                  <td class="px-4 py-4"><div class="h-4 w-20 rounded bg-slate-200"></div></td>
                  <td class="px-4 py-4"><div class="h-6 w-20 rounded-full bg-slate-200"></div></td>
                  <td class="px-4 py-4"><div class="h-4 w-24 rounded bg-slate-200"></div></td>
                  <td class="sticky right-0 z-10 bg-white py-4 pl-4 pr-6 text-right shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] border-l border-slate-100">
                    <div class="inline-flex gap-2 justify-end">
                      <div class="h-8 w-16 rounded-lg bg-slate-200"></div>
                      <div class="h-8 w-14 rounded-lg bg-slate-100"></div>
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr v-else-if="!store.requests.length">
                  <td :colspan="tableColumns.length" class="py-16 text-center">
                    <div class="flex flex-col items-center justify-center">
                      <div class="h-14 w-14 rounded-2xl bg-[#F0F5F8] flex items-center justify-center text-[#28536B] mb-3 border border-[#B4CCCF]/40">
                        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p class="text-base font-bold text-slate-800">Tidak ada data mutasi user</p>
                      <p class="text-xs text-slate-500 mt-1 max-w-sm">
                        Tidak ditemukan permohonan mutasi user dengan filter yang dipilih.
                      </p>
                      <button
                        v-if="searchInput || statusFilter !== ''"
                        @click="handleReset"
                        class="mt-4 px-4 py-2 text-xs font-semibold text-[#28536B] bg-[#28536B]/10 hover:bg-[#28536B]/20 rounded-xl transition cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Data Rows -->
                <tr
                  v-else
                  v-for="item in store.requests"
                  :key="item.id"
                  class="group transition-colors duration-100 hover:bg-[#F0F5F8]/40"
                >
                  <!-- User Info -->
                  <td class="py-4 pl-6 pr-4">
                    <div class="flex items-center gap-3">
                      <div
                        :class="[
                          getUserAvatarBg(item.user?.full_name || item.user_id),
                          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase shadow-inner'
                        ]"
                      >
                        {{ getInitials(item.user?.full_name || item.user?.username || 'U') }}
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-semibold text-slate-900 truncate">
                          {{ item.user?.full_name || 'Tanpa Nama' }}
                        </p>
                        <p class="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                          <span>{{ item.user?.email || item.user?.username || item.user_id }}</span>
                          <span v-if="item.user?.nip" class="text-slate-300">•</span>
                          <span v-if="item.user?.nip" class="font-mono text-[11px] text-slate-500">NIP: {{ item.user.nip }}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  <!-- Level Asal -->
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                      {{ formatLevelName(item.old_level) }}
                    </span>
                  </td>

                  <!-- Unit Asal -->
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex flex-col">
                      <span class="text-xs font-semibold text-slate-800 max-w-[160px] truncate" :title="item.old_unit_name || item.old_unit_code || '-'">
                        {{ item.old_unit_name || '-' }}
                      </span>
                      <span class="text-[11px] text-slate-500 font-mono mt-0.5">
                        Kode: {{ item.old_unit_code || '-' }}
                      </span>
                    </div>
                  </td>

                  <!-- Level Tujuan -->
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#28536B]/10 text-[#28536B] border border-[#28536B]/20">
                      <svg class="w-3 h-3 text-[#28536B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      {{ formatLevelName(item.new_level) }}
                    </span>
                  </td>

                  <!-- Unit Tujuan -->
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex flex-col">
                      <span class="text-xs font-semibold text-[#28536B] max-w-[160px] truncate" :title="item.new_unit_name || item.new_unit_code || '-'">
                        {{ item.new_unit_name || '-' }}
                      </span>
                      <span class="text-[11px] text-[#28536B]/70 font-mono mt-0.5">
                        Kode: {{ item.new_unit_code || '-' }}
                      </span>
                    </div>
                  </td>

                  <!-- Surat Pindah -->
                  <td class="px-4 py-4 whitespace-nowrap">
                    <!-- Berkas dengan URL yang dapat dibuka -->
                    <a
                      v-if="item.file?.url"
                      :href="item.file.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group/file inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200/80 bg-white hover:border-[#28536B]/40 hover:bg-[#28536B]/5 transition-all duration-150 cursor-pointer shadow-2xs"
                      :title="'Buka berkas ' + getFileName(item.file?.path || item.surat_pindah) + ' di tab baru'"
                    >
                      <div class="p-1 bg-[#FDF0F4] text-[#8E2542] border border-[#FACEE0] rounded group-hover/file:border-[#F3A5BC]">
                        <svg class="w-3.5 h-3.5 text-[#8E2542]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span class="text-xs font-medium text-slate-700 group-hover/file:text-[#28536B] max-w-[110px] truncate underline-offset-2 group-hover/file:underline">
                        {{ getFileName(item.file?.path || item.surat_pindah) }}
                      </span>
                      <svg class="w-3.5 h-3.5 text-slate-400 group-hover/file:text-[#28536B] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>

                    <!-- Berkas tanpa URL aktif -->
                    <div
                      v-else-if="item.file?.path || item.surat_pindah"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-100 bg-slate-50/50"
                      :title="'Berkas: ' + getFileName(item.file?.path || item.surat_pindah) + ' (pratinjau tidak tersedia)'"
                    >
                      <div class="p-1 bg-[#FDF0F4] text-[#8E2542] border border-[#FACEE0] rounded">
                        <svg class="w-3.5 h-3.5 text-[#F3A5BC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span class="text-xs font-medium text-slate-500 max-w-[120px] truncate">
                        {{ getFileName(item.file?.path || item.surat_pindah) }}
                      </span>
                    </div>

                    <!-- Tidak ada berkas -->
                    <span v-else class="text-xs text-slate-400 italic">-</span>
                  </td>

                  <!-- Status -->
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
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
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

                  <!-- Tanggal -->
                  <td class="px-4 py-4 whitespace-nowrap text-xs text-slate-500">
                    {{ formatDate(item.created_at) }}
                  </td>

                  <!-- Aksi -->
                  <td class="sticky right-0 z-10 bg-white group-hover:bg-[#F0F5F8] py-4 pl-4 pr-6 text-right whitespace-nowrap shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] border-l border-slate-100 transition-colors duration-150">
                    <div v-if="item.status === 0" class="inline-flex items-center gap-2">
                      <!-- Setujui Button (Matcha Theme) -->
                      <button
                        type="button"
                        @click="openConfirmModal(item, 1)"
                        :disabled="store.actionLoadingId === item.id"
                        class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#8FB78F] hover:bg-[#749E74] rounded-lg shadow-xs transition duration-150 disabled:opacity-50 cursor-pointer"
                        title="Setujui Mutasi"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Setujui</span>
                      </button>

                      <!-- Tolak Button (Orchid Theme) -->
                      <button
                        type="button"
                        @click="openConfirmModal(item, 2)"
                        :disabled="store.actionLoadingId === item.id"
                        class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#8E2542] bg-[#FDF0F4] hover:bg-[#FACEE0] border border-[#F3A5BC] rounded-lg transition duration-150 disabled:opacity-50 cursor-pointer"
                        title="Tolak Mutasi"
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
                        Selesai
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
              <span class="font-semibold text-[#28536B]">{{ startRecord }}</span>
              sampai
              <span class="font-semibold text-[#28536B]">{{ endRecord }}</span>
              dari
              <span class="font-semibold text-[#28536B]">{{ store.total }}</span>
              data
            </div>

            <div class="flex items-center gap-1.5 self-center sm:self-auto">
              <button
                type="button"
                @click="onGoToPage(store.page - 1)"
                :disabled="store.page <= 1 || store.loading"
                class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-[#F0F5F8] hover:text-[#28536B] hover:border-[#B4CCCF] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Prev</span>
              </button>

              <template v-for="(p, idx) in visiblePages" :key="'page-' + idx">
                <span v-if="p === '...'" class="px-2 text-xs text-slate-400">...</span>
                <button
                  v-else
                  type="button"
                  @click="onGoToPage(Number(p))"
                  :disabled="store.loading"
                  :class="[
                    store.page === Number(p)
                      ? 'bg-[#28536B] text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-[#F0F5F8] hover:text-[#28536B] border border-slate-200 font-medium',
                    'min-w-[32px] h-8 px-2.5 rounded-lg text-xs transition flex items-center justify-center cursor-pointer'
                  ]"
                >
                  {{ p }}
                </button>
              </template>

              <button
                type="button"
                @click="onGoToPage(store.page + 1)"
                :disabled="store.page >= totalPages || store.loading"
                class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-[#F0F5F8] hover:text-[#28536B] hover:border-[#B4CCCF] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <span>Next</span>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Confirmation Modal -->
    <div
      v-if="modalState.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
      @click.self="closeConfirmModal"
    >
      <div class="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100 transform transition-all">
        <!-- Modal Icon -->
        <div class="flex items-center gap-4">
          <div
            :class="[
              modalState.targetStatus === 1
                ? 'bg-[#EDF7EC] text-[#346034] border border-[#CBE6C7]'
                : 'bg-[#FDF0F4] text-[#8E2542] border border-[#FACEE0]',
              'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl'
            ]"
          >
            <svg v-if="modalState.targetStatus === 1" class="w-6 h-6 text-[#8FB78F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-6 h-6 text-[#F3A5BC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">
              {{ modalState.targetStatus === 1 ? 'Setujui Mutasi User?' : 'Tolak Mutasi User?' }}
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Konfirmasi perubahan status permohonan mutasi
            </p>
          </div>
        </div>

        <!-- Target Request Details -->
        <div v-if="modalState.item" class="mt-5 rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs space-y-2.5">
          <div class="flex justify-between">
            <span class="text-slate-500 font-medium">User:</span>
            <span class="font-bold text-slate-900">{{ modalState.item.user?.full_name || modalState.item.user_id }}</span>
          </div>
          <div class="flex justify-between items-start">
            <span class="text-slate-500 font-medium">Dari:</span>
            <div class="text-right">
              <span class="text-slate-800 font-semibold">{{ formatLevelName(modalState.item.old_level) }}</span>
              <div class="text-[11px] text-slate-500">
                {{ modalState.item.old_unit_name ? modalState.item.old_unit_name + ' • ' : '' }}Unit {{ modalState.item.old_unit_code || '-' }}
              </div>
            </div>
          </div>
          <div class="flex justify-between items-start">
            <span class="text-slate-500 font-medium">Ke:</span>
            <div class="text-right">
              <span class="font-bold text-[#28536B]">{{ formatLevelName(modalState.item.new_level) }}</span>
              <div class="text-[11px] text-[#28536B]/80 font-medium">
                {{ modalState.item.new_unit_name ? modalState.item.new_unit_name + ' • ' : '' }}Unit {{ modalState.item.new_unit_code || '-' }}
              </div>
            </div>
          </div>
          <div v-if="modalState.item.file?.url || modalState.item.file?.path || modalState.item.surat_pindah" class="flex justify-between items-center pt-2 border-t border-slate-200/60">
            <span class="text-slate-500 font-medium">Surat Pindah:</span>
            <a
              v-if="modalState.item.file?.url"
              :href="modalState.item.file.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 font-semibold text-[#28536B] hover:text-[#204458] underline underline-offset-2 hover:bg-[#28536B]/5 px-2 py-0.5 rounded transition-colors"
              :title="'Buka berkas ' + getFileName(modalState.item.file?.path || modalState.item.surat_pindah) + ' di tab baru'"
            >
              <svg class="w-3.5 h-3.5 text-[#8E2542]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span class="max-w-[170px] truncate">{{ getFileName(modalState.item.file?.path || modalState.item.surat_pindah) }}</span>
              <svg class="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <span v-else class="text-slate-600 font-medium truncate max-w-[200px]">
              {{ getFileName(modalState.item.file?.path || modalState.item.surat_pindah) }}
            </span>
          </div>
        </div>

        <p class="mt-4 text-xs text-slate-600 leading-relaxed">
          {{
            modalState.targetStatus === 1
              ? 'Tindakan ini akan menyetujui mutasi dan memperbarui level serta unit kerja user secara otomatis di sistem.'
              : 'Tindakan ini akan menolak permohonan mutasi dan mempertahankan posisi user saat ini.'
          }}
        </p>

        <!-- Modal Actions -->
        <div class="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            @click="closeConfirmModal"
            :disabled="isSubmittingModal"
            class="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            @click="confirmStatusUpdate"
            :disabled="isSubmittingModal"
            :class="[
              modalState.targetStatus === 1
                ? 'bg-[#8FB78F] hover:bg-[#749E74] text-white'
                : 'bg-[#D04F73] hover:bg-[#AD3454] text-white',
              'inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl shadow-sm transition duration-150 disabled:opacity-50 cursor-pointer'
            ]"
          >
            <svg v-if="isSubmittingModal" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmittingModal ? 'Memproses...' : (modalState.targetStatus === 1 ? 'Ya, Setujui' : 'Ya, Tolak') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { usePindahRequestStore } from '../../src/presentation/stores/pindahRequest';
import type { PindahRequest } from '../../src/core/domain/entities/PindahRequest';

const store = usePindahRequestStore();
const snackbar = useSnackbar();

const searchInput = ref('');
const statusFilter = ref<number | ''>('');
const selectedLimit = ref(10);
const isSubmittingModal = ref(false);

const modalState = reactive<{
  isOpen: boolean;
  item: PindahRequest | null;
  targetStatus: number;
}>({
  isOpen: false,
  item: null,
  targetStatus: 1,
});

// Table Column Definitions
const tableColumns = [
  { key: 'user_id', label: 'User', headerClass: 'py-3.5 pl-6 pr-4', sortable: true },
  { key: 'old_level', label: 'Level Asal', headerClass: 'px-4 py-3.5', sortable: true },
  { key: 'old_unit_name', label: 'Unit Asal', headerClass: 'px-4 py-3.5', sortable: true },
  { key: 'new_level', label: 'Level Tujuan', headerClass: 'px-4 py-3.5', sortable: true },
  { key: 'new_unit_name', label: 'Unit Tujuan', headerClass: 'px-4 py-3.5', sortable: true },
  { key: 'surat_pindah', label: 'Surat Pindah', headerClass: 'px-4 py-3.5', sortable: true },
  { key: 'status', label: 'Status', headerClass: 'px-4 py-3.5', sortable: true },
  { key: 'created_at', label: 'Tanggal', headerClass: 'px-4 py-3.5', sortable: true },
  { key: 'actions', label: 'Aksi', headerClass: 'sticky right-0 z-20 bg-slate-50 py-3.5 pl-4 pr-6 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.05)] border-l border-slate-200/60', align: 'right', sortable: false },
];

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

const getFileName = (pathStr: string | null | undefined): string => {
  if (!pathStr) return 'Berkas';
  const parts = pathStr.split('/');
  return parts[parts.length - 1] || pathStr;
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
  store.setSorting(columnKey);
};

// Filter & Search Handlers
const debouncedSearch = useDebounceFn((query: string) => {
  store.setSearch(query);
}, 350);

watch(searchInput, (val) => {
  debouncedSearch(val);
});

const onSelectStatus = (status: number | '') => {
  statusFilter.value = status;
  store.setStatus(status);
};

const onChangeLimit = () => {
  store.limit = selectedLimit.value;
  store.setPage(1);
};

const onGoToPage = (targetPage: number) => {
  if (targetPage < 1 || targetPage > totalPages.value) return;
  store.setPage(targetPage);
};

const handleRefresh = async () => {
  try {
    await store.fetchRequests();
    snackbar.add({
      type: 'success',
      text: 'Data mutasi user berhasil diperbarui',
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
  searchInput.value = '';
  statusFilter.value = '';
  store.resetFilters();
};

// Confirmation Modal Handlers
const openConfirmModal = (item: PindahRequest, targetStatus: number) => {
  modalState.item = item;
  modalState.targetStatus = targetStatus;
  modalState.isOpen = true;
};

const closeConfirmModal = () => {
  modalState.isOpen = false;
  modalState.item = null;
};

const confirmStatusUpdate = async () => {
  if (!modalState.item) return;

  isSubmittingModal.value = true;
  const requestId = modalState.item.id;
  const targetStatus = modalState.targetStatus;
  const statusLabel = targetStatus === 1 ? 'disetujui' : 'ditolak';

  try {
    await store.updateStatus({
      id: requestId,
      status: targetStatus,
    });

    closeConfirmModal();
    snackbar.add({
      type: 'success',
      text: `Permohonan mutasi user berhasil ${statusLabel}`,
      title: 'Berhasil',
    });
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || error?.message || 'Gagal memproses status';
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
    await store.fetchRequests();
  } catch (error) {
    console.error('Error fetching pindah requests on mount:', error);
  }
});
</script>
