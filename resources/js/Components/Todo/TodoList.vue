<template>
  <div class="bg-gray-50 dark:bg-gray-700 rounded-lg">
    <div class="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-600">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Danh sách công việc</h2>
    </div>

    <div v-if="todoStore.loading" class="p-6 sm:p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
      <p class="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">Đang tải...</p>
    </div>

    <div v-else-if="todoStore.todos.length === 0" class="p-6 sm:p-8 text-center">
      <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" fill="none"
        stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">Chưa có công việc nào</p>
      <p class="text-xs sm:text-sm text-gray-400 dark:text-gray-500">Nhấn "Thêm Todo" để bắt đầu</p>
    </div>

    <div v-else class="divide-y divide-gray-200 dark:divide-gray-600" ref="todoListRef">
      <TodoItem v-for="todo in todoStore.todos" :key="todo.id" :todo="todo" @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useSortable } from '@vueuse/integrations/useSortable';
import { useTodoStore } from '@/stores/todoStore';
import TodoItem from './TodoItem.vue';

const emit = defineEmits(['edit', 'delete']);

const todoStore = useTodoStore();
const todoListRef = ref();

// Setup drag and drop
watch(() => todoStore.todos, async () => {
  await nextTick();
  if (todoListRef.value && todoStore.todos.length > 0) {
    useSortable(todoListRef.value, todoStore.todos, {
      animation: 150,
      ghostClass: 'opacity-50',
      handle: '.cursor-move',
      onEnd: async (evt) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex !== newIndex) {
          // Update local state immediately for better UX
          const item = todoStore.todos.splice(oldIndex, 1)[0];
          todoStore.todos.splice(newIndex, 0, item);

          // Update order in database
          const todoData = todoStore.todos.map((todo, index) => ({
            id: todo.id,
            order: index
          }));

          try {
            await todoStore.updateTodoOrder(todoData);
          } catch (error) {
            console.error('Error updating order:', error);
            // Revert on error
            await todoStore.fetchTodos();
          }
        }
      }
    });
  }
}, { immediate: true });
</script>
