<script setup lang="ts">
import {onMounted, ref} from "vue";
import RouteList from "../general/RouteList.vue";
import moment, {type Moment} from "moment-timezone";
import {ApiService} from "../../api/ApiService.ts";
import type {Booking} from "../../interfaces/Booking.ts";

const activeBookings = ref<Booking[]>([]);

function formatTime(date: string | Moment): string {
  if (typeof date === "string") {
    date = moment(date);
  }
  return (date as Moment).format('YYYY-MM-DD HH:mm');
}

const refreshOrderedRoutes = () => {
  ApiService.getBookings().then(res => {
    activeBookings.value = res;
    console.log(res);
  });
}

// const routes = computed(() => {
//   const routes: Route[] = []
//   activeBookings.value.forEach((booking) => {
//     routes.push(booking.route)
//   })
//
//   return routes;
// });

onMounted(async () => {
  try {
    refreshOrderedRoutes();
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
});
</script>

<template>
<div class="ordersPage">
  <div class="ordersPage-header">
    Изменение заказов
  </div>
  <div class="scrollable-container orders-list">
    <RouteList :bookings="activeBookings" :formatDateFunc="formatTime" format="editing" />
  </div>
</div>
</template>

<style scoped>
.ordersPage {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  margin: 0 auto;
  max-width: 80%;
}

.ordersPage-header {
  font-size: 3rem;
  font-weight: bold;
  text-align: start;
}

.orders-list {
  /*display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;*/
  margin: 1rem 0;
}
</style>