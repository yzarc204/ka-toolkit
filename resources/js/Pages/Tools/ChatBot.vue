<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Chat Container -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col">
        <!-- Chat Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                </path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Yes/No Bot</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Ask me any yes/no question!</p>
            </div>
          </div>
        </div>

        <!-- Chat Messages -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="text-center py-8">
            <div
              class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                </path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Welcome to Yes/No Bot!</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Ask me any yes/no question and I'll give you a visual
              answer.</p>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              <p class="mb-2">Examples:</p>
              <ul class="space-y-1">
                <li>• "Should I go to the gym today?"</li>
                <li>• "Is it going to rain tomorrow?"</li>
                <li>• "Should I eat pizza for dinner?"</li>
              </ul>
            </div>
          </div>

          <!-- Chat Messages -->
          <div v-for="message in messages" :key="message.id" class="flex"
            :class="message.type === 'user' ? 'justify-end' : 'justify-start'">
            <div class="max-w-xs lg:max-w-md" :class="message.type === 'user' ? 'order-2' : 'order-1'">
              <!-- User Message -->
              <div v-if="message.type === 'user'" class="bg-blue-500 text-white rounded-lg px-4 py-2">
                <p class="text-sm">{{ message.text }}</p>
                <p class="text-xs opacity-75 mt-1">{{ formatTime(message.timestamp) }}</p>
              </div>

              <!-- Bot Message -->
              <div v-else class="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <div v-if="message.loading" class="flex items-center space-x-2">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Thinking...</p>
                </div>

                <div v-else-if="message.error" class="text-sm text-red-600 dark:text-red-400">
                  <p>{{ message.error }}</p>
                </div>

                <div v-else>
                  <div v-if="message.image" class="mb-2">
                    <img :src="message.image" :alt="message.answer" class="w-32 h-32 object-cover rounded-lg mx-auto">
                  </div>
                  <p class="text-sm text-gray-900 dark:text-white font-medium">{{ message.answer }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatTime(message.timestamp) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <form @submit.prevent="sendMessage" class="flex space-x-3">
            <input v-model="inputMessage" type="text" placeholder="Ask a yes/no question..."
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :disabled="isLoading">
            <button type="submit" :disabled="!inputMessage.trim() || isLoading"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200">
              <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                </path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <!-- Instructions -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- How it works -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">How it works</h3>
          <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-xs font-medium text-blue-600 dark:text-blue-400">1</span>
              </div>
              <p>Ask any yes/no question in natural language</p>
            </div>
            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-xs font-medium text-blue-600 dark:text-blue-400">2</span>
              </div>
              <p>Our AI analyzes your question and determines the answer</p>
            </div>
            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-xs font-medium text-blue-600 dark:text-blue-400">3</span>
              </div>
              <p>Get a visual answer with a random GIF from yesno.wtf</p>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Tips for better results</h3>
          <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Ask clear, specific yes/no questions</p>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Use natural language - no need for formal syntax</p>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Be creative! Ask about anything you're curious about</p>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Each answer comes with a unique GIF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';

// Reactive data
const messages = ref([]);
const inputMessage = ref('');
const isLoading = ref(false);
const chatContainer = ref(null);

// Message counter
let messageId = 0;

// Methods
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMessage = {
    id: ++messageId,
    type: 'user',
    text: inputMessage.value.trim(),
    timestamp: new Date()
  };

  messages.value.push(userMessage);
  const question = inputMessage.value.trim();
  inputMessage.value = '';

  // Add loading message
  const loadingMessage = {
    id: ++messageId,
    type: 'bot',
    loading: true,
    timestamp: new Date()
  };
  messages.value.push(loadingMessage);

  isLoading.value = true;
  await scrollToBottom();

  try {
    // Call yesno.wtf API
    const response = await fetch('https://yesno.wtf/api');
    const data = await response.json();

    // Remove loading message
    messages.value = messages.value.filter(msg => msg.id !== loadingMessage.id);

    // Add bot response
    const botMessage = {
      id: ++messageId,
      type: 'bot',
      answer: data.answer.charAt(0).toUpperCase() + data.answer.slice(1),
      image: data.image,
      timestamp: new Date()
    };

    messages.value.push(botMessage);
    await scrollToBottom();

  } catch (error) {
    console.error('Error fetching from yesno.wtf:', error);

    // Remove loading message
    messages.value = messages.value.filter(msg => msg.id !== loadingMessage.id);

    // Add error message
    const errorMessage = {
      id: ++messageId,
      type: 'bot',
      error: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date()
    };

    messages.value.push(errorMessage);
    await scrollToBottom();
  } finally {
    isLoading.value = false;
  }
};

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Auto-scroll when new messages are added
onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Animation for new messages */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-4>* {
  animation: slideIn 0.3s ease-out;
}
</style>
