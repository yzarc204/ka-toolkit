# Assets Directory Structure

This directory contains all static assets for the Vue.js application.

## Directory Structure

```
resources/js/assets/
├── images/
│   ├── weather/          # Weather-related images
│   │   ├── rain.gif      # Rain animation
│   │   ├── snow.gif      # Snow animation (if added)
│   │   └── sunny.gif     # Sunny animation (if added)
│   ├── icons/            # Icon images
│   │   ├── humidity.svg  # Humidity icon
│   │   ├── wind.svg      # Wind icon
│   │   └── temperature.svg # Temperature icon
│   └── backgrounds/      # Background images
│       ├── default.jpg   # Default background
│       └── weather/      # Weather-specific backgrounds
│           ├── sunny.jpg
│           ├── rainy.jpg
│           └── cloudy.jpg
├── fonts/               # Custom fonts (if any)
└── styles/              # Additional CSS files (if any)
```

## Usage in Vue Components

### Importing Images

```javascript
// Import static images
import rainGif from '@/assets/images/weather/rain.gif'
import humidityIcon from '@/assets/images/icons/humidity.svg'

// Use in template
<template>
  <img :src="rainGif" alt="Rain animation" />
  <img :src="humidityIcon" alt="Humidity" />
</template>
```

### Dynamic Image Loading

```javascript
// For dynamic images based on conditions
const getWeatherImage = (condition) => {
    return new URL(`../assets/images/weather/${condition}.jpg`, import.meta.url)
        .href;
};
```

## File Naming Conventions

-   Use lowercase with hyphens: `rain-animation.gif`
-   Use descriptive names: `humidity-icon.svg`
-   Group by category: `weather-rain.gif`, `weather-snow.gif`
-   Use appropriate extensions: `.jpg`, `.png`, `.svg`, `.gif`

## Image Optimization

-   Use WebP format when possible for better compression
-   Optimize images before adding to the project
-   Consider using responsive images for different screen sizes
-   Use SVG for icons and simple graphics

## Adding New Images

1. Place images in the appropriate subdirectory
2. Update this README if adding new categories
3. Consider creating a constants file for image paths
4. Test image loading in different environments
