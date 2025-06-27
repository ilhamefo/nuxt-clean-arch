// Pinia store for user authentication
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { OAuthUrlResponse, User } from '../../core/domain/entities/User';
import { UserService } from '../../infrastructure/services/UserService';

const userService = new UserService();

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const oAuthUrlResponse = ref<OAuthUrlResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function login(username: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      user.value = await userService.login(username, password);
    } catch (e: any) {
      error.value = e.message ?? 'Login failed';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      user.value = await userService.register(email, password);
    } catch (e: any) {
      error.value = e.message ?? 'Register failed';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function loginWithGoogle() {
    loading.value = true;
    error.value = null;
    try {
      oAuthUrlResponse.value = await userService.loginWithGoogle();
    } catch (e: any) {
      error.value = e.message ?? 'Google sign-in failed';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    loading.value = true;
    error.value = null;
    try {
      const response = await userService.fetchUser();
      console.log('response:', response);

      user.value = response?.data?.user ?? null;
    } catch (e: any) {
      error.value = e.message ?? 'Fetch user failed';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    await userService.logout();
    user.value = null;
  }

  return {
    user,
    loading,
    error,
    oAuthUrlResponse,
    login,
    register,
    loginWithGoogle,
    logout,
    fetchUser
  };
});
