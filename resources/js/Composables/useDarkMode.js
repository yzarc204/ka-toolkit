import { ref, watch } from "vue";

const isDarkMode = ref(false);

// Initialize dark mode from localStorage or system preference
const initializeDarkMode = () => {
    try {
        const stored = localStorage.getItem("darkMode");
        if (stored !== null) {
            isDarkMode.value = stored === "true";
        } else {
            // Use system preference if no stored preference
            isDarkMode.value = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
        }
        applyDarkMode();
    } catch (error) {
        console.error("Error initializing dark mode:", error);
        isDarkMode.value = false;
    }
};

// Apply dark mode to document
const applyDarkMode = () => {
    if (isDarkMode.value) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
};

// Toggle dark mode
const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    applyDarkMode();

    try {
        localStorage.setItem("darkMode", isDarkMode.value.toString());
    } catch (error) {
        console.error("Error saving dark mode preference:", error);
    }
};

// Set dark mode
const setDarkMode = (value) => {
    isDarkMode.value = value;
    applyDarkMode();

    try {
        localStorage.setItem("darkMode", isDarkMode.value.toString());
    } catch (error) {
        console.error("Error saving dark mode preference:", error);
    }
};

// Watch for system theme changes
const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
        // Only update if user hasn't set a preference
        const stored = localStorage.getItem("darkMode");
        if (stored === null) {
            isDarkMode.value = e.matches;
            applyDarkMode();
        }
    });
};

// Initialize on module load
initializeDarkMode();
watchSystemTheme();

export function useDarkMode() {
    return {
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
    };
}
