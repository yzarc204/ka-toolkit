<template>
  <div
    class="todo-item bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 cursor-move"
    draggable="true" @dragstart="handleDragStart" @dragend="handleDragEnd">
    <div class="flex items-start space-x-3">
      <!-- Drag Handle -->
      <div
        class="cursor-move flex-shrink-0 mt-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors">
        <svg class="w-4 h-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h4 class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate"
              :class="{ 'line-through text-gray-500 dark:text-gray-400': todo.status === 'completed' }">
              {{ todo.title }}
            </h4>

            <p v-if="todo.description" class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {{ todo.description }}
            </p>

            <!-- Priority Badge -->
            <div class="mt-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                :class="getPriorityClass(todo.priority)">
                {{ getPriorityText(todo.priority) }}
              </span>
            </div>

            <!-- Due Date -->
            <div v-if="todo.due_date" class="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <svg class="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(todo.due_date) }}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-1 ml-2">
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

const handleDelete = async () => {
  try {
    const confirmed = await globalConfirm.confirmDanger(
      'Are you sure you want to delete this todo?',
      {
        title: 'Delete Todo',
        description: 'This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    );

    if (!confirmed) return;

    globalConfirm.setLoading(true, 'Deleting...');

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
    low: 'Low',
    medium: 'Medium',
    high: 'High'
  };
  return texts[priority] || 'Medium';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Drag event handlers
const handleDragStart = (event) => {
  // Create enhanced ghost element
  const ghost = event.target.cloneNode(true);

  // Enhanced ghost styling
  ghost.style.opacity = '0.8';
  ghost.style.transform = 'rotate(3deg) scale(1.05)';
  ghost.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 2px #3b82f6';
  ghost.style.zIndex = '1000';
  ghost.style.pointerEvents = 'none';
  ghost.style.borderRadius = '12px';
  ghost.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
  ghost.style.backdropFilter = 'blur(10px)';
  ghost.classList.add('drag-ghost');

  // Add drag indicator to ghost
  const dragIndicator = document.createElement('div');
  dragIndicator.innerHTML = `
    <div style="position: absolute; top: -8px; right: -8px; background: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
      ↕
    </div>
  `;
  ghost.appendChild(dragIndicator);

  // Set custom drag image
  event.dataTransfer.setDragImage(ghost, 0, 0);

  // Store todo data
  event.dataTransfer.setData('text/plain', JSON.stringify({
    todoId: props.todo.id,
    todoTitle: props.todo.title,
    fromStatus: props.todo.status,
    priority: props.todo.priority,
    description: props.todo.description
  }));
  event.dataTransfer.effectAllowed = 'move';

  // Add dragging class to original element
  event.target.classList.add('dragging');

  // Add global dragging state
  document.body.classList.add('todo-dragging');
};

const handleDragEnd = (event) => {
  // Remove dragging class
  event.target.classList.remove('dragging');

  // Remove global dragging state
  document.body.classList.remove('todo-dragging');
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Native drag styles */
.todo-item[draggable="true"]:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.todo-item[draggable="true"]:active {
  transform: scale(0.98);
  opacity: 0.8;
}

/* Dragging state */
.todo-item.dragging {
  opacity: 0.3;
  transform: scale(0.95);
  transition: all 0.2s ease;
}

/* Ghost element styles */
.drag-ghost {
  opacity: 0.8 !important;
  transform: rotate(3deg) scale(1.05) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 2px #3b82f6 !important;
  z-index: 1000 !important;
  pointer-events: none !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px) !important;
  border-radius: 12px !important;
  border: 2px solid #3b82f6 !important;
  animation: ghostFloat 2s ease-in-out infinite !important;
}

@keyframes ghostFloat {

  0%,
  100% {
    transform: rotate(3deg) scale(1.05) translateY(0px);
  }

  50% {
    transform: rotate(3deg) scale(1.05) translateY(-5px);
  }
}

/* Global dragging state */
:global(.todo-dragging) {
  cursor: grabbing !important;
}

/* Temporarily disable this to debug drag issues */
/* :global(.todo-dragging) *:not([draggable="true"]) {
  pointer-events: none !important;
} */
</style>
