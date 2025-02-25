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
<button @click="logout">Выход</button>
</template>

<style scoped>

</style>