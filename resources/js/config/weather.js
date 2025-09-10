// Weather API Configuration - No API Key Required
export const WEATHER_CONFIG = {
    // Primary API: Open-Meteo (No API key required)
    PRIMARY_API: {
        name: "Open-Meteo",
        url: "https://api.open-meteo.com/v1/forecast",
        params: {
            hourly: "temperature_2m,relative_humidity_2m,weather_code",
            current:
                "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
            timezone: "auto",
        },
    },

    // Secondary API: wttr.in (No API key required)
    SECONDARY_API: {
        name: "wttr.in",
        url: "https://wttr.in",
        format: "j1", // JSON format
    },

    // Update interval (milliseconds)
    UPDATE_INTERVAL: 10 * 60 * 1000, // 10 minutes

    // Fallback location (if geolocation fails)
    FALLBACK_LOCATION: {
        lat: 21.0285, // Ho Chi Minh City
        lon: 105.8542,
    },

    // Weather code mapping for Open-Meteo
    WEATHER_CODES: {
        0: { condition: "Clear", icon: "☀️", effect: "sunny" },
        1: { condition: "Clear", icon: "☀️", effect: "sunny" },
        2: { condition: "Clouds", icon: "⛅", effect: "" },
        3: { condition: "Clouds", icon: "☁️", effect: "" },
        45: { condition: "Fog", icon: "🌫️", effect: "" },
        48: { condition: "Fog", icon: "🌫️", effect: "" },
        51: { condition: "Drizzle", icon: "🌦️", effect: "rain" },
        53: { condition: "Drizzle", icon: "🌦️", effect: "rain" },
        55: { condition: "Drizzle", icon: "🌦️", effect: "rain" },
        61: { condition: "Rain", icon: "🌧️", effect: "rain" },
        63: { condition: "Rain", icon: "🌧️", effect: "rain" },
        65: { condition: "Rain", icon: "🌧️", effect: "rain" },
        71: { condition: "Snow", icon: "❄️", effect: "snow" },
        73: { condition: "Snow", icon: "❄️", effect: "snow" },
        75: { condition: "Snow", icon: "❄️", effect: "snow" },
        77: { condition: "Snow", icon: "❄️", effect: "snow" },
        80: { condition: "Rain", icon: "🌦️", effect: "rain" },
        81: { condition: "Rain", icon: "🌧️", effect: "rain" },
        82: { condition: "Rain", icon: "🌧️", effect: "rain" },
        85: { condition: "Snow", icon: "❄️", effect: "snow" },
        86: { condition: "Snow", icon: "❄️", effect: "snow" },
        95: { condition: "Thunderstorm", icon: "⛈️", effect: "rain" },
        96: { condition: "Thunderstorm", icon: "⛈️", effect: "rain" },
        99: { condition: "Thunderstorm", icon: "⛈️", effect: "rain" },
    },
};
