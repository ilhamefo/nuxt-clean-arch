import { useUserStore } from '../stores/user';
import { computed } from 'vue';

export function useLogin() {
  const userStore = useUserStore();
  const isAuthenticated = computed(() => !!userStore.user);
  return {
    ...userStore,
    isAuthenticated,
  };
}
