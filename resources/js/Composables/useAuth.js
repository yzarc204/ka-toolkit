import { ref } from "vue";
// Use window.axios to ensure we use the same instance with interceptors
const axios = window.axios;

const user = ref(null);
const token = ref(null);

// Initialize token safely
const initializeToken = () => {
    try {
        const storedToken = localStorage.getItem("token");
        token.value = storedToken;

        // Set token in axios headers
        if (token.value) {
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token.value}`;
        }
    } catch (error) {
        console.error("Error accessing localStorage:", error);
        token.value = null;
    }
};

// Initialize token when module loads
initializeToken();

export function useAuth() {
    const login = async (credentials) => {
        // Clear any existing token before attempting login
        // This prevents issues with expired tokens
        try {
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
        } catch (error) {
            console.log("⚠️ useAuth - Error clearing token:", error);
        }

        try {
            const response = await axios.post("/api/login", credentials);
            token.value = response.data.access_token;
            user.value = response.data.user;

            try {
                localStorage.setItem("token", token.value);
            } catch (storageError) {
                console.error(
                    "Error saving token to localStorage:",
                    storageError
                );
            }

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token.value}`;
            return response.data;
        } catch (error) {
            // Ensure token is cleared on login failure
            try {
                localStorage.removeItem("token");
                delete axios.defaults.headers.common["Authorization"];
            } catch (clearError) {
                console.log(
                    "⚠️ useAuth - Error clearing token after failure:",
                    clearError
                );
            }

            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post("/api/register", userData);
            token.value = response.data.access_token;
            user.value = response.data.user;

            try {
                localStorage.setItem("token", token.value);
            } catch (storageError) {
                console.error(
                    "Error saving token to localStorage:",
                    storageError
                );
            }

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token.value}`;
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/logout");
            token.value = null;
            user.value = null;

            try {
                localStorage.removeItem("token");
            } catch (storageError) {
                console.error(
                    "Error removing token from localStorage:",
                    storageError
                );
            }

            delete axios.defaults.headers.common["Authorization"];
            window.location.href = "/login";
        } catch (error) {
            // Even if the logout request fails, clear local data and redirect
            token.value = null;
            user.value = null;

            try {
                localStorage.removeItem("token");
            } catch (storageError) {
                console.error(
                    "Error removing token from localStorage:",
                    storageError
                );
            }

            delete axios.defaults.headers.common["Authorization"];
            window.location.href = "/login";
            console.error("Logout error:", error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get("/api/user");
            user.value = response.data;
            return response.data;
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    };

    return {
        user,
        token,
        login,
        register,
        logout,
        fetchUser,
    };
}
