<template>
  <div
    class="h-full p-6 rounded-2xl border border-blue-200 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col"
    :style="backgroundImageStyle">
    <!-- Background Overlay -->
    <div class="absolute inset-0 bg-black/20 dark:bg-black/40 pointer-events-none"></div>

    <!-- Weather Effects -->
    <div v-if="weatherEffect" class="absolute inset-0 pointer-events-none">
      <!-- Rain Effect -->
      <div v-if="weatherEffect === 'rain'" class="rain-container">
        <div v-for="i in 30" :key="i" class="rain-drop" :style="getRainDropStyle(i)"></div>
      </div>

      <!-- Snow Effect -->
      <div v-if="weatherEffect === 'snow'" class="snow-container">
        <div v-for="i in 20" :key="i" class="snowflake" :style="getSnowflakeStyle(i)"></div>
      </div>

      <!-- Sunny Effect -->
      <div v-if="weatherEffect === 'sunny'" class="sunny-container">
        <div class="sun-rays"></div>
      </div>
    </div>

    <div class="text-center relative z-10 flex-grow flex flex-col justify-center">
      <!-- Title -->
      <h3 class="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4">Weather</h3>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-3">
        <div class="animate-pulse">
          <div class="h-8 bg-blue-200 dark:bg-blue-800 rounded mx-auto w-32"></div>
          <div class="h-6 bg-blue-200 dark:bg-blue-800 rounded mx-auto w-24 mt-2"></div>
          <div class="h-4 bg-blue-200 dark:bg-blue-800 rounded mx-auto w-20 mt-2"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="space-y-3">
        <div class="text-red-500 dark:text-red-400">
          <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"></path>
          </svg>
          <p class="text-sm">{{ error }}</p>
        </div>
      </div>

      <!-- Weather Data -->
      <div v-else-if="weatherData" class="space-y-4">
        <!-- Location -->
        <div class="text-sm text-blue-600 dark:text-blue-400 font-medium">
          {{ weatherData.location }}
        </div>

        <!-- Temperature -->
        <div class="text-3xl font-bold text-blue-800 dark:text-blue-200">
          {{ Math.round(weatherData.temperature) }}°C
        </div>

        <!-- Weather Icon & Description -->
        <div class="flex items-center justify-center space-x-3">
          <div class="text-4xl">
            {{ getWeatherIcon(weatherData.condition, weatherData.weatherCode) }}
          </div>
          <div class="text-sm text-blue-700 dark:text-blue-300 capitalize">
            {{ weatherData.description }}
          </div>
        </div>

        <!-- Additional Info -->
        <div class="grid grid-cols-2 gap-4 text-xs text-blue-600 dark:text-blue-400">
          <div class="flex items-center justify-center space-x-1">
            <!-- Humidity Icon -->
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1.5 4.5 3 6l3 3 3-3c1.5-1.5 3-3.5 3-6 0-3.5-2.5-6-6-6zm0 2c2.2 0 4 1.8 4 4 0 1.5-.8 2.8-2 3.5L12 15l-2-3.5c-1.2-.7-2-2-2-3.5 0-2.2 1.8-4 4-4z" />
              <path
                d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 2c0 .6-.4 1-1 1s-1-.4-1-1 .4-1 1-1 1 .4 1 1z" />
            </svg>
            <span>{{ weatherData.humidity }}%</span>
          </div>
          <div class="flex items-center justify-center space-x-1">
            <!-- Wind Speed Icon -->
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M2 12h20l-4-4m4 4l-4 4M6 12h12M6 12c0-1.1.9-2 2-2s2 .9 2 2M6 12c0 1.1.9 2 2 2s2-.9 2-2m8 0c0-1.1.9-2 2-2s2 .9 2 2m-4 0c0 1.1.9 2 2 2s2-.9 2-2" />
            </svg>
            <span>{{ weatherData.windSpeed }} m/s</span>
          </div>
        </div>

        <!-- Last Updated -->
        <div class="text-xs text-blue-500 dark:text-blue-500">
          Updated {{ formatTime(weatherData.lastUpdated) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { WEATHER_CONFIG } from '@/config/weather.js';

// Import weather GIFs
import rainGif from '@/assets/images/weather/rain.gif';
import sunnyGif from '@/assets/images/weather/sunny.gif';
import cloudyGif from '@/assets/images/weather/cloudy.gif';
import snowyGif from '@/assets/images/weather/snowy.gif';
import stormGif from '@/assets/images/weather/storm.gif';
import clearGif from '@/assets/images/weather/clear.gif';

const weatherData = ref(null);
const loading = ref(true);
const error = ref('');
const weatherEffect = ref('');
const backgroundImageStyle = ref({});

let updateInterval = null;

// Weather GIF mapping
const weatherGifs = {
  Clear: sunnyGif,
  Clouds: cloudyGif,
  Rain: rainGif,
  Snow: snowyGif,
  Thunderstorm: stormGif,
  default: clearGif
};

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported, using fallback location');
      resolve(WEATHER_CONFIG.FALLBACK_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Geolocation failed, using fallback location:', error.message);
        resolve(WEATHER_CONFIG.FALLBACK_LOCATION);
      },
      {
        timeout: 10000,
        enableHighAccuracy: true
      }
    );
  });
};

const fetchWeatherData = async (lat, lon) => {
  try {
    // Try Open-Meteo API first (no API key required)
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: WEATHER_CONFIG.PRIMARY_API.params.current,
      hourly: WEATHER_CONFIG.PRIMARY_API.params.hourly,
      timezone: WEATHER_CONFIG.PRIMARY_API.params.timezone
    });

    const response = await fetch(`${WEATHER_CONFIG.PRIMARY_API.url}?${params}`);

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();

    // Get weather info from weather code
    const weatherCode = data.current.weather_code;
    const weatherInfo = WEATHER_CONFIG.WEATHER_CODES[weatherCode] || {
      condition: 'Unknown',
      icon: '🌤️',
      effect: ''
    };

    return {
      location: await getLocationName(lat, lon),
      temperature: data.current.temperature_2m,
      condition: weatherInfo.condition,
      description: getWeatherDescription(weatherCode),
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      lastUpdated: new Date(),
      weatherCode: weatherCode
    };
  } catch (err) {
    console.warn('Open-Meteo failed, trying wttr.in:', err.message);

    // Fallback to wttr.in API
    try {
      const response = await fetch(`${WEATHER_CONFIG.SECONDARY_API.url}/${lat},${lon}?format=${WEATHER_CONFIG.SECONDARY_API.format}`);

      if (!response.ok) {
        throw new Error(`wttr.in API error: ${response.status}`);
      }

      const data = await response.json();
      const current = data.current_condition[0];

      return {
        location: data.nearest_area[0].areaName[0].value,
        temperature: parseFloat(current.temp_C),
        condition: current.weatherDesc[0].value,
        description: current.weatherDesc[0].value,
        humidity: parseFloat(current.humidity),
        windSpeed: parseFloat(current.windspeedKmph) / 3.6, // Convert km/h to m/s
        lastUpdated: new Date(),
        weatherCode: 0 // Default for wttr.in
      };
    } catch (fallbackErr) {
      throw new Error(`All weather APIs failed: ${err.message}`);
    }
  }
};

const getLocationName = async (lat, lon) => {
  try {
    // Use reverse geocoding to get location name
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await response.json();
    return data.city || data.locality || 'Unknown Location';
  } catch (err) {
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  }
};

const getWeatherDescription = (weatherCode) => {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  return descriptions[weatherCode] || 'Unknown weather';
};

const getWeatherIcon = (condition, weatherCode = null) => {
  // If we have weather code, use it for more accurate icons
  if (weatherCode !== null && WEATHER_CONFIG.WEATHER_CODES[weatherCode]) {
    return WEATHER_CONFIG.WEATHER_CODES[weatherCode].icon;
  }

  // Fallback to condition-based icons
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  };
  return icons[condition] || '🌤️';
};

const setWeatherEffect = (condition, weatherCode = null) => {
  // If we have weather code, use it for more accurate effects
  if (weatherCode !== null && WEATHER_CONFIG.WEATHER_CODES[weatherCode]) {
    weatherEffect.value = WEATHER_CONFIG.WEATHER_CODES[weatherCode].effect;
    return;
  }

  // Fallback to condition-based effects
  const effects = {
    'Rain': 'rain',
    'Drizzle': 'rain',
    'Thunderstorm': 'rain',
    'Snow': 'snow',
    'Clear': 'sunny'
  };
  weatherEffect.value = effects[condition] || '';
};

const getRainDropStyle = (index) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${0.5 + Math.random() * 0.5}s`
  };
};

const getSnowflakeStyle = (index) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${2 + Math.random() * 2}s`
  };
};

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const updateBackgroundStyle = (condition) => {
  // Get weather GIF based on condition
  const weatherGif = weatherGifs[condition] || weatherGifs.default;

  console.log('Setting background for condition:', condition, 'GIF:', weatherGif);
  console.log('Available weatherGifs:', weatherGifs);

  if (weatherGif) {
    backgroundImageStyle.value = {
      backgroundImage: `url(${weatherGif})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    };
    console.log('Background style set:', backgroundImageStyle.value);
  } else {
    console.log('No GIF found, using gradient fallback');
    // Enhanced gradient fallback based on weather condition
    const gradients = {
      'Clear': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', // Sunny
      'Clouds': 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)', // Cloudy
      'Rain': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Rainy
      'Snow': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', // Snowy
      'Thunderstorm': 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', // Stormy
      'Fog': 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)', // Foggy
      'default': 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' // Default blue
    };

    const currentGradient = gradients[condition] || gradients.default;

    backgroundImageStyle.value = {
      background: currentGradient
    };
  }
};

const updateWeather = async () => {
  try {
    loading.value = true;
    error.value = '';

    const location = await getCurrentLocation();
    const data = await fetchWeatherData(location.lat, location.lon);

    weatherData.value = data;
    setWeatherEffect(data.condition, data.weatherCode);

    // Update background with weather GIF
    updateBackgroundStyle(data.condition);
  } catch (err) {
    error.value = err.message;
    console.error('Weather update error:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  updateBackgroundStyle('default'); // Initialize with default background
  updateWeather();
  // Update every 10 minutes
  updateInterval = setInterval(updateWeather, WEATHER_CONFIG.UPDATE_INTERVAL);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>

<style scoped>
/* Rain Effect */
.rain-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.rain-drop {
  position: absolute;
  width: 2px;
  height: 10px;
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 0.2));
  border-radius: 1px;
  animation: rain-fall linear infinite;
}

@keyframes rain-fall {
  0% {
    transform: translateY(-10px);
    opacity: 1;
  }

  100% {
    transform: translateY(200px);
    opacity: 0;
  }
}

/* Snow Effect */
.snow-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.snowflake {
  position: absolute;
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: snow-fall linear infinite;
}

@keyframes snow-fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }

  100% {
    transform: translateY(200px) rotate(360deg);
    opacity: 0;
  }
}

/* Sunny Effect */
.sunny-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.sun-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(255, 255, 0, 0.1) 0%, transparent 70%);
  animation: sun-glow 3s ease-in-out infinite alternate;
}

@keyframes sun-glow {
  0% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* Hover effect */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Text readability on background images */
.text-center>* {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Dark mode text shadows */
.dark .text-center>* {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}
</style>
