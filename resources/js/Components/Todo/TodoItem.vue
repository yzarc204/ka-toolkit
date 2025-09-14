<template>
  <div class="p-3 sm:p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-move" :data-id="todo.id">
    <div class="flex items-start sm:items-center space-x-2 sm:space-x-4">
      <!-- Drag Handle -->
      <div class="flex-shrink-0 cursor-move mt-1 sm:mt-0">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </div>

      <!-- Checkbox -->
      <div class="flex-shrink-0 mt-1 sm:mt-0">
        <input type="checkbox" :checked="todo.status === 'completed'" @change="handleToggle"
          class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <h3 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate"
            :class="{ 'line-through text-gray-500 dark:text-gray-400': todo.status === 'completed' }">
            {{ todo.title }}
          </h3>

          <!-- Priority & Status Badges -->
          <div class="flex flex-wrap gap-1 sm:gap-2">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              :class="getPriorityClass(todo.priority)">
              {{ getPriorityText(todo.priority) }}
            </span>

            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              :class="getStatusClass(todo.status)">
              {{ getStatusText(todo.status) }}
            </span>
          </div>
        </div>

        <p v-if="todo.description" class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {{ todo.description }}
        </p>

        <div
          class="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
          <span v-if="todo.due_date" class="flex items-center">
            <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(todo.due_date) }}
          </span>
          <span class="flex items-center">
            <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ formatDateTime(todo.created_at) }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex-shrink-0 flex items-center space-x-1 sm:space-x-2">
        <button @click="$emit('edit', todo)"
          class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1">
          <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button @click="handleDelete"
          class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1">
          <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTodoStore } from '@/stores/todoStore';
import { globalConfirm } from '@/Composables/useConfirm';

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

const todoStore = useTodoStore();

const handleToggle = async () => {
  try {
    await todoStore.toggleTodoStatus(props.todo);
  } catch (error) {
    console.error('Error toggling todo:', error);
  }
};

const handleDelete = async () => {
  try {
    const confirmed = await globalConfirm.confirmDanger(
      'Bạn có chắc chắn muốn xóa todo này?',
      {
        title: 'Xóa Todo',
        description: 'Hành động này không thể hoàn tác.',
        confirmText: 'Xóa',
        cancelText: 'Hủy'
      }
    );

    if (!confirmed) return;

    globalConfirm.setLoading(true, 'Đang xóa...');

    await todoStore.deleteTodo(props.todo.id);
    emit('delete', props.todo);
  } catch (error) {
    console.error('Error deleting todo:', error);
  } finally {
    globalConfirm.setLoading(false);
  }
};

// Utility functions
const getPriorityClass = (priority) => {
  const classes = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };
  return classes[priority] || classes.medium;
};

const getPriorityText = (priority) => {
  const texts = {
    low: 'Thấp',
    medium: 'Trung bình',
    high: 'Cao'
  };
  return texts[priority] || 'Trung bình';
};

const getStatusClass = (status) => {
  const classes = {
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  };
  return classes[status] || classes.todo;
};

const getStatusText = (status) => {
  const texts = {
    todo: 'Chưa làm',
    in_progress: 'Đang làm',
    completed: 'Hoàn thành'
  };
  return texts[status] || 'Chưa làm';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('vi-VN');
};
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>