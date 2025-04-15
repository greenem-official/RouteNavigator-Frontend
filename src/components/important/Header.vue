<template>
  <footer class="header">
    <div class="header-content">
      <div class ="left-and-right">
        <div class="header-left">
          <div class="header-logo">
            <router-link to="/" class="websiteTitle">RouteNavigation</router-link>
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
          <div class="authenticated-username-group" @click="navigateToAccount">
            <UserIcon class="user-icon"/>
            <div class="authenticated-username hover-underline">
              {{ authStore.authData?.userUsername || "Аккаунт" }}
            </div>
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
import UserIcon from "../../assets/UserIcon.vue";

// The website's header

export default defineComponent({
  components: {UserIcon},
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
  color: #2f79ca;
}

.header {
  width: 100%;
  background-color: var(--header-footer-color);
  border: solid var(--main-medium-active-color);
  border-width: 0 0 4px 0;
  font-weight: 600;
  /*border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;*/
  color: var(--main-active-color);
  padding: 1.5rem 0;
  align-items: center;
  justify-content: center;
}

.header-content {
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
  user-select: none;
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
  font-weight: 600;
  color: var(--main-active-color);
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
  background-color: var(--main-slightly-active-color);
  border: 2px solid var(--main-stronger-active-color);
  color: var(--dark-color);
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

.authenticated-username-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.authenticated-username {
  font-size: 1.5rem;
  line-height: 0.8rem;
  user-select: none;
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

.user-icon {
  width: 24px;
  height: 24px;
  /*stroke: var(--main-active-color);*/
  /*fill: var(--main-active-color);*/
}
</style>