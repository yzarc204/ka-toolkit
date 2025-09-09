/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.vue",
        "./resources/**/*.js",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Light mode colors
                "light-bg": "#FFFFFF",
                "light-text": "#1F2937",
                "light-border": "#E5E7EB",
                "light-hover": "#F9FAFB",
                "light-input": "#FFFFFF",
                "light-card": "#FFFFFF",
                "light-sidebar": "#FFFFFF",

                // Dark mode colors
                "dark-bg": "#0F172A",
                "dark-text": "#F1F5F9",
                "dark-border": "#334155",
                "dark-hover": "#1E293B",
                "dark-input": "#1E293B",
                "dark-card": "#1E293B",
                "dark-sidebar": "#0F172A",

                // Brand colors
                primary: {
                    50: "#EFF6FF",
                    100: "#DBEAFE",
                    200: "#BFDBFE",
                    300: "#93C5FD",
                    400: "#60A5FA",
                    500: "#3B82F6",
                    600: "#2563EB",
                    700: "#1D4ED8",
                    800: "#1E40AF",
                    900: "#1E3A8A",
                },
                accent: {
                    50: "#F0FDF4",
                    100: "#DCFCE7",
                    200: "#BBF7D0",
                    300: "#86EFAC",
                    400: "#4ADE80",
                    500: "#22C55E",
                    600: "#16A34A",
                    700: "#15803D",
                    800: "#166534",
                    900: "#14532D",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            spacing: {
                18: "4.5rem",
                88: "22rem",
            },
            borderRadius: {
                xl: "0.75rem",
                "2xl": "1rem",
                "3xl": "1.5rem",
            },
            boxShadow: {
                soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
                "soft-dark":
                    "0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)",
            },
        },
    },
    plugins: [],
};
