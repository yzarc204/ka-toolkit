<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-light-card dark:bg-dark-card rounded-xl p-6 w-full max-w-md mx-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-light-text dark:text-dark-text">
          {{ editingTodo ? 'Edit Todo' : 'Add New Todo' }}
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Title *
          </label>
          <input v-model="form.title" type="text" required
            class="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400">
        </div>

        <div>
          <label class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Description
          </label>
          <textarea v-model="form.description" rows="3"
            class="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400"></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              Status
            </label>
            <select v-model="form.status"
              class="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text">
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
              Priority
            </label>
            <select v-model="form.priority"
              class="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Due Date
          </label>
          <input v-model="form.due_date" type="date"
            class="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text">
        </div>

        <!-- Error Message -->
        <div v-if="todoStore.error"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div class="flex">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-600 dark:text-red-400">{{ todoStore.error }}</p>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="closeModal"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            Cancel
          </button>
          <button type="submit" :disabled="todoStore.loading"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors">
            {{ todoStore.loading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTodoStore } from '@/stores/todoStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  editingTodo: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'saved']);

const todoStore = useTodoStore();

const form = ref({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: ''
});

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: ''
  };
};

// Watch for editingTodo changes
watch(() => props.editingTodo, (newTodo) => {
  if (newTodo) {
    form.value = {
      title: newTodo.title,
      description: newTodo.description || '',
      status: newTodo.status,
      priority: newTodo.priority,
      due_date: newTodo.due_date || ''
    };
  } else {
    resetForm();
  }
}, { immediate: true });

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetForm();
    todoStore.clearError();
  }
});

const handleSubmit = async () => {
  try {
    if (props.editingTodo) {
      await todoStore.updateTodo(props.editingTodo.id, form.value);
    } else {
      await todoStore.createTodo(form.value);
    }

    emit('saved');
    closeModal();
  } catch (error) {
    console.error('Error saving todo:', error);
  }
};

const closeModal = () => {
  emit('close');
};
</script>
