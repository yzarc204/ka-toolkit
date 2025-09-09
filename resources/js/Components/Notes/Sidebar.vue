<template>
  <div
    class="w-full md:w-80 border-r border-light-border dark:border-dark-border bg-light-sidebar dark:bg-dark-sidebar overflow-y-auto h-full">
    <div class="p-4">
      <div class="relative mb-4">
        <input type="text" :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)"
          placeholder="Search notes"
          class="w-full pl-10 pr-4 py-2 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400" />
        <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <!-- Add New Note Button -->
      <button @click="$emit('create-note')"
        class="w-full flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
        <PlusIcon class="h-5 w-5 mr-2" />
        New Note
      </button>
    </div>

    <div class="space-y-1 px-2 pb-4">
      <div v-for="note in notes" :key="note.id" @click="$emit('select-note', note)" :class="[
        'p-4 rounded-lg cursor-pointer transition-colors',
        selectedNote?.id === note.id
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

      <div v-if="notes.length === 0" class="text-center py-8 opacity-60 text-gray-500 dark:text-gray-400">
        No notes found
      </div>
    </div>
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon, GlobeAltIcon, LockClosedIcon, UserGroupIcon, PlusIcon } from '@heroicons/vue/24/outline';

defineProps({
  notes: {
    type: Array,
    required: true
  },
  selectedNote: {
    type: Object,
    default: null
  },
  searchQuery: {
    type: String,
    required: true
  }
});

defineEmits(['select-note', 'update:searchQuery', 'create-note']);

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
