<template>
  <div class="route-list">
    <RouteItem
        v-for="(route, index) in routes"
        :key="index"
        :route="route"
        :formatDateFunc="formatDateFunc"
        :isActive="activeIndex === index"
        :onClickFunc="() => setActiveIndex(index)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RouteItem from './RouteItem.vue'; // Импортируем компонент RouteItem
import type { RouteInterface } from '../../interfaces/Route.ts';

const props = defineProps({
  routes: {
    type: Array as () => RouteInterface[],
    required: true,
  },
  formatDateFunc: {
    type: Function,
    required: true,
  },
});

const activeIndex = ref<number | null>(null);

const setActiveIndex = (index: number) => {
  console.log(activeIndex.value, index)
  activeIndex.value = activeIndex.value === index ? null : index;
};
</script>

<style scoped>
.route-list {
}
</style>