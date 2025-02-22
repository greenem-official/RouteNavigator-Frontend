import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from '../router'; // Импортируем роутер

const app = createApp(App);

app.use(router); // Используем роутер

app.mount('#app');
