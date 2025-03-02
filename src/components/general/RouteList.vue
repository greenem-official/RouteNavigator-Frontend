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
import {type PropType, ref} from 'vue';
import RouteItem from './RouteItem.vue';
import type { Route } from '../../interfaces/Route.ts';
import type {Moment} from "moment-timezone";

const props = defineProps({
  routes: {
    type: Array as PropType<Route[]>,
    required: true,
  },
  formatDateFunc: {
    type: Function as PropType<(date: Moment) => string>,
    required: true,
  },
});

const activeIndex = ref<number | null>(null);

const setActiveIndex = (index: number) => {
  // console.log(activeIndex.value, index)
  activeIndex.value = activeIndex.value === index ? null : index;
};
</script>

<style scoped>

</style>