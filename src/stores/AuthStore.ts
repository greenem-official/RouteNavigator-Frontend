import { defineStore } from 'pinia';
import type {Moment} from "moment-timezone";
import {ApiService} from "../api/ApiService.ts";
import type {AuthData} from "../interfaces/AuthTypes.ts";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        authData: null as null | AuthData,
    }),
    actions: {
        initializeStore() {
            // Восстанавливаем состояние из localStorage
            const savedState = localStorage.getItem('authStore');
            if (savedState) {
                this.$state = JSON.parse(savedState);
            }
        },
        login(credentials: { email: string; password: string }) {
            ApiService.login(credentials.email, credentials.password).then(data => {
                this.authData = data;
                this.isAuthenticated = true;

                localStorage.setItem('authStore', JSON.stringify(this.$state));
            });
        },
        register(credentials: { email: string; username: string, password: string }) {
            ApiService.register(credentials.email, credentials.username, credentials.password).then(data => {
                this.authData = data;
                this.isAuthenticated = true;

                localStorage.setItem('authStore', JSON.stringify(this.$state));
            });
        },
        logout() {
            this.isAuthenticated = false;
            this.authData = null;

            localStorage.removeItem('authStore');
        },
    },
    getters: {
        isUserAuthenticated: (state) => state.isAuthenticated,
    },
});
