import axios from "axios";

// Set up axios defaults
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Add CSRF token to all requests
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
}

// Set up the authorization header if token exists
const authToken = localStorage.getItem("token");
if (authToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
}

// Add response interceptor to handle 401 errors
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear the invalid token from localStorage
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];

            // Only redirect to login if not already on login page
            // This prevents redirect loop when login fails
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default {
    // Auth API
    async login(credentials) {
        const response = await axios.post("/api/login", credentials);
        const token = response.data.access_token;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return response.data;
    },

    async register(userData) {
        const response = await axios.post("/api/register", userData);
        const token = response.data.access_token;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return response.data;
    },

    async logout() {
        await axios.post("/api/logout");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
    },

    async getUser() {
        const response = await axios.get("/api/user");
        return response.data;
    },

    // Notes API
    async getNotes() {
        const response = await axios.get("/api/notes");
        return response.data;
    },

    async createNote(noteData) {
        const response = await axios.post("/api/notes", noteData);
        return response.data;
    },

    async updateNote(id, noteData) {
        const response = await axios.put(`/api/notes/${id}`, noteData);
        return response.data;
    },

    async deleteNote(id) {
        await axios.delete(`/api/notes/${id}`);
    },

    async shareNote(noteId, userId) {
        const response = await axios.post(`/api/notes/${noteId}/share`, {
            user_id: userId,
        });
        return response.data;
    },

    async unshareNote(noteId, userId) {
        const response = await axios.post(`/api/notes/${noteId}/unshare`, {
            user_id: userId,
        });
        return response.data;
    },

    // Users API
    async getUserByEmail(email) {
        const response = await axios.get(`/api/users/by-email/${email}`);
        return response.data;
    },
};
