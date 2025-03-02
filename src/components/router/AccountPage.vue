<script setup lang="ts">
import {useAuthStore} from "../../stores/AuthStore.ts";
import {useRouter} from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  router.push("/");
}

</script>

<template>
  <div class="account-page">
    <div class="title">Личный кабинет</div>
    <div class="info-label">Адрес эл. почты</div>
    <div class="info-box"> {{ authStore.authData?.userEmail }} </div>
    <div class="info-label">Ямя пользователя</div>
    <div class="info-box"> {{ authStore.authData?.userUsername }} </div>
    <button class="main-button change_password" disabled>Смена пароля</button>
    <button class="main-button logout-button" @click="logout">Выход</button>
  </div>
</template>

<style scoped>
.account-page {
  min-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: 1rem;
}

.title {
  font-size: 3rem;
}

.change_password:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.info-box {
  min-width: 200px;
  text-align: start;
  border: 1px solid gray;
  border-radius: 5px;
  background-color: var(--very-slight-gray-color);
  padding: 4px;
}

.logout-button {
  background-color: gray;
  border: 2px solid #757575;
  cursor: default;
}

.logout-button:hover {
  background-color: #6e6e6e;
  border: 2px solid #3e3e3e;
}
</style>