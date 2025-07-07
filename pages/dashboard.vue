<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
      <p class="mb-4">Welcome {{ userStore.user?.email }}! You are authenticated.</p>
      <button @click="logout" class="w-full bg-black text-white py-3 rounded-xl font-bold text-lg mt-2 mb-4 hover:bg-gray-700 disabled:opacity-60 cursor-pointer hover:rounded-none duration-300 transition-all">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../src/presentation/stores/user';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  await userStore.fetchUser();
});

 function logout() {
  userStore.logout();

  userStore.fetchUser();
}
</script>
