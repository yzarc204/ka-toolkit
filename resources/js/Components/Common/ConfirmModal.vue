<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-light-card dark:bg-dark-card rounded-xl p-6 w-full max-w-md mx-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-light-text dark:text-dark-text">
          {{ title }}
        </h3>
        <button @click="handleCancel" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="mb-6">
        <div class="flex items-start space-x-3">
          <!-- Icon -->
          <div :class="[
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
            iconClass
          ]">
            <component :is="iconComponent" class="w-6 h-6" />
          </div>

          <!-- Message -->
          <div class="flex-1">
            <p class="text-sm sm:text-base text-light-text dark:text-dark-text leading-relaxed">
              {{ message }}
            </p>
            <p v-if="description" class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              {{ description }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
        <button @click="handleCancel"
          class="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
          {{ cancelText }}
        </button>
        <button @click="handleConfirm" :disabled="loading" :class="[
          'w-full sm:w-auto px-4 py-2 text-sm sm:text-base rounded-lg transition-colors',
          confirmButtonClass,
          loading ? 'opacity-50 cursor-not-allowed' : ''
        ]">
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ loadingText }}
          </span>
          <span v-else>{{ confirmText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'warning', // warning, danger, info, success, question
    validator: (value) => ['warning', 'danger', 'info', 'success', 'question'].includes(value)
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: 'Processing...'
  }
});

const emit = defineEmits(['confirm', 'cancel', 'close']);

// Computed properties for dynamic styling
const iconComponent = computed(() => {
  const iconMap = {
    warning: ExclamationTriangleIcon,
    danger: XCircleIcon,
    info: InformationCircleIcon,
    success: CheckCircleIcon,
    question: QuestionMarkCircleIcon
  };
  return iconMap[props.type] || ExclamationTriangleIcon;
});

const iconClass = computed(() => {
  const classMap = {
    warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    success: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    question: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  };
  return classMap[props.type] || classMap.warning;
});

const confirmButtonClass = computed(() => {
  const classMap = {
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    question: 'bg-primary-600 hover:bg-primary-700 text-white'
  };
  return classMap[props.type] || classMap.warning;
});

// Event handlers
const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
  emit('close');
};
</script>
