<template>
    <div class="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <!-- Register Form Card -->
            <div
                class="bg-light-card dark:bg-dark-card rounded-3xl shadow-soft dark:shadow-soft-dark p-8 border border-light-border dark:border-dark-border">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-light-text dark:text-dark-text">Create your account</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Join KA Toolkit today</p>
                </div>

                <form class="space-y-6" @submit.prevent="handleRegister">
                    <div class="space-y-4">
                        <div>
                            <label for="name"
                                class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Full
                                Name</label>
                            <input id="name" name="name" type="text" autocomplete="name" required v-model="form.name"
                                class="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                placeholder="Enter your full name" />
                        </div>
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
                            <input id="password" name="password" type="password" autocomplete="new-password" required
                                v-model="form.password"
                                class="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                placeholder="Create a password" />
                        </div>
                        <div>
                            <label for="password_confirmation"
                                class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Confirm
                                Password</label>
                            <input id="password_confirmation" name="password_confirmation" type="password"
                                autocomplete="new-password" required v-model="form.password_confirmation"
                                class="w-full px-4 py-3 border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                placeholder="Confirm your password" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" :disabled="loading"
                            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg">
                            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                <UserIcon class="h-5 w-5 text-primary-200 group-hover:text-primary-100"
                                    aria-hidden="true" />
                            </span>
                            {{ loading ? 'Creating account...' : 'Sign up' }}
                        </button>
                    </div>

                    <div class="text-center">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?
                            <router-link to="/login"
                                class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors">
                                Sign in
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