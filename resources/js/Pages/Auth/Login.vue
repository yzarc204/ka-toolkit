<template>
    <div class="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <!-- Login Form Card -->
            <div
                class="bg-light-card dark:bg-dark-card rounded-3xl shadow-soft dark:shadow-soft-dark p-8 border border-light-border dark:border-dark-border">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-light-text dark:text-dark-text">Welcome back</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
                </div>

                <form class="space-y-6" @submit.prevent="handleLogin">
                    <!-- Error Message -->
                    <div v-if="errorMessage"
                        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label for="email-address"
                                class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Email
                                address</label>
                            <input id="email-address" name="email" type="email" autocomplete="email" required
                                v-model="form.email"
                                class="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                placeholder="Enter your email" />
                        </div>
                        <div>
                            <label for="password"
                                class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Password</label>
                            <input id="password" name="password" type="password" autocomplete="current-password"
                                required v-model="form.password"
                                class="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                placeholder="Enter your password" />
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="text-sm">
                            <a href="#"
                                class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button type="submit" :disabled="loading"
                            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg">
                            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                <LockClosedIcon class="h-5 w-5 text-primary-200 group-hover:text-primary-100"
                                    aria-hidden="true" />
                            </span>
                            {{ loading ? 'Signing in...' : 'Sign in' }}
                        </button>
                    </div>

                    <div class="text-center">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?
                            <router-link to="/register"
                                class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors">
                                Sign up
                            </router-link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LockClosedIcon } from '@heroicons/vue/24/solid';
import { useAuth } from '@/Composables/useAuth';

const router = useRouter();
const { login } = useAuth();
const loading = ref(false);
const errorMessage = ref('');
const form = ref({
    email: '',
    password: ''
});

const handleLogin = async () => {
    loading.value = true;
    errorMessage.value = '';
    try {
        await login(form.value);
        router.push('/');
    } catch (error) {
        console.error('Login failed:', error);

        // Extract error message from API response
        if (error.response?.data?.message) {
            errorMessage.value = error.response.data.message;
        } else if (error.response?.data?.errors) {
            // Handle validation errors
            const errors = error.response.data.errors;
            if (errors.email) {
                errorMessage.value = errors.email[0];
            } else if (errors.password) {
                errorMessage.value = errors.password[0];
            } else {
                errorMessage.value = 'Login failed. Please check your credentials.';
            }
        } else {
            errorMessage.value = 'Login failed. Please check your credentials.';
        }
    } finally {
        loading.value = false;
    }
};
</script>