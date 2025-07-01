import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

export function useRegisterForm() {
  const form = ref({ email: '', password: '' });
  const errors = ref<{ email?: string; password?: string }>({});
  const router = useRouter();
  const userStore = useUserStore();

  function validate() {
    errors.value = {};
    if (!form.value.email) errors.value.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.value.email)) errors.value.email = 'Invalid email';
    if (!form.value.password) errors.value.password = 'Password is required';
    else if (form.value.password.length < 6) errors.value.password = 'Password must be at least 6 characters';
    return Object.keys(errors.value).length === 0;
  }

  async function onSubmit() {
    if (!validate()) return;
    userStore.error = null;
    userStore.loading = true;
    try {
      await userStore.register?.(form.value.email, form.value.password);
      router.push('/dashboard');
    } catch (e: any) {
      userStore.error = e.message ?? 'Register failed';
    } finally {
      userStore.loading = false;
    }
  }

  return {
    form,
    errors,
    loading: userStore.loading,
    error: userStore.error,
    onSubmit,
  };
}
