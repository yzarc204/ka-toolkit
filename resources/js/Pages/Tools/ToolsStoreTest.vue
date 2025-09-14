<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Tools Store Test</h2>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ toolsStore.stats.total }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Total Tools</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ toolsStore.stats.active }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Active Tools</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ toolsStore.stats.inactive }}</div>
        <div class="text-sm text-gray-600 dark:text-gray-400">Inactive Tools</div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Search</h3>

      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search Query</label>
          <input v-model="toolsStore.searchQuery" type="text" placeholder="Search tools..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
      </div>

      <div class="mt-4">
        <button @click="toolsStore.clearFilters"
          class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">
          Clear Search
        </button>
      </div>
    </div>

    <!-- Tools List -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tools List</h3>

      <div v-if="filteredTools.length > 0" class="space-y-3">
        <div v-for="tool in filteredTools" :key="tool.id"
          class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :style="{ backgroundColor: tool.color }">
              <component :is="toolsStore.iconComponents[tool.icon]" class="w-5 h-5 text-white" />
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ tool.name }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ tool.description }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-500">
                {{ tool.route }}
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <span :class="[
              'px-2 py-1 text-xs rounded-full',
              tool.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            ]">
              {{ tool.isActive ? 'Active' : 'Inactive' }}
            </span>

            <button @click="toggleTool(tool.id)" :class="[
              'px-3 py-1 text-xs rounded-lg transition-colors',
              tool.isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            ]">
              {{ tool.isActive ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        No tools found
      </div>
    </div>

    <!-- Add New Tool -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Tool</h3>

      <form @submit.prevent="addNewTool" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input v-model="newTool.name" type="text" required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <input v-model="newTool.description" type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Route</label>
            <input v-model="newTool.route" type="text" required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
            <input v-model="newTool.color" type="color"
              class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
            <select v-model="newTool.icon"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="DocumentTextIcon">Document</option>
              <option value="ChatBubbleLeftRightIcon">Chat</option>
              <option value="ClipboardDocumentListIcon">Clipboard</option>
              <option value="CogIcon">Settings</option>
              <option value="QuestionMarkCircleIcon">Question</option>
            </select>
          </div>
        </div>

        <button type="submit"
          class="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
          Add Tool
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToolsStore } from '@/stores/toolsStore';

const toolsStore = useToolsStore();

const filteredTools = computed(() => toolsStore.filteredTools);

const newTool = ref({
  name: '',
  description: '',
  route: '',
  color: '#6B7280',
  icon: 'CogIcon',
  tags: []
});

const addNewTool = () => {
  toolsStore.addTool(newTool.value);
  newTool.value = {
    name: '',
    description: '',
    route: '',
    color: '#6B7280',
    icon: 'CogIcon',
    tags: []
  };
};

const toggleTool = (id) => {
  toolsStore.toggleTool(id);
};
</script>
