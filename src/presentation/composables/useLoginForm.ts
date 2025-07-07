import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

export function useLoginForm() {
  const form = ref({ email: 'ilham@oninyon.com', password: 'password' });
  const errors = ref<{ email?: string; password?: string }>({});
  const router = useRouter();
  const userStore = useUserStore();

  async function onSubmit() {
    userStore.error = null;
    userStore.loading = true;
    try {
      await userStore.login(form.value.email, form.value.password);
      router.push('/dashboard');
    } catch (e: any) {
      userStore.error
    } finally {
      userStore.loading = false;
    }
  }

  async function onGoogleSignIn() {
    userStore.error = null;
    userStore.loading = true;
    try {
      await userStore.loginWithGoogle?.();

      if (userStore.oAuthUrlResponse?.data.url) {
        window.location.href = userStore.oAuthUrlResponse.data.url;
      } else {
        throw new Error('Google sign-in URL not available');
      }

    } catch (e: any) {
      userStore.error = e.message ?? 'Google sign-in failed';
    } finally {
      userStore.loading = false;
    }
  }

  return {
    form,
    errors,
    loading: userStore.loading,
    error: computed(() => userStore.error),
    errorValidation: computed(() => userStore.errorValidation),
    onSubmit,
    onGoogleSignIn,
  };
}
