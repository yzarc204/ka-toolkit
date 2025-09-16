<template>
    <div class="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <!-- Register Form Card -->
            <div
                class="bg-light-card dark:bg-dark-card rounded-3xl shadow-soft dark:shadow-soft-dark p-8 border border-light-border dark:border-dark-border">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-light-text dark:text-dark-text">Create your account</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Sign up to get started</p>
                </div>

                <form class="space-y-6" @submit.prevent="handleRegister">
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
                            <label for="name"
                                class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Full
                                Name</label>
                            <input id="name" name="name" type="text" autocomplete="name" required v-model="form.name"
                                :class="[
                                    'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 transition-colors',
                                    fieldErrors.name
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-light-border dark:border-dark-border focus:ring-primary-500'
                                ]" placeholder="Enter your full name" />
                            <p v-if="fieldErrors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
                                {{ fieldErrors.name }}
                            </p>
                        </div>
                        <div>
                            <label for="email-address"
                                class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Email
                                address</label>
                            <input id="email-address" name="email" type="email" autocomplete="email" required
                                v-model="form.email" :class="[
                                    'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 transition-colors',
                                    fieldErrors.email
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-light-border dark:border-dark-border focus:ring-primary-500'
                                ]" placeholder="Enter your email" />
                            <p v-if="fieldErrors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
                                {{ fieldErrors.email }}
                            </p>
                        </div>
                        <div>
                            <label for="password"
                                class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Password</label>
                            <input id="password" name="password" type="password" autocomplete="new-password" required
                                v-model="form.password" :class="[
                                    'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 transition-colors',
                                    fieldErrors.password
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-light-border dark:border-dark-border focus:ring-primary-500'
                                ]" placeholder="Enter your password" />
                            <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
                                {{ fieldErrors.password }}
                            </p>
                        </div>
                        <div>
                            <label for="password_confirmation"
                                class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">Confirm
                                Password</label>
                            <input id="password_confirmation" name="password_confirmation" type="password"
                                autocomplete="new-password" required v-model="form.password_confirmation" :class="[
                                    'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 transition-colors',
                                    fieldErrors.password_confirmation
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-light-border dark:border-dark-border focus:ring-primary-500'
                                ]" placeholder="Confirm your password" />
                            <p v-if="fieldErrors.password_confirmation"
                                class="mt-1 text-sm text-red-600 dark:text-red-400">
                                {{ fieldErrors.password_confirmation }}
                            </p>
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
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const errorMessage = ref('');
const fieldErrors = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
});
const form = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
});

const clearErrors = () => {
    errorMessage.value = '';
    fieldErrors.value = {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    };
};

const handleRegister = async () => {
    loading.value = true;
    clearErrors();

    try {
        await authStore.register(form.value);
        router.push('/');
    } catch (error) {
        console.error('Registration failed:', error);

        // Handle field-specific errors
        // Laravel validation errors can be either in data.errors or directly in data
        const responseData = error.response?.data;
        let validationErrors = null;

        if (responseData?.errors) {
            // Standard Laravel format: {errors: {field: [messages]}}
            validationErrors = responseData.errors;
        } else if (responseData && typeof responseData === 'object' && !responseData.message) {
            // Direct validation format: {field: [messages]}
            validationErrors = responseData;
        }

        if (validationErrors) {
            // Set field-specific errors
            if (validationErrors.name) {
                fieldErrors.value.name = validationErrors.name[0];
            }
            if (validationErrors.email) {
                fieldErrors.value.email = validationErrors.email[0];
            }
            if (validationErrors.password) {
                fieldErrors.value.password = validationErrors.password[0];
            }
            if (validationErrors.password_confirmation) {
                fieldErrors.value.password_confirmation = validationErrors.password_confirmation[0];
            }

            // Set general error message if no specific field errors
            if (!Object.values(fieldErrors.value).some(error => error)) {
                errorMessage.value = 'Registration failed. Please check your information.';
            }
        } else if (responseData?.message) {
            errorMessage.value = responseData.message;
        } else {
            errorMessage.value = 'Registration failed. Please try again.';
        }
    } finally {
        loading.value = false;
    }
};

</script>