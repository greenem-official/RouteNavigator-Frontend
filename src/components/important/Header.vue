<template>
  <footer class="footer">
    <div class="footer-content">
      <div class ="left-and-right">
        <div class="header-left">
          <div class="header-logo">
            <router-link to="/" class="websiteTitle">Route Navigation</router-link>
          </div>

          <nav class="footer-nav">
            <ul>
              <router-link :to="{ name: 'Search' }">Поиск</router-link>
              <router-link :to="{ name: 'Orders' }">Изменение</router-link>
            </ul>
          </nav>
        </div>
        <div class="header-right" v-if="!authStore.isUserAuthenticated">
          <button class="login-button" @click="navigateToLogin">Войти</button>
        </div>
        <div v-else class="authenticated-container">
          <div class="authenticated-username hover-underline" @click="navigateToAccount">
            {{ authStore.authData?.userUsername || "Аккаунт" }}
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { useAuthStore } from '../../stores/AuthStore';
import { useRouter } from "vue-router";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const navigateToLogin = () => router.push({ name: 'Login' });

    const navigateToAccount = () => router.push({ name: 'Account' });

    return {
      authStore,
      navigateToLogin,
      navigateToAccount,
    };
  },
});
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
  background-color: var(--header-footer-color);
  border-radius: 10px;
  color: white;
  padding: 1.5rem 0;
  align-items: center;
  justify-content: center;
}

.footer-content {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

.left-and-right {
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
}

.header-left {
  align-items: center;
  display: flex;
  flex-direction: row;
  /*margin-right: 70px;*/
}

.footer-nav ul {
  list-style: none;
  margin: 0;
  display: flex;
  font-size: 24px;
  gap: 2rem;
  padding: 0 4rem;
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
  background-color: #345983;
  border: 2px solid var(--main-stronger-active-color);
  color: var(--bright-text-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
}

.login-button:hover,
.register-button:hover {
  background-color: #367cb6;
}

.authenticated-container {
  margin-right: 0.8rem;
}

.authenticated-username {
  font-size: 1.5rem;
  line-height: 0.8rem;
}

.hover-underline {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: text-decoration 0.3s ease;
}

.hover-underline:hover {
  text-decoration: underline;
}
</style>