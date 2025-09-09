// Image Assets Constants
export const IMAGE_ASSETS = {
    // Weather animations
    weather: {
        rain: "/assets/images/weather/rain.gif",
        snow: "/assets/images/weather/snowy.gif",
        sunny: "/assets/images/weather/sunny.gif",
        cloudy: "/assets/images/weather/cloudy.gif",
        stormy: "/assets/images/weather/storm.gif",
        clear: "/assets/images/weather/clear.gif",
    },

    // Icons
    icons: {
        humidity: "/assets/images/icons/humidity.svg",
        wind: "/assets/images/icons/wind.svg",
        temperature: "/assets/images/icons/temperature.svg",
        location: "/assets/images/icons/location.svg",
        refresh: "/assets/images/icons/refresh.svg",
    },

    // Backgrounds
    backgrounds: {
        default: "/assets/images/backgrounds/default.jpg",
        weather: {
            sunny: "/assets/images/backgrounds/weather/sunny.jpg",
            rainy: "/assets/images/backgrounds/weather/rainy.jpg",
            cloudy: "/assets/images/backgrounds/weather/cloudy.jpg",
            snowy: "/assets/images/backgrounds/weather/snowy.jpg",
            stormy: "/assets/images/backgrounds/weather/stormy.jpg",
        },
    },
};

// Helper function to get weather image
export const getWeatherImage = (condition) => {
    const conditionMap = {
        Clear: "sunny",
        Clouds: "cloudy",
        Rain: "rain",
        Snow: "snow",
        Thunderstorm: "stormy",
    };

    const imageKey = conditionMap[condition] || "clear";
    return IMAGE_ASSETS.weather[imageKey] || IMAGE_ASSETS.weather.clear;
};

// Helper function to get weather background
export const getWeatherBackground = (condition) => {
    const conditionMap = {
        Clear: "sunny",
        Clouds: "cloudy",
        Rain: "rainy",
        Snow: "snowy",
        Thunderstorm: "stormy",
    };

    const imageKey = conditionMap[condition] || "default";
    return (
        IMAGE_ASSETS.backgrounds.weather[imageKey] ||
        IMAGE_ASSETS.backgrounds.default
    );
};
