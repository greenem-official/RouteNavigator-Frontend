<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
});
</script>

<template>
  <div class="home-page">
    <div class="title">RouteNavigation</div>
    <div class="firstPhrase">Удобный маркетплейс пассажирских перевозок</div>
    <div class="secondPhrase">Найдите лучшие предложения на</div>
    <div class="listingOptions">
      <span class="colored">Перелёты</span>,
      <span class="colored">Поезда</span>,
      <span class="colored">Автобусы</span> и многое другое!
    </div>
    <div class="lastPhrase"></div>
    <router-link to="/search" class="search-button">Поиск Билетов</router-link>
    <div style="height: 200px" />
  </div>
</template>

<style scoped>
.home-page {
  text-align: center;
  padding: 50px;
}

.search-button {
  margin-top: 40px;
  font-size: 40px;
  font-weight: bold;
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.search-button:hover {
  background-color: #0056b3;
}

.title {
  font-size: 80px;
  font-weight: bold;
  margin-bottom: 40px;
}

.firstPhrase {
  font-size: 40px;
  margin-bottom: 70px;
}

.secondPhrase {
  font-size: 30px;
}

.lastPhrase {
  font-size: 30px;
}

.listingOptions {
  font-size: 30px;
}

.colored {
  /*color: var(--main-active-color);*/
  font-weight: bold;
}
</style>