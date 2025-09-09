import "./bootstrap";
import "../css/app.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./routes";
import { useAuthStore } from "./stores/auth";
import { useUIStore } from "./stores/ui";
import { setupToast } from "./plugins/toast";
import App from "./App.vue";

// Import Tippy CSS
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "tippy.js/themes/material.css";
import "tippy.js/themes/translucent.css";

// Import Vue Tippy
import VueTippy from "vue-tippy";

const app = createApp(App);
const pinia = createPinia();

// Set up toast plugin
setupToast(app);

app.use(pinia);
app.use(router);
app.use(VueTippy);

// Initialize stores
const authStore = useAuthStore();
const uiStore = useUIStore();

// Initialize UI
uiStore.initializeDarkMode();

// Initialize auth
try {
    const token = localStorage.getItem("token");
    if (token) {
        authStore.fetchUser();
    }
} catch (error) {
    console.error("Error accessing localStorage:", error);
}

app.mount("#app");
