<template>
  <div class="route-list">
    <RouteItem
        v-for="(item, index) in items"
        :key="index"
        :route="itemType === 'route' ? item as Route : null"
        :booking="itemType === 'booking' ? item as Booking : null"
        :formatDateFunc="formatDateFunc"
        :format="format"
        :isActive="activeIndex === index"
        :onClickFunc="() => setActiveIndex(index)"
    />
  </div>
</template>

<script setup lang="ts">
// booking editing

import {computed, ref} from 'vue';
import RouteItem from './RouteItem.vue';
import type { Route } from '../../interfaces/Route.ts';
import type {Moment} from "moment-timezone";
import type {Booking} from "../../interfaces/Booking.ts";

interface RouteListProps {
  routes?: Route[]
  bookings?: Booking[];
  formatDateFunc: (date: Moment) => string;
  format: string;
}

const props = defineProps<RouteListProps>();


const items = computed(() => {
  return props.routes || props.bookings || [];
});

const itemType = computed(() => {
  return props.routes ? 'route' : 'booking';
});

const activeIndex = ref<number | null>(null);

const setActiveIndex = (index: number) => {
  // console.log(activeIndex.value, index)
  activeIndex.value = activeIndex.value === index ? null : index;
};
</script>

<style scoped>

</style>
