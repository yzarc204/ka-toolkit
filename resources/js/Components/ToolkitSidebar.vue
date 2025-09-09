<template>
  <aside :class="[
    'w-64 bg-light-sidebar dark:bg-dark-sidebar border-r border-light-border dark:border-dark-border',
    // Desktop: always visible, mobile: conditional
    'lg:flex lg:flex-col',
    // Mobile: conditional visibility
    isOpen ? 'fixed inset-y-0 left-0 z-[70] flex flex-col' : 'hidden lg:flex'
  ]">
    <div class="h-16 flex items-center px-6 border-b border-light-border dark:border-dark-border">
      <div class="flex items-center space-x-2">
        <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600"></div>
        <div>
          <div class="text-sm font-semibold tracking-wide">KA TOOLKIT</div>
          <div class="text-[11px] opacity-60 -mt-0.5">by Kỳ Anh</div>
        </div>
      </div>

      <!-- Close button for mobile -->
      <button @click="$emit('close')"
        class="ml-auto lg:hidden p-2 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      <RouterLink v-for="item in items" :key="item.to" :to="item.to"
        class="flex items-center px-3 py-2 rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition"
        :class="{ 'bg-light-hover dark:bg-dark-hover': $route.path === item.to }" @click="handleNavigation">
        <span class="mr-3 text-gray-500">{{ item.icon }}</span>
        <span class="text-sm font-medium">{{ item.label }}</span>
      </RouterLink>

      <div class="mt-6 text-xs uppercase tracking-wider px-3 opacity-60">Utilities</div>
      <div class="px-3 py-2 text-xs opacity-70">Sắp ra mắt</div>
    </nav>

    <div class="px-4 py-4 border-t border-light-border dark:border-dark-border text-xs opacity-60">
      v1.0.0
    </div>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { nextTick } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const handleNavigation = async () => {
  // Only close menu on mobile (when isOpen is true)
  if (props.isOpen) {
    // Wait for navigation to complete and DOM to update
    await nextTick();

    // Close menu after a small delay to ensure navigation completes
    setTimeout(() => {
      emit('close');
    }, 150);
  }
};

const items = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/tools/notes', label: 'Notes', icon: '📝' },
];
</script>
