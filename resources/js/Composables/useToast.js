import { useToast as useVueToast } from "vue-toastification";

export function useToast() {
    const toast = useVueToast();

    const success = (message, options = {}) => {
        toast.success(message, {
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
            ...options,
        });
    };

    const error = (message, options = {}) => {
        toast.error(message, {
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
            ...options,
        });
    };

    const info = (message, options = {}) => {
        toast.info(message, {
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
            ...options,
        });
    };

    const warning = (message, options = {}) => {
        toast.warning(message, {
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
            ...options,
        });
    };

    return {
        success,
        error,
        info,
        warning,
    };
}
