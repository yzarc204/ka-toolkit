import { ref } from "vue";

// Global state for confirm modal
const isOpen = ref(false);
const title = ref("");
const message = ref("");
const description = ref("");
const type = ref("warning");
const confirmText = ref("Confirm");
const cancelText = ref("Cancel");
const loading = ref(false);
const loadingText = ref("Processing...");

// Promise resolve/reject functions
let resolvePromise = null;
let rejectPromise = null;

export function useConfirm() {
    const showConfirm = (options = {}) => {
        return new Promise((resolve, reject) => {
            // Set up promise handlers
            resolvePromise = resolve;
            rejectPromise = reject;

            // Set modal options
            title.value = options.title || "Confirm Action";
            message.value = options.message || "Are you sure?";
            description.value = options.description || "";
            type.value = options.type || "warning";
            confirmText.value = options.confirmText || "Confirm";
            cancelText.value = options.cancelText || "Cancel";
            loading.value = false;
            loadingText.value = options.loadingText || "Processing...";

            // Show modal
            isOpen.value = true;
        });
    };

    const handleConfirm = () => {
        if (resolvePromise) {
            resolvePromise(true);
            closeModal();
        }
    };

    const handleCancel = () => {
        if (rejectPromise) {
            rejectPromise(false);
            closeModal();
        }
    };

    const closeModal = () => {
        isOpen.value = false;
        resolvePromise = null;
        rejectPromise = null;
    };

    const setLoading = (isLoading, text = "Processing...") => {
        loading.value = isLoading;
        loadingText.value = text;
    };

    // Convenience methods for different types
    const confirmWarning = (message, options = {}) => {
        return showConfirm({ ...options, message, type: "warning" });
    };

    const confirmDanger = (message, options = {}) => {
        return showConfirm({ ...options, message, type: "danger" });
    };

    const confirmInfo = (message, options = {}) => {
        return showConfirm({ ...options, message, type: "info" });
    };

    const confirmSuccess = (message, options = {}) => {
        return showConfirm({ ...options, message, type: "success" });
    };

    const confirmQuestion = (message, options = {}) => {
        return showConfirm({ ...options, message, type: "question" });
    };

    return {
        // State
        isOpen,
        title,
        message,
        description,
        type,
        confirmText,
        cancelText,
        loading,
        loadingText,

        // Methods
        showConfirm,
        handleConfirm,
        handleCancel,
        closeModal,
        setLoading,

        // Convenience methods
        confirmWarning,
        confirmDanger,
        confirmInfo,
        confirmSuccess,
        confirmQuestion,
    };
}

// Global instance for app-wide usage
export const globalConfirm = useConfirm();
