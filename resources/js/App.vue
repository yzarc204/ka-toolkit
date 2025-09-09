<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-bg">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth } from '@/Composables/useAuth';

const { fetchUser } = useAuth();

// Initialize auth
onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    fetchUser();
  }
});
</script>