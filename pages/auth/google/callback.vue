<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div v-if="loading" class="text-lg">Loading...</div>
        <div v-else-if="error" class="w-full max-w-md">
            <div class="bg-white p-8 rounded shadow-md w-full mb-4">
                <div class="text-red-500 mb-2">{{ error }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../../../src/presentation/stores/user';
import { UserService } from '../../../src/infrastructure/services/UserService';

const loading = ref(true);
const error = ref('');
const router = useRouter();
const userStore = useUserStore();
const userService = new UserService();
const route = useRoute();
const code = route.query.code as string;
const state = route.query.state as string;

onMounted(async () => {
    loading.value = true;
    error.value = '';
    try {
        const user = await userService.googleAuthCallback(code, state);
        if (user) {
            router.push('/dashboard');
        } else {
            throw new Error('Authentication failed');
        }
    } catch (e: any) {
        error.value = e.message ?? 'Google authentication failed';
    } finally {
        loading.value = false;
    }
});
</script>
