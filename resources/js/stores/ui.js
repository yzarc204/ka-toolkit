import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
    state: () => ({
        isDarkMode: false,
        sidebarCollapsed: false,
        isLoading: false,
    }),

    getters: {
        themeClass: (state) => (state.isDarkMode ? "dark" : ""),
        sidebarWidth: (state) => (state.sidebarCollapsed ? "w-16" : "w-64"),
    },

    actions: {
        initializeDarkMode() {
            // Check localStorage first
            const savedTheme = localStorage.getItem("darkMode");
            if (savedTheme !== null) {
                this.isDarkMode = savedTheme === "true";
            } else {
                // Check system preference
                this.isDarkMode = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;
            }

            this.applyDarkMode();
        },

        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
            this.applyDarkMode();
            localStorage.setItem("darkMode", this.isDarkMode.toString());
        },

        setDarkMode(value) {
            this.isDarkMode = value;
            this.applyDarkMode();
            localStorage.setItem("darkMode", this.isDarkMode.toString());
        },

        applyDarkMode() {
            if (this.isDarkMode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        },

        toggleSidebar() {
            this.sidebarCollapsed = !this.sidebarCollapsed;
        },

        setSidebarCollapsed(value) {
            this.sidebarCollapsed = value;
        },

        setLoading(value) {
            this.isLoading = value;
        },
    },
});
