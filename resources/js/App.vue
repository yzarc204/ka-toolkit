<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-bg">
    <router-view />

    <!-- Global Confirm Modal -->
    <ConfirmModal :is-open="confirmState.isOpen.value" :title="confirmState.title.value"
      :message="confirmState.message.value" :description="confirmState.description.value"
      :type="confirmState.type.value" :confirm-text="confirmState.confirmText.value"
      :cancel-text="confirmState.cancelText.value" :loading="confirmState.loading.value"
      :loading-text="confirmState.loadingText.value" @confirm="confirmState.handleConfirm"
      @cancel="confirmState.handleCancel" @close="confirmState.closeModal" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth } from '@/Composables/useAuth';
import { globalConfirm } from '@/Composables/useConfirm';
import ConfirmModal from '@/Components/Common/ConfirmModal.vue';

const { fetchUser } = useAuth();
const confirmState = globalConfirm;

// Initialize auth
onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    fetchUser();
  }
});
</script>