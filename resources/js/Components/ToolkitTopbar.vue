<template>
  <header
    class="h-16 flex items-center justify-between px-4 md:px-6 bg-light-bg/70 dark:bg-dark-bg/70 backdrop-blur border-b border-light-border dark:border-dark-border">
    <div class="flex items-center space-x-3 lg:hidden">
      <button @click="$emit('toggle-menu')"
        class="px-2 py-1 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover">☰</button>
      <div class="text-sm font-semibold">KA TOOLKIT</div>

      <!-- Mobile Search Button -->
      <button @click="showMobileSearch = !showMobileSearch"
        class="px-2 py-1 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover">🔎</button>
    </div>

    <!-- Mobile Search -->
    <div v-if="showMobileSearch" class="md:hidden w-full px-4 mb-4">
      <div class="relative">
        <div class="flex items-center gap-2 w-full bg-light-hover dark:bg-dark-hover rounded-xl px-3 py-2">
          <span class="text-gray-500">🔎</span>
          <input v-model="searchQuery" @focus="showSearchResults = true" @keydown="handleKeydown" type="text"
            placeholder="Search tools..." class="bg-transparent outline-none w-full text-sm" />
        </div>

        <!-- Mobile Search Results -->
        <div v-if="showSearchResults && (searchQuery || filteredResults.length > 0)"
          class="absolute top-full left-0 right-0 mt-2 bg-light-card dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border shadow-lg z-50 max-h-80 overflow-y-auto">

          <!-- Quick Actions -->
          <div v-if="!searchQuery" class="p-3 border-b border-light-border dark:border-dark-border">
            <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Quick
              Access</h3>
            <div class="space-y-1">
              <button v-for="tool in toolsStore.activeTools.slice(0, 3)" :key="tool.id" @click="navigateToTool(tool)"
                class="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                  :style="{ backgroundColor: tool.color }">
                  <component :is="toolsStore.iconComponents[tool.icon]" class="w-4 h-4 text-white" />
                </div>
                <div class="text-left">
                  <div class="text-sm font-medium text-light-text dark:text-dark-text">{{ tool.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ tool.description }}</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="searchQuery" class="p-3">
            <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Results ({{ filteredResults.length }})
            </h3>

            <div v-if="filteredResults.length > 0" class="space-y-1">
              <button v-for="(result, index) in filteredResults" :key="result.id" @click="navigateToTool(result)"
                :class="[
                  'w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                  selectedIndex === index
                    ? 'bg-primary-100 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                    : 'hover:bg-light-hover dark:hover:bg-dark-hover'
                ]">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                  :style="{ backgroundColor: result.color }">
                  <component :is="toolsStore.iconComponents[result.icon]" class="w-4 h-4 text-white" />
                </div>
                <div class="text-left flex-1">
                  <div class="text-sm font-medium text-light-text dark:text-dark-text">{{ result.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ result.description }}</div>
                </div>
              </button>
            </div>

            <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
              <div class="text-sm">No tools found</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hidden md:flex items-center w-full max-w-xl mx-4">
      <div class="relative w-full">
        <div class="flex items-center gap-2 w-full bg-light-hover dark:bg-dark-hover rounded-xl px-3 py-2">
          <span class="text-gray-500">🔎</span>
          <input v-model="searchQuery" @focus="showSearchResults = true" @keydown="handleKeydown" type="text"
            placeholder="Search tools, notes..." class="bg-transparent outline-none w-full text-sm" />
        </div>

        <!-- Search Results Dropdown -->
        <div v-if="showSearchResults && (searchQuery || filteredResults.length > 0)"
          class="absolute top-full left-0 right-0 mt-2 bg-light-card dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border shadow-lg z-50 max-h-96 overflow-y-auto">

          <!-- Quick Actions -->
          <div v-if="!searchQuery" class="p-3 border-b border-light-border dark:border-dark-border">
            <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Quick
              Access</h3>
            <div class="space-y-1">
              <button v-for="tool in toolsStore.activeTools.slice(0, 4)" :key="tool.id" @click="navigateToTool(tool)"
                class="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                  :style="{ backgroundColor: tool.color }">
                  <component :is="toolsStore.iconComponents[tool.icon]" class="w-4 h-4 text-white" />
                </div>
                <div class="text-left">
                  <div class="text-sm font-medium text-light-text dark:text-dark-text">{{ tool.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ tool.description }}</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="searchQuery" class="p-3">
            <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Search Results ({{ filteredResults.length }})
            </h3>

            <div v-if="filteredResults.length > 0" class="space-y-1">
              <button v-for="(result, index) in filteredResults" :key="result.id" @click="navigateToTool(result)"
                :class="[
                  'w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                  selectedIndex === index
                    ? 'bg-primary-100 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                    : 'hover:bg-light-hover dark:hover:bg-dark-hover'
                ]">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                  :style="{ backgroundColor: result.color }">
                  <component :is="toolsStore.iconComponents[result.icon]" class="w-4 h-4 text-white" />
                </div>
                <div class="text-left flex-1">
                  <div class="text-sm font-medium text-light-text dark:text-dark-text">{{ result.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ result.description }}</div>
                </div>
                <div class="text-xs text-gray-400 dark:text-gray-500">{{ result.route }}</div>
              </button>
            </div>

            <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
              <div class="text-sm">No tools found</div>
              <div class="text-xs mt-1">Try a different search term</div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-3 border-t border-light-border dark:border-dark-border bg-gray-50 dark:bg-gray-800/50">
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Press <kbd class="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> to select</span>
              <span>Press <kbd class="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative flex items-center space-x-3">
      <!-- Dark mode toggle -->
      <button @click="toggleDarkMode"
        class="p-2 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors" title="Toggle dark mode">
        <span v-if="!isDarkMode" class="text-lg">🌙</span>
        <span v-else class="text-lg">☀️</span>
      </button>

      <!-- Avatar -->
      <button @click="toggleUserMenu"
        class="h-9 w-9 rounded-full overflow-hidden border border-light-border dark:border-dark-border focus:outline-none">
        <img :src="avatarUrl" alt="avatar" class="h-full w-full object-cover" />
      </button>

      <!-- Dropdown -->
      <div v-if="showUserMenu"
        class="absolute right-0 top-12 w-48 bg-light-card dark:bg-dark-hover rounded-xl border border-light-border dark:border-dark-border shadow-lg py-2 z-10">
        <div class="px-3 pb-2 text-xs opacity-70">{{ user?.name || 'User' }}</div>
        <button @click="goProfile"
          class="w-full text-left px-3 py-2 text-sm hover:bg-light-hover dark:hover:bg-dark-bg">Profile</button>
        <button @click="handleLogout"
          class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-bg">Sign out</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { useToolsStore } from '@/stores/toolsStore';

defineEmits(['toggle-menu']);

const authStore = useAuthStore();
const uiStore = useUIStore();
const toolsStore = useToolsStore();
const router = useRouter();

// Search functionality
const searchQuery = ref('');
const showSearchResults = ref(false);
const showMobileSearch = ref(false);
const selectedIndex = ref(-1);

// User menu
const showUserMenu = ref(false);
const toggleUserMenu = () => { showUserMenu.value = !showUserMenu.value; };

// Computed properties
const user = computed(() => authStore.user);
const isDarkMode = computed(() => uiStore.isDarkMode);

const avatarUrl = computed(() => {
  const name = (user.value?.name || 'User').trim();
  const encoded = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encoded}&background=14b8a6&color=ffffff&size=128&bold=true`;
});

// Search results
const filteredResults = computed(() => {
  if (!searchQuery.value) return [];

  const query = searchQuery.value.toLowerCase();
  return toolsStore.activeTools.filter(tool =>
    tool.name.toLowerCase().includes(query) ||
    tool.description.toLowerCase().includes(query) ||
    tool.tags.some(tag => tag.toLowerCase().includes(query))
  );
});

// Keyboard navigation
const handleKeydown = (event) => {
  if (!showSearchResults.value) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, filteredResults.value.length - 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      break;
    case 'Enter':
      event.preventDefault();
      if (selectedIndex.value >= 0 && filteredResults.value[selectedIndex.value]) {
        navigateToTool(filteredResults.value[selectedIndex.value]);
      }
      break;
    case 'Escape':
      event.preventDefault();
      closeSearchResults();
      break;
  }
};

// Navigation
const navigateToTool = (tool) => {
  router.push(tool.route);
  closeSearchResults();
};

const closeSearchResults = () => {
  showSearchResults.value = false;
  showMobileSearch.value = false;
  selectedIndex.value = -1;
};

// Watch search query to reset selection
watch(searchQuery, () => {
  selectedIndex.value = -1;
});

// Click outside handler
const handleClickOutside = (e) => {
  if (!(e.target.closest && e.target.closest('.relative'))) {
    showUserMenu.value = false;
    closeSearchResults();
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

// Methods
const toggleDarkMode = () => {
  uiStore.toggleDarkMode();
};

const handleLogout = async () => {
  try {
    authStore.logout();
    router.push('/login');
  } catch (err) { }
};

const goProfile = () => {
  router.push('/profile');
  showUserMenu.value = false;
};
</script>
