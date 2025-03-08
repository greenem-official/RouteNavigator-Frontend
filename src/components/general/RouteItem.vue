<template>
  <div
      class="route"
      :class="{ active: isActive }"
      @click.stop="onClickFunc"
  >
    <div class="always-visible-part">
      <div class="left">
        <div class="destination">{{ getRoute().departureLocation.displayName }} → {{ getRoute().arrivalLocation.displayName }}</div>
        <div class="times">
          <div class="time">
            <span class="timeText">Транспорт: </span>
            <span class="timeTime">{{ getRoute().transportType.displayName }}</span>
          </div>
          <div class="time">
            <span class="timeText">Время отправления: </span>
            <span class="timeTime">{{ formattedDepartureTime }}</span>
          </div>
          <div class="time">
            <span class="timeText">Время прибытия: </span>
            <span class="timeTime">{{ formattedArrivalTime }}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="price">{{ formattedPrice }} ₽</div>
        <div class="amount" v-if="format === 'editing'"> {{ formattedAmount }} </div>
      </div>
    </div>
    <div class="expandable-part" @click.stop>
      <div v-if="isActive" class="additional-info">
        <div class="additional-info-area">
          <div v-if="format === 'booking'">
            <form @submit.prevent="handleBuyButtonClick">
              <div class="buy-section">
                <input
                    type="number"
                    placeholder="Число билетов"
                    class="main-input removeAmount"
                    min="0"
                    required
                    v-model="localTicketAmount"
                />
                <button class="buy-button" type="submit" >Купить</button>
              </div>
            </form>
          </div>
          <div v-if="format === 'editing'">
            <form @submit.prevent="handleModifyButtonClick">
              <div class="edit-section">
                <input
                    type="number"
                    placeholder="Число билетов"
                    class="main-input removeAmount"
                    min="0"
                    required
                    v-model="localRefundTicketAmount"
                />
                <button class="main-button modify-button" type="submit" >Убрать</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import type { Route } from '../../interfaces/Route.ts'
import type { Moment } from "moment-timezone";
import {useAuthStore} from "../../stores/AuthStore.ts";
import {useRouter} from "vue-router";
import {useModalStore} from "../../stores/ModalStore.ts";
import {ApiService} from "../../api/ApiService.ts";
import type {Booking} from "../../interfaces/Booking.ts";

interface RouteItemProps {
  route: Route | null;
  booking: Booking | null;
  formatDateFunc: (date: Moment) => string;
  format: string;
  isActive: boolean;
  onClickFunc: () => void;
}

const localTicketAmount = ref(1);
const localRefundTicketAmount = ref(1);

function getRoute() {
  if(props.route != null) return props.route as Route;
  // console.log(props.booking?.route)
  return props.booking?.route as Route;
}

const props = defineProps<RouteItemProps>();

const router = useRouter();
const authStore = useAuthStore();
const modalStore = useModalStore();

onMounted(async () => {
  resetLocalAmount();
});

function resetLocalAmount() {
  if(props.booking != null) {
    localTicketAmount.value = props.booking.ticketAmount;
  }
}

const emit = defineEmits(['updateList']);

const updateList = () => {
  emit('updateList');
};

const formattedDepartureTime = computed(() =>
    props.formatDateFunc(getRoute().departureTime)
);
const formattedArrivalTime = computed(() =>
    props.formatDateFunc(getRoute().arrivalTime)
);

const formattedPrice = computed(() => {
  return getRoute().price.toLocaleString('ru-RU');
});

const formattedAmount = computed(() => {
  let amount = props.booking?.ticketAmount;

  if(amount == undefined) return "";

  let s = amount + " ";
  s += "билет";
  if(amount % 10 == 1) {
    s += "";
  } else if(amount % 10 < 5) {
    s += "а";
  } else {
    s += "ов"
  }
  return s;
});

const handleBuyButtonClick = () => {
  if (!authStore.isUserAuthenticated) {
    router.push({ name: 'Login' });
  } else {
    performPayment();
  }
};

const handleModifyButtonClick = () => {
  if((props.booking?.ticketAmount as number) < localRefundTicketAmount.value) {
    localRefundTicketAmount.value = props.booking?.ticketAmount as number;
  }
  ApiService.modifyBooking(props.booking?.id as number, props.booking?.ticketAmount as number - localRefundTicketAmount.value).then((status) => {
    if(status == 200) {
      updateList();
      resetLocalAmount();
    } else {
      console.error("Got status " + status + " on modifyBooking");
    }
  })
};

const performPayment = () => {
  ApiService.bookRoute(getRoute().id, localTicketAmount.value).then((res) => {
    if ("message" in res) {
      if (res["message"] === "route_booking_success") {
        modalStore.openModal();
      }
    }
    else if ("error" in res) {
      console.error("Error on booking a route: ", res["error"]);
    }
  });
};

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
  gap: 10px;
}

.buy-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-section {
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 10px;
}

.removeAmount {
  width: 150px;
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