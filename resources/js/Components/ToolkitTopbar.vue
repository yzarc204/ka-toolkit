<template>
  <header
    class="h-16 flex items-center justify-between px-4 md:px-6 bg-light-bg/70 dark:bg-dark-bg/70 backdrop-blur border-b border-light-border dark:border-dark-border">
    <div class="flex items-center space-x-3 lg:hidden">
      <button @click="$emit('toggle-menu')"
        class="px-2 py-1 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover">☰</button>
      <div class="text-sm font-semibold">KA TOOLKIT</div>
    </div>

    <div class="hidden md:flex items-center w-full max-w-xl mx-4">
      <div class="flex items-center gap-2 w-full bg-light-hover dark:bg-dark-hover rounded-xl px-3 py-2">
        <span class="text-gray-500">🔎</span>
        <input type="text" placeholder="Search tools, notes..." class="bg-transparent outline-none w-full text-sm" />
      </div>
    </div>

    <div class="relative flex items-center space-x-3">
      <button class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">Upgrade</button>

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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';

defineEmits(['toggle-menu']);

const authStore = useAuthStore();
const uiStore = useUIStore();
const router = useRouter();

const showUserMenu = ref(false);
const toggleUserMenu = () => { showUserMenu.value = !showUserMenu.value; };

const handleClickOutside = (e) => {
  if (!(e.target.closest && e.target.closest('.relative'))) {
    showUserMenu.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

const user = computed(() => authStore.user);
const isDarkMode = computed(() => uiStore.isDarkMode);

const avatarUrl = computed(() => {
  const name = (user.value?.name || 'User').trim();
  const encoded = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encoded}&background=14b8a6&color=ffffff&size=128&bold=true`;
});

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
