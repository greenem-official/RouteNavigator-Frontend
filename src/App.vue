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
import {useAuthStore} from "./stores/AuthStore.ts";
import {onMounted} from "vue";

const authStore = useAuthStore();
authStore.initializeStore();

onMounted(async () => {
  try {
    authStore.checkToken().then(value => {
      if (value) console.log(value.error);
    })
  } catch (error) {
    console.error('Ошибка при обновлении данных авторизации:', error);
  }
});
</script>

<style scoped>
.layout {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 120vh;
}

.content {
  flex: 1;
  padding: 2rem;
  min-width: 80%;
}

.container a {
  display: block;
  margin-bottom: 10px;
}

</style>
