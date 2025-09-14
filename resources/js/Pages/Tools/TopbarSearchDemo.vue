<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Topbar Search Demo</h2>

    <!-- Instructions -->
    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
      <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">How to Test</h3>
      <div class="text-blue-700 dark:text-blue-300 space-y-2">
        <p>1. <strong>Desktop:</strong> Click on the search bar in the topbar to see the search functionality</p>
        <p>2. <strong>Mobile:</strong> Click the search icon (🔎) in the mobile header to open search</p>
        <p>3. <strong>Features to test:</strong></p>
        <ul class="ml-4 space-y-1">
          <li>• Quick Access: Shows when search is empty</li>
          <li>• Search Results: Filter tools by name, description, or tags</li>
          <li>• Keyboard Navigation: Use ↑↓ arrows to navigate, Enter to select, Esc to close</li>
          <li>• Click Outside: Click outside to close search</li>
          <li>• Responsive: Different layouts for desktop and mobile</li>
        </ul>
      </div>
    </div>

    <!-- Current Tools -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Available Tools for Search</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="tool in toolsStore.activeTools" :key="tool.id"
          class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :style="{ backgroundColor: tool.color }">
              <component :is="toolsStore.iconComponents[tool.icon]" class="w-5 h-5 text-white" />
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ tool.name }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ tool.route }}</div>
            </div>
          </div>

          <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">{{ tool.description }}</div>

          <div class="flex flex-wrap gap-1">
            <span v-for="tag in tool.tags" :key="tag"
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Examples -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Search Examples</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Try searching for:</h4>
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">•</span>
              <code class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">notes</code>
              <span class="text-sm text-gray-500">→ Finds Notes tool</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">•</span>
              <code class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">ai</code>
              <span class="text-sm text-gray-500">→ Finds Yes/No Bot</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">•</span>
              <code class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">todo</code>
              <span class="text-sm text-gray-500">→ Finds Todo App</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">•</span>
              <code class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">test</code>
              <span class="text-sm text-gray-500">→ Finds Confirm Test</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">•</span>
              <code class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">productivity</code>
              <span class="text-sm text-gray-500">→ Finds Notes & Todo</span>
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Keyboard Shortcuts:</h4>
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">↑</kbd>
              <span class="text-sm text-gray-600 dark:text-gray-400">Navigate up</span>
            </div>
            <div class="flex items-center space-x-2">
              <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">↓</kbd>
              <span class="text-sm text-gray-600 dark:text-gray-400">Navigate down</span>
            </div>
            <div class="flex items-center space-x-2">
              <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">Enter</kbd>
              <span class="text-sm text-gray-600 dark:text-gray-400">Select tool</span>
            </div>
            <div class="flex items-center space-x-2">
              <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">Esc</kbd>
              <span class="text-sm text-gray-600 dark:text-gray-400">Close search</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToolsStore } from '@/stores/toolsStore';

const toolsStore = useToolsStore();
</script>
