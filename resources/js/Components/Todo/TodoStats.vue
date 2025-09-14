<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
    <!-- Total Todos -->
    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
      <div class="flex items-center">
        <div
          class="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div class="ml-2 sm:ml-3 min-w-0 flex-1">
          <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Tổng cộng</p>
          <p class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{{ todoStore.todos.length }}</p>
        </div>
      </div>
    </div>

    <!-- In Progress -->
    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
      <div class="flex items-center">
        <div
          class="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-2 sm:ml-3 min-w-0 flex-1">
          <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Đang làm</p>
          <p class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{{ todoStore.inProgressCount }}</p>
        </div>
      </div>
    </div>

    <!-- Completed -->
    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
      <div class="flex items-center">
        <div
          class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div class="ml-2 sm:ml-3 min-w-0 flex-1">
          <p class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Hoàn thành</p>
          <p class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{{ todoStore.completedCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTodoStore } from '@/stores/todoStore';

const todoStore = useTodoStore();
</script>