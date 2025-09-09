<template>
  <div class="min-h-screen flex bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
    <!-- Mobile overlay -->
    <div v-if="isMenuOpen" @click="toggleMenu" class="fixed inset-0 bg-black bg-opacity-50 z-[60] lg:hidden"></div>

    <!-- Sidebar -->
    <ToolkitSidebar :is-open="isMenuOpen" @close="toggleMenu" />

    <!-- Content area -->
    <div class="flex-1 flex flex-col min-w-0">
      <ToolkitTopbar @toggle-menu="toggleMenu" />
      <main class="flex-1 overflow-auto p-4 md:p-6">
        <router-view />
      </main>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import ToolkitSidebar from '@/Components/ToolkitSidebar.vue';
import ToolkitTopbar from '@/Components/ToolkitTopbar.vue';

const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>
