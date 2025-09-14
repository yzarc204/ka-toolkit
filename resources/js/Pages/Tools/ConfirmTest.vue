<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Confirm Modal Test</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Warning Confirm -->
      <button @click="testWarning"
        class="p-4 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30 rounded-lg transition-colors">
        <div class="text-yellow-600 dark:text-yellow-400 mb-2">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="font-semibold text-yellow-800 dark:text-yellow-300">Warning</h3>
        <p class="text-sm text-yellow-700 dark:text-yellow-400">Test warning confirm</p>
      </button>

      <!-- Danger Confirm -->
      <button @click="testDanger"
        class="p-4 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors">
        <div class="text-red-600 dark:text-red-400 mb-2">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="font-semibold text-red-800 dark:text-red-300">Danger</h3>
        <p class="text-sm text-red-700 dark:text-red-400">Test danger confirm</p>
      </button>

      <!-- Info Confirm -->
      <button @click="testInfo"
        class="p-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
        <div class="text-blue-600 dark:text-blue-400 mb-2">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="font-semibold text-blue-800 dark:text-blue-300">Info</h3>
        <p class="text-sm text-blue-700 dark:text-blue-400">Test info confirm</p>
      </button>

      <!-- Success Confirm -->
      <button @click="testSuccess"
        class="p-4 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg transition-colors">
        <div class="text-green-600 dark:text-green-400 mb-2">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="font-semibold text-green-800 dark:text-green-300">Success</h3>
        <p class="text-sm text-green-700 dark:text-green-400">Test success confirm</p>
      </button>

      <!-- Question Confirm -->
      <button @click="testQuestion"
        class="p-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors">
        <div class="text-gray-600 dark:text-gray-400 mb-2">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-gray-300">Question</h3>
        <p class="text-sm text-gray-700 dark:text-gray-400">Test question confirm</p>
      </button>

      <!-- Loading Test -->
      <button @click="testLoading"
        class="p-4 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
        <div class="text-purple-600 dark:text-purple-400 mb-2">
          <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h3 class="font-semibold text-purple-800 dark:text-purple-300">Loading</h3>
        <p class="text-sm text-purple-700 dark:text-purple-400">Test loading state</p>
      </button>
    </div>

    <!-- Result Display -->
    <div v-if="lastResult" class="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Last Result:</h3>
      <p class="text-sm text-gray-700 dark:text-gray-300">
        Type: <span class="font-mono">{{ lastResult.type }}</span> |
        Result: <span class="font-mono">{{ lastResult.result }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { globalConfirm } from '@/Composables/useConfirm';

const lastResult = ref(null);

const testWarning = async () => {
  try {
    const result = await globalConfirm.confirmWarning(
      'This is a warning message. Are you sure you want to continue?',
      {
        title: 'Warning',
        description: 'This action may have unintended consequences.',
        confirmText: 'Continue',
        cancelText: 'Cancel'
      }
    );
    lastResult.value = { type: 'Warning', result };
  } catch (error) {
    lastResult.value = { type: 'Warning', result: 'Cancelled' };
  }
};

const testDanger = async () => {
  try {
    const result = await globalConfirm.confirmDanger(
      'This action is dangerous and cannot be undone!',
      {
        title: 'Dangerous Action',
        description: 'Please make sure you understand the consequences.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    );
    lastResult.value = { type: 'Danger', result };
  } catch (error) {
    lastResult.value = { type: 'Danger', result: 'Cancelled' };
  }
};

const testInfo = async () => {
  try {
    const result = await globalConfirm.confirmInfo(
      'This is an informational message. Do you want to proceed?',
      {
        title: 'Information',
        description: 'This will help you understand what happens next.',
        confirmText: 'Proceed',
        cancelText: 'Cancel'
      }
    );
    lastResult.value = { type: 'Info', result };
  } catch (error) {
    lastResult.value = { type: 'Info', result: 'Cancelled' };
  }
};

const testSuccess = async () => {
  try {
    const result = await globalConfirm.confirmSuccess(
      'Great! Your action was successful. Do you want to continue?',
      {
        title: 'Success',
        description: 'Everything went as expected.',
        confirmText: 'Continue',
        cancelText: 'Cancel'
      }
    );
    lastResult.value = { type: 'Success', result };
  } catch (error) {
    lastResult.value = { type: 'Success', result: 'Cancelled' };
  }
};

const testQuestion = async () => {
  try {
    const result = await globalConfirm.confirmQuestion(
      'Do you want to proceed with this action?',
      {
        title: 'Question',
        description: 'Please choose your preferred option.',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    );
    lastResult.value = { type: 'Question', result };
  } catch (error) {
    lastResult.value = { type: 'Question', result: 'Cancelled' };
  }
};

const testLoading = async () => {
  try {
    const result = await globalConfirm.confirmWarning(
      'This will show a loading state. Continue?',
      {
        title: 'Loading Test',
        description: 'The button will show loading state.',
        confirmText: 'Start Process',
        cancelText: 'Cancel'
      }
    );

    if (result) {
      globalConfirm.setLoading(true, 'Processing...');

      // Simulate async operation
      setTimeout(() => {
        globalConfirm.setLoading(false);
        lastResult.value = { type: 'Loading', result: 'Completed' };
      }, 2000);
    } else {
      lastResult.value = { type: 'Loading', result: 'Cancelled' };
    }
  } catch (error) {
    lastResult.value = { type: 'Loading', result: 'Cancelled' };
  }
};
</script>
