<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
      <p class="mb-4">Welcome! You are authenticated.</p>
      <button @click="logout" class="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/presentation/stores/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  if (!authStore.user) {
    router.push('/login');
  }
});

function logout() {
  authStore.logout();
  router.push('/login');
}
</script>
