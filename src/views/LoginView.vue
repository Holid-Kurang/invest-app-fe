<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { login, isLoading, redirectByRole } = useAuth()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''
  
  try {
    await login({
      email: email.value,
      password: password.value,
    })
    
    // Redirect based on user role
    redirectByRole()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Email atau password salah'
    errorMessage.value = errorMsg
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="bg-gray-200 rounded-2xl px-10 py-8 w-full max-w-sm">
      <h2 class="text-center font-semibold text-blue-900 mb-6 underline">
        SIGN IN
      </h2>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div>
          <label class="block text-sm font-semibold text-blue-900 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 rounded-md focus:outline-none bg-white text-sm"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-blue-900 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 rounded-md focus:outline-none bg-white text-sm"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="bg-blue-900 text-white px-6 py-2 rounded-md font-semibold w-full disabled:opacity-50"
        >
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>
