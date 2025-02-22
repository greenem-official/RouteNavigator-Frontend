<template>
  <div class="layout">
    <Header />
    <main class="content">
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from './components/important/Header.vue';
import Footer from "./components/important/Footer.vue";
</script>

<style scoped>
.layout {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 100vh; /* Минимальная высота на весь экран, 100vh */
}

.content {
  flex: 1; /* Занимает оставшееся пространство */
  padding: 2rem; /* Отступы для основного контента */
}


.container a {
  display: block; /* Делаем ссылки блочными */
  margin-bottom: 10px; /* Добавляем отступ между картинками */
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
