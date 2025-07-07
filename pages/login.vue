<template>
  <div class="min-h-screen bg-white flex flex-col">
    <header class="flex items-center h-16 px-6">
      <img src="https://static.figma.com/app/icon/1/favicon.png" alt="Figma Logo" class="w-8 h-8" />
    </header>

    <main class="flex-1 flex flex-col items-center justify-center px-4">
      <section class="w-full max-w-md flex flex-col items-center">
        <h1 class="text-3xl font-bold mb-8 text-center">Sign in to Figma</h1>

        <div v-if="error" class="text-red-700 text-md mb-16">
          {{ error }}
        </div>

        <button type="button" @click="onGoogleSignIn"
          class="flex items-center justify-center w-full border border-gray-400 rounded-lg py-3 mb-4 text-base font-medium bg-white hover:bg-gray-50 transition duration-300 cursor-pointer">
          <svg class="w-6 h-6 mr-2" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4"
                d="M24 9.5c3.54 0 6.72 1.22 9.22 3.23l6.9-6.9C35.64 2.36 30.13 0 24 0 14.82 0 6.73 5.82 2.69 14.09l8.06 6.26C12.36 13.36 17.74 9.5 24 9.5z" />
              <path fill="#34A853"
                d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.01l7.18 5.59C43.27 37.27 46.1 31.45 46.1 24.5z" />
              <path fill="#FBBC05"
                d="M10.75 28.35c-1.13-3.36-1.13-6.99 0-10.35l-8.06-6.26C.9 15.36 0 19.56 0 24c0 4.44.9 8.64 2.69 12.26l8.06-6.26z" />
              <path fill="#EA4335"
                d="M24 48c6.13 0 11.64-2.02 15.8-5.5l-7.18-5.59c-2.01 1.35-4.58 2.09-8.62 2.09-6.26 0-11.64-3.86-13.25-9.35l-8.06 6.26C6.73 42.18 14.82 48 24 48z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </g>
          </svg>
          Continue with Google
        </button>


        <div class="flex items-center w-full my-4">
          <div class="flex-1 h-px bg-gray-300"></div>
          <span class="mx-4 text-gray-500 text-sm">or</span>
          <div class="flex-1 h-px bg-gray-300"></div>
        </div>

        <form @submit.prevent="onSubmit" class="w-full flex flex-col" autocomplete="on">
          <input v-model="form.email" id="email" type="text"
            :class="['rounded px-3 py-4 mb-4  tracking-wide text-sm bg-gray-100 border-none focus:ring-2 focus:ring-black outline-0 transition duration-100', errorValidation.email ? 'border-red-600 bg-red-50 ring-2 ring-red-600' : '']"
            placeholder="Email" autocomplete="email" />

          <div v-if="errorValidation.email" class="flex w-full  items-center justify-center">
            <p class="text-white text-sm mb-2 bg-red-600 text-center px-3 py-1 rounded-md">{{ errorValidation.email }}
            </p>
          </div>

          <input v-model="form.password" id="password" type="password"
            :class="['rounded px-3 py-4 mb-4  tracking-wide text-sm bg-gray-100 border-none focus:ring-2 focus:ring-black outline-0 transition duration-100', errorValidation.password ? 'border-red-600 bg-red-50 ring-2 ring-red-600' : '']"
            placeholder="Password" autocomplete="current-password" />

          <div v-if="errorValidation.password" class="flex w-full  items-center justify-center">
            <p class="text-white text-sm mb-2 bg-red-600 text-center px-3 py-1 rounded-md">{{ errorValidation.password }}</p>
          </div>

          <button :disabled="loading" type="submit"
            class="w-full bg-black text-white py-4 rounded-xl font-bold text-lg mt-2 mb-4 hover:bg-gray-700 disabled:opacity-60 cursor-pointer hover:rounded-none duration-300 transition-all">
            <span v-if="loading">Loading...</span>
            <span v-else>Log in</span>
          </button>
        </form>
        <nav class="w-full flex flex-col items-center mt-2">
          <a href="#" class="text-blue-600 text-sm mb-2 hover:underline">Reset password</a>
          <div class="text-gray-600 text-sm mt-2">No account? <a href="/register"
              class="text-blue-600 hover:underline">Create one</a></div>
        </nav>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useLoginForm } from '../src/presentation/composables/useLoginForm';
const { form, errors, loading, error, errorValidation, onSubmit, onGoogleSignIn } = useLoginForm();
</script>
