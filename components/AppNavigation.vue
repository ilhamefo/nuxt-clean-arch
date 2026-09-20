<template>
  <nav class="fixed top-4 left-4 z-50" aria-label="Main Navigation">
    <div class="flex items-center bg-white/95 backdrop-blur-md border border-gray-200 shadow-md rounded-xl p-1.5 gap-1">
      <NuxtLink
        v-for="item in navLinks"
        :key="item.path"
        :to="item.path"
        :class="[
          isCurrent(item.path)
            ? 'bg-blue-600 text-white shadow-sm font-semibold'
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium',
          'px-3.5 py-1.5 rounded-lg text-xs md:text-sm flex items-center transition-all duration-150'
        ]"
      >
        {{ item.label }}
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const navLinks = [
  { label: 'Edit User (New)', path: '/edit-user/new' },
  { label: 'Blocked Users', path: '/blocked-users' },
  { label: 'Mutasi User', path: '/mutasi-user' },
];

const isCurrent = (path: string) => {
  return route.path === path || route.path === `${path}/`;
};
</script>

