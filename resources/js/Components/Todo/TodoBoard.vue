<template>
  <div
    class="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col min-h-0">
    <!-- Header -->
    <div class="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div class="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white truncate">Todo Board</h3>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Manage your tasks</p>
          </div>
        </div>

        <button @click="openAddModal"
          class="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors flex-shrink-0">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span class="hidden sm:inline">Add Todo</span>
          <span class="sm:hidden">Add</span>
        </button>
      </div>
    </div>

    <!-- Todo Board -->
    <div class="flex-1 overflow-hidden p-2 sm:p-4">
      <div class="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Todo Column -->
        <TodoColumn title="Todo" :todos="todoStore.todos.filter(todo => todo.status === 'todo')" status="todo"
          @add-todo="openAddModal" @edit-todo="editTodo" @delete-todo="handleTodoDeleted" @move-todo="moveTodo"
          @drag-over="handleDragOver" @drop-completed="handleDropCompleted" />

        <!-- In Progress Column -->
        <TodoColumn title="In Progress" :todos="todoStore.todos.filter(todo => todo.status === 'in_progress')"
          status="in_progress" @add-todo="openAddModal" @edit-todo="editTodo" @delete-todo="handleTodoDeleted"
          @move-todo="moveTodo" @drag-over="handleDragOver" @drop-completed="handleDropCompleted" />

        <!-- Completed Column -->
        <TodoColumn title="Completed" :todos="todoStore.todos.filter(todo => todo.status === 'completed')"
          status="completed" @add-todo="openAddModal" @edit-todo="editTodo" @delete-todo="handleTodoDeleted"
          @move-todo="moveTodo" @drag-over="handleDragOver" @drop-completed="handleDropCompleted" />

        <!-- Deadline Column -->
        <TodoColumn title="Deadline" :todos="todoStore.todos.filter(todo => todo.status === 'deadline')"
          status="deadline" @add-todo="openAddModal" @edit-todo="editTodo" @delete-todo="handleTodoDeleted"
          @move-todo="moveTodo" @drag-over="handleDragOver" @drop-completed="handleDropCompleted" />
      </div>
    </div>
  </div>

  <!-- Modal -->
  <TodoModal :is-open="showModal" :editing-todo="editingTodo" @close="closeModal" @saved="handleTodoSaved" />

  <!-- Drag Preview -->
  <div v-if="dragPreview.show" class="drag-preview" :style="dragPreview.style">
    <div class="drag-preview-content">
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ dragPreview.todo.title }}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ dragPreview.todo.description || 'No description' }}</p>
        </div>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          :class="getPriorityClass(dragPreview.todo.priority)">
          {{ getPriorityText(dragPreview.todo.priority) }}
        </span>
        <span class="text-xs text-gray-400">Moving to {{ dragPreview.targetStatus }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useTodoStore } from '@/stores/todoStore';
import TodoColumn from './TodoColumn.vue';
import TodoModal from './TodoModal.vue';

const todoStore = useTodoStore();

// Modal state
const showModal = ref(false);
const editingTodo = ref(null);

// Drag preview state
const dragPreview = ref({
  show: false,
  todo: null,
  targetStatus: '',
  style: {}
});

// Methods
const openAddModal = () => {
  editingTodo.value = null;
  showModal.value = true;
};

const editTodo = (todo) => {
  editingTodo.value = todo;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingTodo.value = null;
};

const handleTodoSaved = () => {
  // Modal will close automatically after successful save
};

const handleTodoDeleted = (todo) => {
  console.log('Todo deleted:', todo);
};

const moveTodo = async (todo, newStatus) => {
  try {
    console.log('Moving todo:', {
      todoId: todo.id,
      title: todo.title,
      from: todo.status,
      to: newStatus
    });

    await todoStore.updateTodo(todo.id, { status: newStatus });

    console.log('Todo moved successfully');
  } catch (error) {
    console.error('Error moving todo:', error);

    // Show user-friendly error message
    if (error.response?.status === 422) {
      console.error('Validation error:', error.response.data);
      // You could show a toast notification here
    } else if (error.response?.status === 403) {
      console.error('Permission denied');
    } else {
      console.error('Unknown error occurred');
    }
  }
};

// Utility functions for drag preview
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
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  };
  return texts[priority] || 'Medium';
};

const getStatusText = (status) => {
  const texts = {
    todo: 'Todo',
    in_progress: 'In Progress',
    completed: 'Completed',
    deadline: 'Deadline'
  };
  return texts[status] || status;
};

// Drag preview management
const showDragPreview = (todo, targetStatus) => {
  dragPreview.value = {
    show: true,
    todo,
    targetStatus: getStatusText(targetStatus),
    style: {
      position: 'fixed',
      top: '0px',
      left: '0px',
      zIndex: '9999',
      pointerEvents: 'none'
    }
  };
};

const hideDragPreview = () => {
  dragPreview.value.show = false;
};

// Mouse tracking for drag preview
const updateDragPreviewPosition = (event) => {
  if (dragPreview.value.show) {
    // Use transform for better performance
    const previewElement = document.querySelector('.drag-preview');
    if (previewElement) {
      previewElement.style.transform = `translate(${event.clientX + 15}px, ${event.clientY + 15}px)`;
    }
  }
};

// Alternative approach - use dragover event as backup
const handleDragOverGlobal = (event) => {
  if (dragPreview.value.show) {
    // Use transform for better performance
    const previewElement = document.querySelector('.drag-preview');
    if (previewElement) {
      previewElement.style.transform = `translate(${event.clientX + 15}px, ${event.clientY + 15}px)`;
    }
  }
};

// Event listeners for drag preview
const handleDragStart = (event) => {
  const todoData = JSON.parse(event.dataTransfer.getData('text/plain'));
  const todo = todoStore.todos.find(t => t.id === todoData.todoId);
  if (todo) {
    showDragPreview(todo, todo.status);
  }
};

const handleDragEnd = () => {
  hideDragPreviewWithTimeout();
};

const handleDragOver = (targetStatus) => {
  if (dragPreview.value.show && dragPreview.value.todo) {
    dragPreview.value.targetStatus = getStatusText(targetStatus);
  }
};

const handleDropCompleted = () => {
  // Hide drag preview immediately after successful drop
  hideDragPreview();
};

// Add timeout to ensure preview is hidden even if drop fails
const hideDragPreviewWithTimeout = () => {
  hideDragPreview();
  // Also hide after a short delay to ensure it's hidden
  setTimeout(() => {
    hideDragPreview();
  }, 100);
};

// Lifecycle
onMounted(async () => {
  await todoStore.fetchTodos();

  // Add global drag event listeners
  document.addEventListener('dragstart', handleDragStart);
  document.addEventListener('dragend', handleDragEnd);

  // Add both mousemove and dragover listeners for drag preview following
  document.addEventListener('mousemove', updateDragPreviewPosition);
  document.addEventListener('dragover', handleDragOverGlobal);
});

onUnmounted(() => {
  // Remove global drag event listeners
  document.removeEventListener('dragstart', handleDragStart);
  document.removeEventListener('dragend', handleDragEnd);

  // Remove mouse tracking listeners
  document.removeEventListener('mousemove', updateDragPreviewPosition);
  document.removeEventListener('dragover', handleDragOverGlobal);
});
</script>

<style scoped>
.drag-preview {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: dragPreviewSlide 0.3s ease-out;
  max-width: 300px;
  transition: transform 0.1s ease-out;
  transform-origin: top left;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
}

.drag-preview-content {
  animation: dragPreviewPulse 2s ease-in-out infinite;
}

@keyframes dragPreviewSlide {
  from {
    opacity: 0;
    transform: translateX(100px) scale(0.8);
  }

  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes dragPreviewPulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }
}

/* Dark mode support */
.dark .drag-preview {
  background: rgba(31, 41, 55, 0.95);
  border-color: #60a5fa;
}
</style>
