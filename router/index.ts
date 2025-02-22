// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import MainPage from "../src/components/router/MainPage.vue";
import RouteSearch from "../src/components/router/RouteSearch.vue";

const routes = [
    { path: '/', component: MainPage },
    { path: '/search', component: RouteSearch },
];

const router = createRouter({
    history: createWebHistory(), // Используем HTML5 History API
    routes, // Передаем массив маршрутов
});

export default router; // Экспортируем router