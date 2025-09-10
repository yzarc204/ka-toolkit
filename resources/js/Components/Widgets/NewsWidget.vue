<template>
  <div
    class="h-full p-6 rounded-2xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tin tức mới nhất</h3>
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400">
        {{ lastUpdated }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="animate-pulse">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-4">
      <div class="text-red-500 dark:text-red-400 mb-2">
        <svg class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd" />
        </svg>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-400">{{ error }}</p>
      <button @click="fetchNews"
        class="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        Thử lại
      </button>
    </div>

    <!-- News List -->
    <div v-else class="space-y-3 max-h-96 overflow-y-auto">
      <div v-for="(item, index) in newsItems" :key="index" class="group cursor-pointer" @click="openLink(item.link)">
        <div class="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <h4
            class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ item.title }}
          </h4>
          <p v-if="item.description" class="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {{ item.description }}
          </p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(item.pubDate) }}
            </span>
            <svg class="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="currentColor"
              viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-4 pt-3 border-t border-gray-200 dark:border-dark-border">
      <a href="https://vnexpress.net" target="_blank"
        class="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1">
        <span>Nguồn: VnExpress</span>
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd" />
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Reactive data
const newsItems = ref([]);
const loading = ref(true);
const error = ref(null);
const lastUpdated = ref('');
let updateInterval = null;

// RSS Feed URL
const RSS_URL = 'https://vnexpress.net/rss/tin-moi-nhat.rss';

// Fetch news from RSS
const fetchNews = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Use CORS proxy to fetch RSS
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error('Không thể tải tin tức');
    }

    const data = await response.json();
    const xmlText = data.contents;

    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Extract news items
    const items = xmlDoc.querySelectorAll('item');
    const news = [];

    items.forEach((item, index) => {
      if (index >= 10) return; // Limit to 10 items

      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';

      // Clean description (remove HTML tags)
      const cleanDescription = description.replace(/<[^>]*>/g, '').trim();

      news.push({
        title: title.trim(),
        link: link.trim(),
        description: cleanDescription,
        pubDate: pubDate.trim()
      });
    });

    newsItems.value = news;
    lastUpdated.value = formatTime(new Date());

  } catch (err) {
    console.error('Error fetching news:', err);
    error.value = 'Không thể tải tin tức. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Vừa xong';
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  } catch {
    return '';
  }
};

// Format time
const formatTime = (date) => {
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Open link in new tab
const openLink = (url) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

// Auto refresh every 5 minutes
const startAutoRefresh = () => {
  updateInterval = setInterval(() => {
    fetchNews();
  }, 5 * 60 * 1000); // 5 minutes
};

// Stop auto refresh
const stopAutoRefresh = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
};

// Lifecycle
onMounted(() => {
  fetchNews();
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
.max-h-96::-webkit-scrollbar {
  width: 4px;
}

.max-h-96::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}

.dark .max-h-96::-webkit-scrollbar-thumb {
  background: #4a5568;
}
</style>
