<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-light-card dark:bg-dark-card rounded-xl p-6 w-full max-w-md mx-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-light-text dark:text-dark-text">Share Note</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <div class="space-y-4">
        <!-- Share by email -->
        <div>
          <label class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Share with user by email
          </label>
          <div class="flex gap-2">
            <input type="email" :value="shareEmail" @input="$emit('update:shareEmail', $event.target.value)"
              placeholder="Enter email address"
              class="flex-1 px-3 py-2 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400" />
            <button @click="handleShare" :disabled="!shareEmail || isSharing"
              class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors">
              {{ isSharing ? 'Sharing...' : 'Share' }}
            </button>
          </div>
        </div>

        <!-- Shared users list -->
        <div v-if="sharedUsers.length > 0">
          <label class="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Shared with
          </label>
          <div class="space-y-2">
            <div v-for="user in sharedUsers" :key="user.id"
              class="flex items-center justify-between p-3 bg-light-hover dark:bg-dark-hover rounded-lg">
              <div class="flex items-center">
                <div
                  class="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 text-sm font-medium">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-light-text dark:text-dark-text">{{ user.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</p>
                </div>
              </div>
              <button @click="handleUnshare(user.id)"
                class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm">
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Public/Private toggle -->
        <div class="border-t border-light-border dark:border-dark-border pt-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-light-text dark:text-dark-text">Make note public</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Anyone with the link can view</p>
            </div>
            <button @click="$emit('toggle-public')" :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              isPublic ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
            ]">
              <span :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                isPublic ? 'translate-x-6' : 'translate-x-1'
              ]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  shareEmail: {
    type: String,
    required: true
  },
  sharedUsers: {
    type: Array,
    default: () => []
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isSharing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'update:shareEmail', 'share', 'unshare', 'toggle-public']);

const handleShare = () => {
  if (props.shareEmail) {
    emit('share', props.shareEmail);
  }
};

const handleUnshare = (userId) => {
  emit('unshare', userId);
};
</script>
