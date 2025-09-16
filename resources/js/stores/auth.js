import { defineStore } from "pinia";
import api from "@/services/api";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null,
        token: localStorage.getItem("token"),
        isLoading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user,
        userName: (state) => state.user?.name || "",
        userEmail: (state) => state.user?.email || "",
        userAvatar: (state) => {
            if (!state.user?.name) return null;
            const initials = state.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
            return `https://ui-avatars.com/api/?name=${initials}&background=3b82f6&color=ffffff&size=40`;
        },
    },

    actions: {
        async login(credentials) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await api.login(credentials);
                this.token = response.access_token;
                this.user = response.user;

                localStorage.setItem("token", this.token);

                return response;
            } catch (error) {
                this.error = error.response?.data?.message || "Login failed";
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async register(userData) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await api.register(userData);
                this.token = response.access_token;
                this.user = response.user;

                localStorage.setItem("token", this.token);

                return response;
            } catch (error) {
                this.error =
                    error.response?.data?.message || "Registration failed";
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchUser() {
            if (!this.token) return;

            this.isLoading = true;
            this.error = null;

            try {
                const user = await api.getUser();
                this.user = user;
            } catch (error) {
                this.error =
                    error.response?.data?.message || "Failed to fetch user";
                this.logout();
            } finally {
                this.isLoading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            this.error = null;

            localStorage.removeItem("token");
        },

        clearError() {
            this.error = null;
        },
    },
});
