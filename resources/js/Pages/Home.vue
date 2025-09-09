<template>
  <div class="space-y-6">
    <!-- Hero card -->
    <div
      class="p-6 rounded-3xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border flex flex-col md:flex-row items-center gap-6">
      <div class="flex-1">
        <h2 class="text-3xl md:text-4xl font-semibold leading-tight">Get Thousands Premium Tools.</h2>
        <p class="opacity-80 mt-2">Upgrade to access more utilities, speed up your workflow, and explore.</p>
        <div class="mt-4 flex items-center space-x-3">
          <RouterLink to="/tools/notes"
            class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Open Notes</RouterLink>
          <button class="px-4 py-2 rounded-xl bg-gray-900/5 dark:bg-white/10 text-sm">Learn more</button>
        </div>
      </div>
      <div class="w-full md:w-72 h-40 md:h-48 rounded-3xl bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      </div>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <RouterLink to="/tools/notes"
        class="block p-5 rounded-2xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border hover:shadow">
        <div class="text-sm opacity-70 mb-1">Tool</div>
        <div class="font-medium">Notes</div>
        <div class="text-xs opacity-70 mt-1">Ghi chú, chia sẻ và định dạng nội dung.</div>
      </RouterLink>
      <div
        class="p-5 rounded-2xl bg-white/60 dark:bg-dark-bg/60 border border-dashed border-gray-300 dark:border-dark-border/50">
        Sắp ra mắt</div>
      <div
        class="p-5 rounded-2xl bg-white/60 dark:bg-dark-bg/60 border border-dashed border-gray-300 dark:border-dark-border/50">
        Sắp ra mắt</div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
