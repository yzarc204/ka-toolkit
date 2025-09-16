import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Add CSRF token to all requests
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
} else {
    console.error("CSRF token not found");
}

// Set up the authorization header if token exists
const authToken = localStorage.getItem("token");
if (authToken) {
    window.axios.defaults.headers.common[
        "Authorization"
    ] = `Bearer ${authToken}`;
}

// Add response interceptor to handle 401 errors
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear the invalid token from localStorage
            localStorage.removeItem("token");
            delete window.axios.defaults.headers.common["Authorization"];

            // Only redirect to login if not already on login page
            // This prevents redirect loop when login fails
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);
