<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Текст слева -->
      <div class="header-left">
        <router-link to="/" class="websiteTitle">Route Navigation</router-link>
      </div>

      <nav class="footer-nav">
        <ul>
          <li><router-link to="/search">Бронирование</router-link></li>
          <li><router-link to="/search">Изменение</router-link></li>
        </ul>
      </nav>

      <div class="header-right">
        <button class="login-button">Войти</button>
        <button class="register-button">Регистрация</button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">

</script>

<style scoped>
.websiteTitle {
  /*line-height: 3;*/
  font-size: 30px;
  font-weight: bold;
  color: #AAAAAA;
}

.footer {
  width: 100%;
  background-color: var(--main-briht-calm-color);
  border-radius: 10px;
  color: white;
  padding: 1.5rem 0;
  align-items: center;
  justify-content: center;
}

.footer-content {
  margin: 0 auto;
  display: flex;
  align-items: center; /* Выравниваем элементы по вертикали */
  justify-content: space-between; /* Распределяем пространство между элементами */
  padding: 0 1rem; /* Отступы по бокам */
}

.header-left {
  align-items: start;
  /*margin-right: 70px;*/
}

.footer-nav ul {
  list-style: none; /* Убираем маркеры списка */
  margin: 0;
  display: flex;
  font-size: 24px;
  gap: 2rem; /* Отступ между элементами списка (X) */
  padding: 0 4rem; /* Отступы по бокам */
}

.footer-nav a {
  color: white;
  text-decoration: none;
}

.footer-nav a:hover {
  text-decoration: underline;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.login-button,
.register-button {
  padding: 0.5rem 1rem;
  background-color: var(--slight-active-tint);
  border: 2px solid var(--main-stronger-active-color);
  color: var(--dark-text-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
}

.login-button:hover,
.register-button:hover {
  background-color: #777;
}
</style>