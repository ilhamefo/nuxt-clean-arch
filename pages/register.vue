<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <form @submit.prevent="onSubmit" class="bg-white p-8 rounded shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6">Register</h1>
      <div class="mb-4">
        <label class="block mb-1" for="email">Email</label>
        <input v-model="form.email" id="email" type="email" class="w-full border rounded px-3 py-2" />
        <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
      </div>
      <div class="mb-4">
        <label class="block mb-1" for="password">Password</label>
        <input v-model="form.password" id="password" type="password" class="w-full border rounded px-3 py-2" />
        <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
      </div>
      <div v-if="error" class="text-red-500 mb-2">{{ error }}</div>
      <button :disabled="loading" type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2">
        <span v-if="loading">Loading...</span>
        <span v-else>Register</span>
      </button>
      <button type="button" @click="onGoogleSignIn" class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
        Register with Google
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRegisterForm } from '../src/presentation/composables/useRegisterForm';

const { form, errors, loading, error, onSubmit, onGoogleSignIn } = useRegisterForm();
</script>
