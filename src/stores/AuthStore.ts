import { defineStore } from 'pinia';
import {ApiService} from "../api/ApiService.ts";
import type {AuthData, ErrorMessage} from "../interfaces/AuthTypes.ts";

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
        saveStore() {
            localStorage.setItem('authStore', JSON.stringify(this.$state));
        },
        login(credentials: { email: string; password: string }): Promise<ErrorMessage | null> {
            console.log("login...");
            return ApiService.login(credentials.email, credentials.password).then(data => {
                    if ("error" in data) {
                        return data as ErrorMessage;
                    }

                    this.authData = data as AuthData;
                    this.isAuthenticated = true;

                    console.log(this.authData);

                    this.saveStore();
                    return null;
            }).catch(reason => {
                return {'error': reason } as ErrorMessage;
            });
        },
        register(credentials: { email: string; username: string, password: string }): Promise<ErrorMessage | null> {
            console.log("register...");
            return ApiService.register(credentials.email, credentials.username, credentials.password).then(data => {
                if ("error" in data) {
                    return data as ErrorMessage;
                }

                this.authData = data;
                this.isAuthenticated = true;

                console.log(this.authData);

                this.saveStore();
                return null;
            }).catch(reason => {
                return {'error': reason } as ErrorMessage;
            });
        },
        checkToken(): Promise<ErrorMessage | null> {
            if(!this.isAuthenticated) return Promise.resolve(null);

            return ApiService.checkToken(this.authData?.token as string).then(data => {
                if ("error" in data) {
                    this.logout();
                    return data as ErrorMessage;
                }

                this.authData = data;
                return null;
            }).catch(reason => {
                return {'error': reason } as ErrorMessage;
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
