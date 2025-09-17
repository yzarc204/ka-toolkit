<template>
  <button @click="$emit('click')" :class="buttonClasses"
    class="flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
    {{ text }}
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'default', // 'default' or 'compact'
    validator: (value) => ['default', 'compact'].includes(value)
  }
});

const emit = defineEmits(['click']);

const text = computed(() => {
  return props.variant === 'compact' ? 'Add task' : 'Add Task';
});

const buttonClasses = computed(() => {
  const baseClasses = props.variant === 'compact'
    ? 'text-xs hover:underline'
    : 'w-full py-2 px-3 text-sm font-medium rounded-lg border border-dashed';

  const statusClasses = getStatusClasses(props.status);

  return `${baseClasses} ${statusClasses}`;
});

const getStatusClasses = (status) => {
  switch (status) {
    case 'todo':
      return 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20';
    case 'in_progress':
      return 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 border-yellow-300 dark:border-yellow-600 hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20';
    case 'completed':
      return 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 border-green-300 dark:border-green-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20';
    case 'deadline':
      return 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-red-300 dark:border-red-600 hover:border-red-400 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20';
    default:
      return 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20';
  }
};
</script>

