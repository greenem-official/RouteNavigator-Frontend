<script setup lang="ts">
import {computed, ref} from "vue";
import {useAuthStore} from "../../stores/AuthStore.ts";
import {translateMessage} from "../../localization/MessageTranslator.ts";
import router from "../../../router";

const authStore = useAuthStore();

const activeTab = ref<'login' | 'register'>('login');
const errorMessage = ref<string>('');

const authParams = ref({
  email: "",
  username: "",
  password: "",
  passwordCheck: "",
});

// Animations

const containerWidth = computed(() => {
  // console.log('containerWidth');
  return activeTab.value === 'login' ? 300 : 330;
});

// Functionality

const submitForm = () => {
  console.log("submit form");
  if (activeTab.value === 'login') {
    authStore.login({ email: authParams.value.email, password: authParams.value.password }).then((res) => {
      errorMessage.value = '';
      if (res) errorMessage.value = res.error;
      else {
        router.push('/');
      }
    });
  } else {
    authStore.register({ email: authParams.value.email, username: authParams.value.username, password: authParams.value.password }).then((res) => {
      errorMessage.value = '';
      if (res) errorMessage.value = res.error;
      else {
        router.push('/');
      }
    });
  }
}

// Styles

const indicatorStyle = computed(() => {
  const index = activeTab.value === 'login' ? 0 : 1;
  return {
    transform: `translateX(${index * 100}%)`,
  };
});
</script>

<template>
<div class="vertical-main">
  <div class="title">Авторизация</div>
  <div class="auth-container" :style="{ width: 500 + 'px' }">
    <div class="tabs">
      <button
          :class="['tab-button', { active: activeTab === 'login' }]"
          @click="activeTab = 'login'"
      >
        Вход
      </button>
      <button
          :class="['tab-button', { active: activeTab === 'register' }]"
          @click="activeTab = 'register'"
      >
        Регистрация
      </button>
      <div class="tab-indicator" :style="indicatorStyle"></div>
    </div>
    <form @submit.prevent="submitForm" class="actual-form">
      <div class="auth-form" :style="{ width: containerWidth + 'px' }">
        <div class="input-section">
          <label class="info-label">Email</label>
          <input
              class="info-input"
              v-model="authParams.email"
              type="email"
              autocomplete="username"
              :required="activeTab === 'login' || activeTab === 'register'"
          />
        </div>

        <div class="input-section" v-if="activeTab === 'register'">
          <label class="info-label">Имя пользователя</label>
          <input
              class="info-input"
              v-model="authParams.username"
              type="text"
              autocomplete="username"
              required
          />
        </div>

        <div class="input-section">
          <label class="info-label">Пароль</label>
          <input
              class="info-input"
              v-model="authParams.password"
              type="password"
              :autocomplete="activeTab === 'login' ? 'current-password' : 'new-password'"
              :required="activeTab === 'login' || activeTab === 'register'"
          />
        </div>

        <div class="input-section" v-if="activeTab === 'register'">
          <label class="info-label">Повтор пароля</label>
          <input
              class="info-input"
              v-model="authParams.passwordCheck"
              type="password"
              autocomplete="new-password"
              required
          />
        </div>
        <div class="error-section">
          <label class="error-label"> {{ translateMessage(errorMessage) }} </label>
        </div>
        <button class="submit-button" type="submit">
          {{ activeTab === 'login' ? 'Войти' : 'Зарегистрироваться' }}
        </button>
      </div>
    </form>
  </div>
</div>
</template>

<style scoped>
.vertical-main {
  font-size: 1.2rem;
}

.title {
  font-size: 2rem;
  margin: 0.8rem 0;
}

.auth-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.tabs {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
}

.tab-button {
  display: flex;
  width: 100%;
  justify-content: center;
  background-color: var(--main-active-4);
}

.tab-button.active {
  background-color: var(--main-active-10);
}

.tab-indicator {
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  width: 50%;
  background-color: var(--active-text);
  transition: transform 0.15s ease;
}

.actual-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.auth-form {
  margin: 1.5rem;
  /*align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;*/
  /*width: 90%;*/
  transition: width 0.3s ease;
  padding: 15px 30px;
  background-color: var(--very-slight-gray-color);
  border-radius: 5px;
  box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);
  border: solid 2px #e8e8e8;
}

.input-section {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 0.5rem 0;
  gap: 0.2rem
}

.info-label {
  color: var(--dark-color)
}

.info-input {
  display: flex;
  width: 100%;
  padding: 7px;
  border: 1px solid var(--main-medium-active-color);
  border-radius: 5px;
  font-size: 1rem;
  color: var(--dark-color);
  background-color: var(--main-very-slightly-active-color);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.info-input:focus {
  border-color: var(--active-text); /* Цвет границы при фокусе */
  background-color: var(--main-brihter-calm-color);;
  outline: none; /* Убираем стандартный outline */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Тень при фокусе */
}

.error-section {
  display: flex;
  margin: 2px;
  justify-content: start;
  text-align: start;
}

.error-label {
  color: #cf5858;
  font-weight: bold;
}

.submit-button {
  background-color: var(--main-medium-active-color);
  color: var(--bright-text-color);
  font-weight: bold;
  margin: 0.8rem 0;
}
</style>