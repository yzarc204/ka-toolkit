<template>
  <div class="space-y-6">
    <!-- Hero card -->
    <div
      class="p-6 rounded-3xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border flex flex-col md:flex-row items-center gap-6">
      <div class="flex-1">
        <h2 class="text-3xl md:text-4xl font-semibold leading-tight">Get Thousands Premium Tools.</h2>
        <p class="opacity-80 mt-2">A tons of tools to help you work faster and smarter.</p>
        <div class="mt-4 flex items-center space-x-3">
          <button class="px-4 py-2 rounded-xl bg-gray-900/5 dark:bg-white/10 text-sm">Learn more</button>
        </div>
      </div>
      <div class="w-full md:w-72 h-40 md:h-48 rounded-3xl bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      </div>
    </div>

    <!-- Dashboard Widgets -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Clock Widget -->
      <ClockWidget />
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import ClockWidget from '@/Components/ClockWidget.vue';
</script>
