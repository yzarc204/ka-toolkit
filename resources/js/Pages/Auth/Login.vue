<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold dark:text-yellow-500">Sign in to your account</h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="email-address" class="sr-only">Email address</label>
                        <input id="email-address" name="email" type="email" autocomplete="email" required
                            v-model="form.email"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-input text-gray-900 dark:text-dark-text"
                            placeholder="Email address" />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input id="password" name="password" type="password" autocomplete="current-password" required
                            v-model="form.password"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-input text-gray-900 dark:text-dark-text"
                            placeholder="Password" />
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="text-sm">
                        <a href="#" class="font-medium text-blue-600 dark:text-yellow-500 hover:text-blue-500">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <div>
                    <button type="submit" :disabled="loading"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-yellow-600 hover:bg-blue-700 dark:hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <LockClosedIcon class="h-5 w-5 text-blue-500 dark:text-yellow-500 group-hover:text-blue-400"
                                aria-hidden="true" />
                        </span>
                        {{ loading ? 'Signing in...' : 'Sign in' }}
                    </button>
                </div>

                <div class="text-center">
                    <p class="text-sm dark:text-yellow-500">
                        Don't have an account?
                        <router-link to="/register"
                            class="font-medium text-blue-600 dark:text-yellow-500 hover:text-blue-500">
                            Sign up
                        </router-link>
                    </p>
                </div>
            </form>
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
const form = ref({
    email: '',
    password: ''
});

const handleLogin = async () => {
    loading.value = true;
    try {
        await login(form.value);
        router.push('/');
    } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
    } finally {
        loading.value = false;
    }
};
</script>