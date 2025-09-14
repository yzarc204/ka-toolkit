<template>
  <div
    class="h-full p-6 rounded-2xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Toolkit</h3>
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400">
        {{ filteredTools.length }} apps
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mb-4">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input v-model="toolsStore.searchQuery" type="text" placeholder="Tìm kiếm tools..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
      </div>
    </div>


    <!-- Apps Grid -->
    <div class="flex-grow overflow-y-auto apps-scrollable">
      <div v-if="filteredTools.length > 0" class="grid grid-cols-3 gap-3">
        <div v-for="tool in filteredTools" :key="tool.id" class="group cursor-pointer" @click="openApp(tool)">
          <div class="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-center">
            <!-- App Icon -->
            <div class="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center"
              :style="{ backgroundColor: tool.color }">
              <component :is="toolsStore.iconComponents[tool.icon]" class="w-6 h-6 text-white" />
            </div>

            <!-- App Name -->
            <div
              class="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
              {{ tool.name }}
            </div>

            <!-- App Description -->
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {{ tool.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
        <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-sm">Không tìm thấy tools nào</p>
        <button @click="toolsStore.clearFilters" class="text-xs text-purple-500 hover:text-purple-600 mt-1">
          Xóa bộ lọc
        </button>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{{ toolsStore.stats.active }} tools hoạt động</span>
        <span>{{ toolsStore.stats.total }} tổng cộng</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToolsStore } from '@/stores/toolsStore';

const router = useRouter();
const toolsStore = useToolsStore();

// Computed
const filteredTools = computed(() => toolsStore.filteredTools);

// Methods
const openApp = (tool) => {
  router.push(tool.route);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar - same as NewsWidget */
.apps-scrollable::-webkit-scrollbar {
  width: 4px;
}

.apps-scrollable::-webkit-scrollbar-track {
  background: transparent;
}

.apps-scrollable::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}

.dark .apps-scrollable::-webkit-scrollbar-thumb {
  background: #4a5568;
}
</style>