<template>
  <div class="p-6 rounded-2xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border shadow-lg">
    <div class="text-center">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assets Demo</h3>

      <!-- Weather Images -->
      <div class="mb-6">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Weather Animations</h4>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <img :src="IMAGE_ASSETS.weather.rain" alt="Rain" class="w-16 h-16 mx-auto mb-2" />
            <p class="text-xs text-gray-600 dark:text-gray-400">Rain</p>
          </div>
          <div class="text-center">
            <img :src="IMAGE_ASSETS.weather.clear" alt="Clear" class="w-16 h-16 mx-auto mb-2" />
            <p class="text-xs text-gray-600 dark:text-gray-400">Clear</p>
          </div>
        </div>
      </div>

      <!-- Icons -->
      <div class="mb-6">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Icons</h4>
        <div class="flex justify-center space-x-4">
          <div class="text-center">
            <img :src="IMAGE_ASSETS.icons.humidity" alt="Humidity" class="w-8 h-8 mx-auto mb-1" />
            <p class="text-xs text-gray-600 dark:text-gray-400">Humidity</p>
          </div>
          <div class="text-center">
            <img :src="IMAGE_ASSETS.icons.wind" alt="Wind" class="w-8 h-8 mx-auto mb-1" />
            <p class="text-xs text-gray-600 dark:text-gray-400">Wind</p>
          </div>
        </div>
      </div>

      <!-- Dynamic Weather Image -->
      <div class="mb-4">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Dynamic Weather</h4>
        <div class="text-center">
          <img :src="getWeatherImage('Rain')" alt="Weather" class="w-20 h-20 mx-auto mb-2" />
          <p class="text-xs text-gray-600 dark:text-gray-400">Dynamic: Rain</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IMAGE_ASSETS, getWeatherImage } from '@/assets/constants/images.js';
</script>
