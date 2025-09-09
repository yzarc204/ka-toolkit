<template>
  <div @click="$emit('select-note', note)" :class="[
    'p-4 rounded-lg cursor-pointer transition-colors',
    isSelected
      ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500'
      : 'hover:bg-light-hover dark:hover:bg-dark-hover'
  ]">
    <div class="flex justify-between items-start">
      <h3 class="font-medium truncate text-light-text dark:text-dark-text">{{ note.title }}</h3>
      <span class="text-xs opacity-75 text-gray-500 dark:text-gray-400">{{ formatDate(note.updated_at) }}</span>
    </div>
    <p class="text-sm mt-1 truncate opacity-90 text-gray-600 dark:text-gray-300">{{ stripHtml(note.content) }}</p>
    <div class="flex items-center mt-2">
      <div v-if="note.is_public" class="flex items-center text-xs opacity-75 text-green-600 dark:text-green-400">
        <GlobeAltIcon class="h-3 w-3 mr-1" />
        <span>Public</span>
      </div>
      <div v-else class="flex items-center text-xs opacity-75 text-gray-500 dark:text-gray-400">
        <LockClosedIcon class="h-3 w-3 mr-1" />
        <span>Private</span>
      </div>
      <div v-if="note.shared_with && note.shared_with.length > 0"
        class="flex items-center text-xs opacity-75 text-blue-600 dark:text-blue-400 ml-2">
        <UserGroupIcon class="h-3 w-3 mr-1" />
        <span>{{ note.shared_with.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { GlobeAltIcon, LockClosedIcon, UserGroupIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  note: {
    type: Object,
    required: true
  },
  selectedNote: {
    type: Object,
    default: null
  }
});

defineEmits(['select-note']);

const isSelected = computed(() => {
  return props.selectedNote?.id === props.note.id;
});

// Helper function to strip HTML tags
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
};
</script>
