<template>
  <div class="space-y-1 px-2 pb-4">
    <NoteItem v-for="note in notes" :key="note.id" :note="note" :selected-note="selectedNote"
      @select-note="$emit('select-note', $event)" />

    <div v-if="notes.length === 0" class="text-center py-8 opacity-60 text-gray-500 dark:text-gray-400">
      No notes found
    </div>
  </div>
</template>

<script setup>
import NoteItem from './NoteItem.vue';

defineProps({
  notes: {
    type: Array,
    required: true
  },
  selectedNote: {
    type: Object,
    default: null
  }
});

defineEmits(['select-note']);
</script>
