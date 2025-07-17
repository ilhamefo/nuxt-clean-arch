// Pinia store for user authentication
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { OAuthUrlResponse, Role, Unit, UpdateUserPayload, User, UserVCC } from '../../core/domain/entities/User';
import { UserService } from '../../infrastructure/services/UserService';

const userService = new UserService();

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const oAuthUrlResponse = ref<OAuthUrlResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const errorValidation = ref<{ email?: string; password?: string }>({});
  const searchResults = ref<UserVCC[]>([]);
  const roles = ref<Role[]>([]);
  const units = ref<Unit[]>([]);

  function getErrorType(params: string): string | null {
    switch (params) {
      case "validation_failed":
        return "Validation Failed";
      case "invalid_credentials":
        return "That email and password combination is incorrect.";
      default:
        return "Unknown Error";
    }
  }

  async function login(username: string, password: string) {
    loading.value = true;
    error.value = null;
    errorValidation.value = {};

    try {
      user.value = await userService.login(username, password);
    } catch (e: any) {

      if (e.status === 422) {
        errorValidation.value = e.response.data.message ?? {};
      }

      error.value = getErrorType(e.response.data.error);

      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function searchUsers(keyword: string) {
    loading.value = true;
    error.value = null;

    try {
      const res = await userService.searchUsers(keyword);

      searchResults.value = res?.data ?? [];

    } catch (e: any) {

      if (e.status === 422) {
        errorValidation.value = e.response.data.message ?? {};
      }

      error.value = getErrorType(e.response.data.error);

      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function getRoles() {
    loading.value = true;
    error.value = null;

    try {
      const res = await userService.loadRoles();

      roles.value = res?.data ?? [];

    } catch (e: any) {

      error.value = getErrorType(e.response.data.error);

      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function getUnits(level: string) {
    loading.value = true;
    error.value = null;

    try {
      const res = await userService.loadUnits(level);

      units.value = res?.data ?? [];

    } catch (e: any) {

      error.value = getErrorType(e.response.data.error);

      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, payload: UpdateUserPayload) {
    loading.value = true;
    error.value = null;

    try {
      const res = await userService.update(id, payload);

      return res; // Return the full response object instead of just status
    } catch (e: any) {

      error.value = getErrorType(e.response.data.error);

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
    errorValidation,
    searchResults,
    roles,
    units,
    login,
    register,
    loginWithGoogle,
    logout,
    fetchUser,
    searchUsers,
    getRoles,
    getUnits,
    update,
  };
});
