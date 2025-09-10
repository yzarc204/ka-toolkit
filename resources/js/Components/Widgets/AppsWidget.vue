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
        {{ filteredApps.length }} apps
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
        <input v-model="searchQuery" type="text" placeholder="Tìm kiếm tools..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
      </div>
    </div>

    <!-- Apps Grid -->
    <div class="flex-grow overflow-y-auto">
      <div v-if="filteredApps.length > 0" class="grid grid-cols-3 gap-3">
        <div v-for="app in filteredApps" :key="app.id" class="group cursor-pointer" @click="openApp(app)">
          <div class="p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-center">
            <!-- App Icon -->
            <div class="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center"
              :style="{ backgroundColor: app.color }">
              <component :is="iconComponents[app.icon]" class="w-6 h-6 text-white" />
            </div>

            <!-- App Name -->
            <div
              class="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
              {{ app.name }}
            </div>

            <!-- App Category -->
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ app.category }}
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="flex flex-col items-center justify-center h-full text-center py-8">
        <svg class="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.491M15 6.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
        </svg>
        <p class="text-sm text-gray-500 dark:text-gray-400">Không tìm thấy tool nào</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Thử từ khóa khác</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-4 pt-3 border-t border-gray-200 dark:border-dark-border">
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Tools</span>
        <button @click="refreshApps" class="text-purple-600 dark:text-purple-400 hover:underline">
          Làm mới
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  DocumentTextIcon,
  ClockIcon,
  CloudIcon,
  NewspaperIcon,
  CalculatorIcon,
  StopIcon,
  QrCodeIcon,
  SwatchIcon,
  KeyIcon,
  DocumentIcon,
  PhotoIcon,
  ScaleIcon
} from '@heroicons/vue/24/outline';

// Reactive data
const apps = ref([]);
const searchQuery = ref('');
const router = useRouter();

// Icon components mapping
const iconComponents = {
  DocumentTextIcon,
  ClockIcon,
  CloudIcon,
  NewspaperIcon,
  CalculatorIcon,
  StopIcon,
  QrCodeIcon,
  SwatchIcon,
  KeyIcon,
  DocumentIcon,
  PhotoIcon,
  ScaleIcon
};

// Toolkit apps data
const appsData = [
  {
    id: 1,
    name: 'Notes',
    icon: 'DocumentTextIcon',
    category: 'Writing',
    color: '#10b981',
    route: '/note'
  },
  {
    id: 2,
    name: 'Clock',
    icon: 'ClockIcon',
    category: 'Time',
    color: '#3b82f6',
    route: '/clock'
  },
  {
    id: 3,
    name: 'Weather',
    icon: 'CloudIcon',
    category: 'Weather',
    color: '#06b6d4',
    route: '/weather'
  },
  {
    id: 4,
    name: 'News',
    icon: 'NewspaperIcon',
    category: 'News',
    color: '#ef4444',
    route: '/news'
  },
  {
    id: 5,
    name: 'Calculator',
    icon: 'CalculatorIcon',
    category: 'Math',
    color: '#8b5cf6',
    route: '/calculator'
  },
  {
    id: 6,
    name: 'Timer',
    icon: 'StopIcon',
    category: 'Time',
    color: '#f59e0b',
    route: '/timer'
  },
  {
    id: 7,
    name: 'QR Generator',
    icon: 'QrCodeIcon',
    category: 'Utility',
    color: '#6366f1',
    route: '/qr-generator'
  },
  {
    id: 8,
    name: 'Color Picker',
    icon: 'SwatchIcon',
    category: 'Design',
    color: '#ec4899',
    route: '/color-picker'
  },
  {
    id: 9,
    name: 'Password Generator',
    icon: 'KeyIcon',
    category: 'Security',
    color: '#059669',
    route: '/password-generator'
  },
  {
    id: 10,
    name: 'Text Tools',
    icon: 'DocumentIcon',
    category: 'Text',
    color: '#dc2626',
    route: '/text-tools'
  },
  {
    id: 11,
    name: 'Image Converter',
    icon: 'PhotoIcon',
    category: 'Media',
    color: '#7c3aed',
    route: '/image-converter'
  },
  {
    id: 12,
    name: 'Unit Converter',
    icon: 'ScaleIcon',
    category: 'Convert',
    color: '#ea580c',
    route: '/unit-converter'
  }
];

// Computed filtered apps
const filteredApps = computed(() => {
  if (!searchQuery.value.trim()) {
    return apps.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return apps.value.filter(app =>
    app.name.toLowerCase().includes(query) ||
    app.category.toLowerCase().includes(query)
  );
});

// Initialize apps
const initializeApps = () => {
  apps.value = appsData;
};

// Open app
const openApp = (app) => {
  if (app.route) {
    router.push(app.route);
  }
};

// Refresh apps
const refreshApps = () => {
  // Reinitialize apps
  apps.value = [...appsData];
  searchQuery.value = '';
};

// Lifecycle
onMounted(() => {
  initializeApps();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
.flex-grow::-webkit-scrollbar {
  width: 4px;
}

.flex-grow::-webkit-scrollbar-track {
  background: transparent;
}

.flex-grow::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}

.dark .flex-grow::-webkit-scrollbar-thumb {
  background: #4a5568;
}
</style>
