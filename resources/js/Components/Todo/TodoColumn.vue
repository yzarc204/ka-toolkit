<template>
  <div
    class="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg flex flex-col min-h-0 shadow-sm border border-gray-200/50 dark:border-gray-700/50"
    :data-column="status" @dragover.prevent="handleDragOver" @dragleave="handleDragLeave" @drop.prevent="handleDrop"
    style="border: 2px solid transparent; transition: border-color 0.3s ease;">
    <!-- Column Header -->
    <div
      class="p-3 sm:p-4 border-b border-gray-200/60 dark:border-gray-600/60 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
      <div class="flex items-center justify-between">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
        <span :class="getBadgeClasses()" class="text-xs sm:text-sm px-2 py-1 rounded-full font-medium">
          {{ todos.length }}
        </span>
      </div>
    </div>

    <!-- Column Content -->
    <div class="flex-1 overflow-y-auto p-2 sm:p-3 bg-white/20 dark:bg-gray-800/20">
      <!-- Loading State -->
      <div v-if="todoStore.loading" class="flex items-center justify-center h-32">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="todos.length === 0" :class="getEmptyZoneClasses()"
        class="flex flex-col items-center justify-center h-32 text-center border-2 border-dashed rounded-lg m-2 empty-drop-zone">
        <svg :class="getEmptyZoneIconClasses()" class="w-8 h-8 mb-2" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p :class="getEmptyZoneTextClasses()" class="text-xs sm:text-sm">No tasks</p>
        <p :class="getEmptyZoneSubtextClasses()" class="text-xs mt-1">Drop tasks here</p>
        <div class="mt-2">
          <AddTaskButton :status="status" variant="compact" @click="$emit('add-todo')" />
        </div>
      </div>

      <!-- Todo Items Container -->
      <div v-else ref="columnRef" class="space-y-2 todo-items-container">
        <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" @edit="$emit('edit-todo', $event)"
          @delete="$emit('delete-todo', $event)" />

        <!-- Add Task Button at Bottom -->
        <div class="mt-3 pt-2 border-t border-gray-200/60 dark:border-gray-600/60">
          <AddTaskButton :status="status" variant="default" @click="$emit('add-todo')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useTodoStore } from '@/stores/todoStore';
import TodoItem from './TodoItem.vue';
import AddTaskButton from './AddTaskButton.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  todos: {
    type: Array,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['add-todo', 'edit-todo', 'delete-todo', 'move-todo', 'drag-over', 'drop-completed']);

const todoStore = useTodoStore();
const columnRef = ref();

// Badge color classes based on column status
const getBadgeClasses = () => {
  const baseClasses = 'text-xs sm:text-sm px-2 py-1 rounded-full font-medium';

  switch (props.status) {
    case 'todo':
      return `${baseClasses} text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30`;
    case 'in_progress':
      return `${baseClasses} text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30`;
    case 'completed':
      return `${baseClasses} text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30`;
    case 'deadline':
      return `${baseClasses} text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30`;
    default:
      return `${baseClasses} text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600`;
  }
};

// Empty zone color classes based on column status
const getEmptyZoneClasses = () => {
  switch (props.status) {
    case 'todo':
      return 'border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-900/10';
    case 'in_progress':
      return 'border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10';
    case 'completed':
      return 'border-green-300 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10';
    case 'deadline':
      return 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10';
    default:
      return 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900/10';
  }
};

const getEmptyZoneIconClasses = () => {
  switch (props.status) {
    case 'todo':
      return 'text-blue-400 dark:text-blue-500';
    case 'in_progress':
      return 'text-yellow-400 dark:text-yellow-500';
    case 'completed':
      return 'text-green-400 dark:text-green-500';
    case 'deadline':
      return 'text-red-400 dark:text-red-500';
    default:
      return 'text-gray-400 dark:text-gray-500';
  }
};

const getEmptyZoneTextClasses = () => {
  switch (props.status) {
    case 'todo':
      return 'text-blue-600 dark:text-blue-400';
    case 'in_progress':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'completed':
      return 'text-green-600 dark:text-green-400';
    case 'deadline':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-500 dark:text-gray-400';
  }
};

const getEmptyZoneSubtextClasses = () => {
  switch (props.status) {
    case 'todo':
      return 'text-blue-500 dark:text-blue-500';
    case 'in_progress':
      return 'text-yellow-500 dark:text-yellow-500';
    case 'completed':
      return 'text-green-500 dark:text-green-500';
    case 'deadline':
      return 'text-red-500 dark:text-red-500';
    default:
      return 'text-gray-400 dark:text-gray-500';
  }
};


// Drop indicator functions
const addDropIndicator = (dropZone, event) => {
  // Remove existing indicator
  removeDropIndicator(dropZone);

  // Create drop indicator
  const indicator = document.createElement('div');
  indicator.className = 'drop-indicator';
  indicator.style.cssText = `
    position: absolute;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
    z-index: 100;
    animation: dropIndicatorPulse 1s ease-in-out infinite;
    pointer-events: none;
  `;

  // Position indicator based on mouse position
  const rect = dropZone.getBoundingClientRect();
  const y = event.clientY - rect.top;

  if (y < rect.height / 2) {
    indicator.style.top = '0px';
  } else {
    indicator.style.bottom = '0px';
  }

  dropZone.appendChild(indicator);
};

const removeDropIndicator = (dropZone) => {
  const existingIndicator = dropZone.querySelector('.drop-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
};

// Enhanced drag and drop implementation
const handleDragOver = (event) => {
  event.dataTransfer.dropEffect = 'move';

  // Add visual feedback to the column
  const column = event.currentTarget;
  column.classList.add('column-drag-over');
  column.style.borderColor = '#3b82f6';

  // Find the appropriate drop zone (todo items container or empty state)
  const todoContainer = column.querySelector('.todo-items-container');
  const emptyZone = column.querySelector('.empty-drop-zone');
  const dropZone = todoContainer || emptyZone;

  if (dropZone) {
    dropZone.classList.add('drag-over');

    // Add drop indicator for todo container
    if (todoContainer) {
      addDropIndicator(todoContainer, event);
    }
  }

  // Emit drag over event for preview
  emit('drag-over', props.status);
};

const handleDragLeave = (event) => {
  // Only remove visual feedback if we're actually leaving the column
  const column = event.currentTarget;
  const rect = column.getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;

  // Check if mouse is still within the column
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    column.classList.remove('column-drag-over');
    column.style.borderColor = 'transparent';

    // Remove visual feedback from drop zones
    const todoContainer = column.querySelector('.todo-items-container');
    const emptyZone = column.querySelector('.empty-drop-zone');

    if (todoContainer) {
      todoContainer.classList.remove('drag-over');
      removeDropIndicator(todoContainer);
    }

    if (emptyZone) {
      emptyZone.classList.remove('drag-over');
    }
  }
};

const handleDrop = (event) => {
  // Remove all visual feedback
  const column = event.currentTarget;
  column.classList.remove('column-drag-over');
  column.style.borderColor = 'transparent';

  // Remove visual feedback from drop zones
  const todoContainer = column.querySelector('.todo-items-container');
  const emptyZone = column.querySelector('.empty-drop-zone');

  if (todoContainer) {
    todoContainer.classList.remove('drag-over');
    removeDropIndicator(todoContainer);
  }

  if (emptyZone) {
    emptyZone.classList.remove('drag-over');
  }

  try {
    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    const { todoId, fromStatus } = data;


    if (fromStatus !== props.status) {
      // Cross-column move - emit move-todo event
      const todo = todoStore.todos.find(t => t.id === todoId);
      if (todo) {
        emit('move-todo', todo, props.status);
        emit('drop-completed');
      }
    } else {
      // Same column reorder - handle reordering
      handleReorder(event, todoId);
    }
  } catch (error) {
    console.error('Error parsing drag data:', error);
  }
};

// Handle reordering within the same column
const handleReorder = async (event, draggedTodoId) => {
  try {
    const todoContainer = event.currentTarget.querySelector('.todo-items-container');
    if (!todoContainer) return;

    // Get all todo items in the container
    const todoItems = Array.from(todoContainer.querySelectorAll('.todo-item'));
    const dropY = event.clientY;

    // Find the drop position
    let dropIndex = todoItems.length;
    for (let i = 0; i < todoItems.length; i++) {
      const rect = todoItems[i].getBoundingClientRect();
      if (dropY < rect.top + rect.height / 2) {
        dropIndex = i;
        break;
      }
    }

    // Get current todos in this column sorted by order
    const currentTodos = [...props.todos].sort((a, b) => a.order - b.order);
    const draggedTodo = currentTodos.find(t => t.id === draggedTodoId);

    if (!draggedTodo) return;

    // Remove dragged todo from the list
    const todosWithoutDragged = currentTodos.filter(t => t.id !== draggedTodoId);

    // Insert at new position
    const reorderedTodos = [
      ...todosWithoutDragged.slice(0, dropIndex),
      draggedTodo,
      ...todosWithoutDragged.slice(dropIndex)
    ];

    // Update order values
    const todosToUpdate = reorderedTodos.map((todo, index) => ({
      id: todo.id,
      order: index + 1
    }));

    // Update order in database
    await todoStore.updateTodoOrder(todosToUpdate);

    emit('drop-completed');
  } catch (error) {
    console.error('Error reordering todos:', error);
  }
};

// Lifecycle
onMounted(() => {
  // Component mounted
});

onUnmounted(() => {
  // Component unmounted
});
</script>

<style scoped>
/* Todo items container */
.todo-items-container {
  position: relative;
  min-height: 100px;
  transition: all 0.3s ease;
}

/* Enhanced drag over effect */
.todo-items-container.drag-over {
  background-color: rgba(59, 130, 246, 0.08);
  border: 2px dashed #3b82f6;
  border-radius: 12px;
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

/* Column drag over effect */
[data-column].column-drag-over {
  background-color: rgba(59, 130, 246, 0.05);
  border-radius: 12px;
  transform: scale(1.01);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
}

/* Empty drop zone */
.empty-drop-zone {
  transition: all 0.3s ease;
  position: relative;
}

.empty-drop-zone.drag-over {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  border-style: solid;
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.empty-drop-zone.drag-over svg {
  color: #3b82f6;
  transform: scale(1.1);
}

.empty-drop-zone.drag-over p {
  color: #3b82f6;
  font-weight: 600;
}

/* Drop indicator animation */
@keyframes dropIndicatorPulse {

  0%,
  100% {
    opacity: 0.6;
    transform: scaleX(1);
  }

  50% {
    opacity: 1;
    transform: scaleX(1.05);
  }
}

/* Enhanced visual feedback for dark mode */
.dark .todo-items-container.drag-over {
  background-color: rgba(59, 130, 246, 0.15);
  border-color: #60a5fa;
}

.dark [data-column].column-drag-over {
  background-color: rgba(59, 130, 246, 0.1);
}

.dark .empty-drop-zone.drag-over {
  background-color: rgba(59, 130, 246, 0.15);
  border-color: #60a5fa;
}
</style>
