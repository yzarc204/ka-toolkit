import { createApp } from "vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
    position: "top-right",
    timeout: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
};

export function setupToast(app) {
    app.use(Toast, options);
}
