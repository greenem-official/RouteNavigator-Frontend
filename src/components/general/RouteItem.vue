<template>
  <div
      class="route"
      :class="{ active: isActive }"
      @click.stop="onClickFunc"
  >
    <div class="always-visible-part">
      <div class="left">
        <div class="destination">{{ route.departureLocation.displayName }} → {{ route.arrivalLocation.displayName }}</div>
        <div class="times">
          <div class="time">
            <span class="timeText">Время отправления: </span>
            <span class="timeTime">{{ formattedDepartureTime }}</span>
          </div>
          <div class="time">
            <span class="timeText">Время прибытия: </span>
            <span class="timeTime">{{ formattedArrivalTime }}</span>
          </div>
          <div class="time">
            <span class="timeText">Тип: </span>
            <span class="timeTime">{{ route.transportType.displayName }}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="price">{{ formattedPrice }} р.</div>
      </div>
    </div>
    <div class="expandable-part" @click.stop>
      <div v-if="isActive" class="additional-info">
        <div class="buy-section">
          <button class="buy-button" @click="handleBuyButtonClick">Купить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Route } from '../../interfaces/Route.ts'
import type { Moment } from "moment-timezone";
import {useAuthStore} from "../../stores/AuthStore.ts";
import {useRouter} from "vue-router";

interface RouteItemProps {
  route: Route;
  formatDateFunc: (date: Moment) => string;
  isActive: boolean;
  onClickFunc: () => void;
}

const props = defineProps<RouteItemProps>();

const router = useRouter();
const authStore = useAuthStore();

const formattedDepartureTime = computed(() =>
    props.formatDateFunc(props.route.departureTime)
);
const formattedArrivalTime = computed(() =>
    props.formatDateFunc(props.route.arrivalTime)
);

const formattedPrice = computed(() => {
  return props.route.price.toLocaleString('ru-RU');
});

const handleBuyButtonClick = () => {
  if (!authStore.isUserAuthenticated) {
    router.push({ name: 'Login' });
  } else {
    performPayment();
  }
};

const performPayment = () => {
  console.log('Payment');
};

// watch(
//     () => props.isActive,
//     (newVal) => {
//       console.log(`RouteItem isActive changed to: ${newVal}`);
//     }
// );
</script>

<style scoped>
@import '../../colors.css';

.always-visible-part {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.route {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;

  user-select: none;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.route.active {
  border-color: var(--main-active-color);
}

.left {
  margin: 5px 0;
  justify-content: space-between;
  display: flex;
  gap: 0;
  flex-direction: column;
  width: 100%;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: end;
  width: 100%;
  max-width: 100px;
}

.destination {
  text-align: start;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.times {
  display: flex;
  flex-direction: column;
  max-width: 300px;
}

.time {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.price {
  font-size: 20px;
  font-weight: bold;
}

.additional-info {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  width: 100%;
  animation: slide-down 0.3s ease;
}

.buy-section {
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.buy-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>