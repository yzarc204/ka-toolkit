<template>
  <div
    class="h-full p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-center">
    <div class="text-center">
      <!-- Title -->
      <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-6">Clock</h3>

      <!-- Digital Time -->
      <div class="mb-6">
        <div class="text-2xl md:text-3xl font-mono font-medium text-slate-800 dark:text-slate-200 mb-2">
          {{ digitalTime }}
        </div>
        <div class="text-sm text-slate-600 dark:text-slate-400">
          {{ currentDate }}
        </div>
      </div>

      <!-- Analog Clock -->
      <div class="relative mx-auto w-36 h-36 mb-4">
        <!-- Clock Face -->
        <div
          class="absolute inset-0 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 shadow-inner">
          <svg class="w-full h-full" viewBox="0 0 100 100">
            <!-- Hour markers (12 positions) -->
            <g v-for="(hour, index) in 12" :key="hour">
              <!-- Marker line -->
              <line :x1="50 + 42 * Math.cos((index * 30 - 90) * Math.PI / 180)"
                :y1="50 + 42 * Math.sin((index * 30 - 90) * Math.PI / 180)"
                :x2="50 + 36 * Math.cos((index * 30 - 90) * Math.PI / 180)"
                :y2="50 + 36 * Math.sin((index * 30 - 90) * Math.PI / 180)" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" class="text-slate-600 dark:text-slate-400" />
            </g>

            <!-- Hour hand -->
            <line :x1="50" :y1="50" :x2="50 + 20 * Math.cos((hourAngle - 90) * Math.PI / 180)"
              :y2="50 + 20 * Math.sin((hourAngle - 90) * Math.PI / 180)" stroke="currentColor" stroke-width="3"
              stroke-linecap="round" class="text-slate-800 dark:text-slate-200" />

            <!-- Minute hand -->
            <line :x1="50" :y1="50" :x2="50 + 28 * Math.cos((minuteAngle - 90) * Math.PI / 180)"
              :y2="50 + 28 * Math.sin((minuteAngle - 90) * Math.PI / 180)" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" class="text-slate-800 dark:text-slate-200" />

            <!-- Second hand -->
            <line :x1="50" :y1="50" :x2="50 + 32 * Math.cos((secondAngle - 90) * Math.PI / 180)"
              :y2="50 + 32 * Math.sin((secondAngle - 90) * Math.PI / 180)" stroke="currentColor" stroke-width="1"
              stroke-linecap="round" class="text-red-500" />

            <!-- Center dot -->
            <circle cx="50" cy="50" r="2" fill="currentColor" class="text-slate-800 dark:text-slate-200" />
          </svg>
        </div>
      </div>

      <!-- Timezone -->
      <div class="text-xs text-slate-500 dark:text-slate-500">
        {{ timezone }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const currentTime = ref(new Date());
const timezone = ref('');

let intervalId = null;

// Computed properties for time display
const digitalTime = computed(() => {
  return currentTime.value.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
});

const currentDate = computed(() => {
  return currentTime.value.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Computed properties for analog clock angles
const hourAngle = computed(() => {
  const hours = currentTime.value.getHours() % 12;
  const minutes = currentTime.value.getMinutes();
  return (hours + minutes / 60) * 30; // 30 degrees per hour
});

const minuteAngle = computed(() => {
  return currentTime.value.getMinutes() * 6; // 6 degrees per minute
});

const secondAngle = computed(() => {
  return currentTime.value.getSeconds() * 6; // 6 degrees per second
});

const updateTime = () => {
  currentTime.value = new Date();
};

onMounted(() => {
  timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
  updateTime();
  intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
/* Smooth transitions for clock hands */
svg line {
  transition: transform 0.1s ease-in-out;
}

/* Hover effect */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
