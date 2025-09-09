<template>
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
</template>

<script setup>
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/outline';

defineProps({
  searchQuery: {
    type: String,
    required: true
  }
});

defineEmits(['update:searchQuery', 'create-note']);
</script>
