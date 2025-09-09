<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold dark:text-yellow-500">Create your account</h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
                <div class="space-y-4">
                    <div>
                        <label for="name" class="block text-sm font-medium">Full Name</label>
                        <input id="name" name="name" type="text" autocomplete="name" required v-model="form.name"
                            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-input text-gray-900 dark:text-dark-text"
                            placeholder="Full Name" />
                    </div>
                    <div>
                        <label for="email-address" class="block text-sm font-medium">Email address</label>
                        <input id="email-address" name="email" type="email" autocomplete="email" required
                            v-model="form.email"
                            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-input text-gray-900 dark:text-dark-text"
                            placeholder="Email address" />
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium">Password</label>
                        <input id="password" name="password" type="password" autocomplete="new-password" required
                            v-model="form.password"
                            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-input text-gray-900 dark:text-dark-text"
                            placeholder="Password" />
                    </div>
                    <div>
                        <label for="password_confirmation" class="block text-sm font-medium">Confirm Password</label>
                        <input id="password_confirmation" name="password_confirmation" type="password"
                            autocomplete="new-password" required v-model="form.password_confirmation"
                            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-dark-input text-gray-900 dark:text-dark-text"
                            placeholder="Confirm Password" />
                    </div>
                </div>

                <div>
                    <button type="submit" :disabled="loading"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-yellow-600 hover:bg-blue-700 dark:hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <UserIcon class="h-5 w-5 text-blue-500 dark:text-yellow-500 group-hover:text-blue-400"
                                aria-hidden="true" />
                        </span>
                        {{ loading ? 'Creating account...' : 'Sign up' }}
                    </button>
                </div>

                <div class="text-center">
                    <p class="text-sm dark:text-yellow-500">
                        Already have an account?
                        <router-link to="/login"
                            class="font-medium text-blue-600 dark:text-yellow-500 hover:text-blue-500">
                            Sign in
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
import { UserIcon } from '@heroicons/vue/24/solid';
import { useAuth } from '@/Composables/useAuth';

const router = useRouter();
const { register } = useAuth();
const loading = ref(false);
const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
});

const handleRegister = async () => {
    loading.value = true;
    try {
        await register(form.value);
        router.push('/');
    } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
    } finally {
        loading.value = false;
    }
};
</script>