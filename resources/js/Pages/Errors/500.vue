<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <!-- Error Icon -->
      <div class="mb-8">
        <div class="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Error Content -->
      <div class="mb-8">
        <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">500</h1>
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Internal Server Error</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Oops! Something went wrong on our end. We're working to fix this issue. Please try again later or contact
          support if the problem persists.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-4">
        <button @click="goHome"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
          Go to Homepage
        </button>

      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.min-h-screen {
  animation: fadeIn 0.6s ease-out;
}

</style>
