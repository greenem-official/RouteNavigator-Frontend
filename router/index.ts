// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import MainPage from "../src/components/router/MainPage.vue";
import RouteSearch from "../src/components/router/RouteSearch.vue";
import LoginPage from "../src/components/router/LoginPage.vue";
import {useAuthStore} from "../src/stores/AuthStore.ts";
import ManageOrdersPage from "../src/components/router/ManageOrderedPage.vue";
import AccountPage from "../src/components/router/AccountPage.vue";

const routes = [
    { path: '/', component: MainPage, name: "Main" },
    { path: '/search', component: RouteSearch, name: "Search" },
    { path: '/login', component: LoginPage, name: "Login" },
    { path: '/orders', component: ManageOrdersPage, name: "Orders", meta: { requiresAuth: true } },
    { path: '/account', component: AccountPage, name: "Account", meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, _, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isUserAuthenticated) {
        next({ name: 'login' });
    } else {
        next();
    }
});

export default router;