<template>
  <!-- Todo Container -->
  <div
    class="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col min-h-0">
    <!-- Todo Header -->
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
            <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white truncate">Todo App</h3>
            <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Quản lý công việc của bạn</p>
          </div>
        </div>

        <button @click="openAddModal"
          class="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors flex-shrink-0">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span class="hidden sm:inline">Thêm Todo</span>
          <span class="sm:hidden">Thêm</span>
        </button>
      </div>
    </div>

    <!-- Todo Content -->
    <div class="flex-1 overflow-y-auto p-2 sm:p-4">
      <!-- Stats -->
      <TodoStats />

      <!-- Todo List -->
      <TodoList @edit="editTodo" @delete="handleTodoDeleted" />
    </div>
  </div>

  <!-- Modal -->
  <TodoModal :is-open="showModal" :editing-todo="editingTodo" @close="closeModal" @saved="handleTodoSaved" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTodoStore } from '@/stores/todoStore';
import TodoStats from '@/Components/Todo/TodoStats.vue';
import TodoList from '@/Components/Todo/TodoList.vue';
import TodoModal from '@/Components/Todo/TodoModal.vue';

const todoStore = useTodoStore();

// Modal state
const showModal = ref(false);
const editingTodo = ref(null);

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
  // Additional logic can be added here if needed
};

const handleTodoDeleted = (todo) => {
  // Additional logic can be added here if needed
  console.log('Todo deleted:', todo);
};

// Lifecycle
onMounted(async () => {
  await todoStore.fetchTodos();
});
</script>