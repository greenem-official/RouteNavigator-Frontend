<template>
  <div class="route-list" v-if="items.length > 0">
    <RouteItem
        v-for="(item, index) in items"
        :key="index"
        :route="itemType === 'route' ? item as Route : null"
        :booking="itemType === 'booking' ? item as Booking : null"
        :formatDateFunc="formatDateFunc"
        :format="format"
        :isActive="activeIndex === index"
        :onClickFunc="() => setActiveIndex(index)"
        @update-list = updateList
    />
  </div>
  <div class="empty-list" v-else>
    <div class="empty-text">Список пуст</div>
  </div>
</template>

<script setup lang="ts">
// booking editing

import {computed, ref} from 'vue';
import RouteItem from './RouteItem.vue';
import type { Route } from '../../interfaces/Route.ts';
import type {Moment} from "moment-timezone";
import type {Booking} from "../../interfaces/Booking.ts";

// This is a scrollable list of RouteItem items, presented at the main search page and at the cancellation page.

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

const emit = defineEmits(['updateList']);

const updateList = () => {
  emit('updateList');
};
</script>

<style scoped>
.empty-list {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  padding: 16px;
  border: 2px solid var(--slight-border);
  color: #515151;
  border-radius: 4px;
}

.empty-text {
  font-size: 1.5rem;
  font-style: italic;
  margin: 1rem 0;
  user-select: none;
}
</style>
