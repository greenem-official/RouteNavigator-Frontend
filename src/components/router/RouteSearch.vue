<template>
  <div class="search-page">
    <h1>Поиск маршрутов</h1>
    <div class="layout">
      <!-- Левая часть: Результаты поиска и календарь -->
      <div class="tabs-container" :style="{ width: containerWidth + 'px' }">
        <div class="tabs">
          <button
              :class="['tab-button', { active: activeTab === 'simple' }]"
              @click="activeTab = 'simple'"
          >
            Простой режим
          </button>
          <button
              :class="['tab-button', { active: activeTab === 'calendar' }]"
              @click="activeTab = 'calendar'"
          >
            Календарь
          </button>
          <div class="tab-indicator" :style="indicatorStyle"></div>
        </div>

        <div v-if="activeTab === 'simple'" class="simple-mode">
          <div class="scrollable-container">
            <RouteList :routes="routesSimpleMode" :formatDateFunc="getFormattedMomentUserTZCombined" />
          </div>
        </div>

        <div v-if="activeTab === 'calendar'" class="calendar-mode">
          <div class="calendar">
            <div
                v-for="day in calendarDays"
                :key="getFormattedMomentDateSimple(day.date)"
                :class="{ 'available': day.hasRoutes, 'selected': extractDateFromMoment(day.date) === extractDateFromMoment(selectedDate) }"
                @click="selectDate(day.date)"
            >
              {{ formatMomentForCalendar(day.date) }}
            </div>
          </div>

          <div class="routes-for-date">
            <div class="scrollable-container">
              <RouteList :routes="routesForDate" :formatDateFunc="getFormattedMomentUserTZCombined" />
            </div>
          </div>
        </div>
      </div>

      <!-- Правая часть: Форма поиска -->
      <div class="filters">
        <form> <!--@submit.prevent="searchRoutes"-->
          <div class="from-to-group">
            <div>
              <label for="from">Откуда:</label>
              <input id="from" v-model="searchParams.from" type="text" list="fromLocationOptions" />
              <datalist id="fromLocationOptions">
                <option v-for="option in firstLocationOptions" :key="option.code" :value="option.displayName">
                  {{ option.displayName }}
                </option>
              </datalist>
            </div>
            <div class="swap-btn-div">
              <button class="swap-button" @click.prevent="swapLocations">
                <SwapIcon />
              </button>
            </div>
            <div>
              <label for="to">Куда:</label>
              <input id="to" v-model="searchParams.to" type="text" list="toLocationOptions" />
              <datalist id="toLocationOptions">
                <option v-for="option in secondLocationOptions" :key="option.code" :value="option.displayName">
                  {{ option.displayName }}
                </option>
              </datalist>
            </div>
          </div>
          <div class="otherFilters">
            <div class="filterDateAndTime">
              <div>
                <label for="date">Дата:</label>
                <input id="date" class="filterDateTime" v-model="searchParams.date" type="date" required />
              </div>
              <div>
                <label for="time">Время:</label>
                <input id="time" class="filterDateTime" v-model="searchParams.time" type="time" required />
              </div>
            </div>
            <div class="transportType">
              <div>
                <label>Транспорт:</label>
                <div class="transport-buttons">
                  <button
                      v-for="(isActive, type) in searchParams.transportType"
                      :key="type"
                      :class="['transport-button', { active: isActive }]"
                      @click.prevent="toggleTransportType(type)"
                  >
                    <span v-if="type === 'transport_plane'">✈️</span>
                    <span v-if="type === 'transport_train'">🚂</span>
                    <span v-if="type === 'transport_bus'">🚌</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="updateRoutes">
            <button type="button" class="updateRoutesBtn" @click="searchRoutes(activeTab)" >Обновить маршруты</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch, onMounted} from 'vue';
import moment, {type Moment} from 'moment-timezone';
import SwapIcon from "../../assets/SwapIcon.vue";
import type { Route } from "../../interfaces/Route.ts";
import RouteList from "../general/RouteList.vue";
import {Location} from "../../interfaces/Location.ts";
import {ApiService} from "../../api/ApiService.ts";
import {useAuthStore} from "../../stores/AuthStore.ts";

const activeTab = ref<'simple' | 'calendar'>('simple');

const authStore = useAuthStore();

const containerWidth = computed(() => {
  // console.log('containerWidth');
  return activeTab.value === 'simple' ? 600 : 720;
});

const indicatorStyle = computed(() => {
  // console.log('indicatorStyle');
  const index = activeTab.value === 'simple' ? 0 : 1;
  return {
    transform: `translateX(${index * 100}%)`,
  };
});

const mainTimeZone = 'Europe/Moscow';
const userTimeZone = ref<string>(mainTimeZone);

function getFormattedMomentDateSimple(moment: Moment) {
  return moment.format('YYYY-MM-DD');
}

function getFormattedMomentTimeSimple(moment: Moment) {
  return moment.format('HH:mm');
}

function getFormattedMoment(moment: Moment) {
  // console.log("getFormattedMoment");
  moment = moment.tz(mainTimeZone);
  return {
    date: getFormattedMomentDateSimple(moment),
    time: getFormattedMomentTimeSimple(moment),
  };
}

function getFormattedMomentUserTZ(moment: Moment) {
  // console.log("getFormattedMomentUserTZCombined");
  moment = moment.clone().tz(userTimeZone.value);
  return {
    date: getFormattedMomentDateSimple(moment),
    time: getFormattedMomentTimeSimple(moment),
  };
}

function getFormattedMomentUserTZCombined(moment: Moment) {
  let dateTime = getFormattedMomentUserTZ(moment);
  return dateTime.date + " " + dateTime.time;
}

function extractDateFromMoment(date: Moment) {
  return date.format('YYYY-MM-DD');
}

function formatMomentForCalendar(date: Moment) {
  return moment(date).format('DD/MM');
}

const searchParams = ref({
  from: "",
  to: '',
  ...getFormattedMoment(moment().add(2, "days")),
  transportType: {
    "transport_plane": true,
    "transport_train": true,
    "transport_bus": false,
  }
});

const firstLocationOptions = ref<Location[]>([]);
const secondLocationOptions = ref<Location[]>([]);

onMounted(async () => {
  try {
    const [firstLocations, secondLocations] = await Promise.all([
      ApiService.getLocations(searchParams.value.from),
      ApiService.getLocations(searchParams.value.to),
    ]);

    firstLocationOptions.value = firstLocations;
    secondLocationOptions.value = secondLocations;

    searchRoutes("simple");
    searchRoutes("calendar");
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
});

const toggleTransportType = (type: keyof typeof searchParams.value.transportType) => {
  searchParams.value.transportType[type] = !searchParams.value.transportType[type];
};

// Routes by main date, simple mode data should stay even when the calendar mode is used
const routesSimpleMode = ref<Route[]>([]);

// Routes requested specifically for some date
const routesCalendar = ref<Record<string, Route[]>>({
  // '2025-02-17': [
  // ],
});

const calendarDays = ref<{ date: Moment; hasRoutes: boolean }[]>([]);
const selectedDate = ref<Moment>(moment(new Date(searchParams.value.date)).tz(userTimeZone.value));
// console.log('selectedDate:', selectedDate.value); // extractDateFromMoment(selectedDate.value)

function momentToUniqueString(date: Moment) {
  return date.format('YYYY-MM-DD');
}

const routesForDate = computed(() => {
  // console.log("routesForDate");
  return routesCalendar.value[momentToUniqueString(selectedDate.value)];
});

const searchRoutes = (mode: string) => {
  console.log('Поиск маршрутов:'); //, searchParams.value);
  const date = momentToUniqueString(selectedDate.value); // searchParams.value.date
  console.log(date);
  if (mode == 'calendar') {
    // routesCalendar.value[date] = [];
    ApiService.getRoutes(searchParams, selectedDate.value.toISOString(), false).then(res => { routesCalendar.value[date] = res })
  }
  else {
    // routesSimpleMode.value = [];
    const departureTimeMin = moment(searchParams.value.date).add(searchParams.value.time.split(':')[0], "hour").add(searchParams.value.time.split(':')[1], "minute").toISOString()
    ApiService.getRoutes(searchParams, departureTimeMin, true).then(res => { routesSimpleMode.value = res })
  }
};

const swapLocations = () => {
  [searchParams.value.from, searchParams.value.to] = [searchParams.value.to, searchParams.value.from];
};

const selectDate = (date: Moment) => {
  selectedDate.value = date.clone().tz(userTimeZone.value);
  // console.log('Выбрана дата:', selectedDate.value);
  searchRoutes("calendar");
};

const generateCalendar = () => {
  // console.log('Generating calendar...');
  try {
    const startDate = new Date(searchParams.value.date);
    if (isNaN(startDate.getTime())) {
      throw new Error('Некорректная дата');
    }

    // Looking for monday
    const dayOfWeek = startDate.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(startDate);
    monday.setDate(startDate.getDate() - diffToMonday);

    calendarDays.value = Array.from({ length: 14 }, (_, i) => {
      let tempDate = new Date(monday)
      tempDate.setDate(tempDate.getDate() + i);

      const date = moment(tempDate).tz(mainTimeZone);

      return {
        date: moment(date).tz(mainTimeZone),
        hasRoutes: routesSimpleMode.value.find(value => {
          return extractDateFromMoment(value.departureTime) === extractDateFromMoment(date);
        }) != null
      };
    });
  } catch (error) {
    console.error('Ошибка при генерации календаря:', error);
    calendarDays.value = [];
  }
};

watch(() => searchParams.value.date, generateCalendar, { immediate: true });
</script>

<style scoped>
.search-page {
  text-align: left;
}

/*//.search-page {
//  max-width: 1200px;
//  margin: 0 auto;
//  padding: 20px;
//}*/

.layout {
  text-align: center;
  display: flex;
  gap: 20px;
}

.tabs-container {
  transition: width 0.3s ease;
}

.tabs {
  display: flex;
  position: relative;
  border-bottom: 2px solid var(--slight-border);
}

button {
  padding: 10px 15px;
  background-color: var(--active-flat-button);
  color: var(--bright-text-color);
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: var(--slight-active-tint);
}

.tab-button {
  flex: 1;
  padding: 10px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: center;
  position: relative;
  color: var(--inactive-text);
}

.tab-button:hover {
  background-color: var(--slight-active-tint);
}

.tab-button.active {
  color: var(--active-text);
}

.tab-indicator {
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  width: 50%;
  background-color: var(--active-text);
  transition: transform 0.3s ease;
}

.simple-mode,
.calendar-mode {
  margin-top: 20px;
  margin-bottom: 20px;
}

.calendar {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.calendar > div {
  width: 14.28%; /* 100% / 7 дней */
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
}

.calendar > div.available {
  background-color: var(--available-flat-button);
}

.calendar > div.selected {
  background-color: var(--active-flat-button);
  color: var(--bright-text-color);
}

.route {
  margin: 10px auto;
  text-align: left;
}

.simple-mode .route,
.routes-for-date .route {
  border: 2px solid var(--slight-border);
  padding: 10px;
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px 0;
  margin-bottom: 10px;
}

.swap-btn-div {
  padding-top: 18px;
}

.swap-button {
  background-color: var(--inactive-flat-button);
  border: var(--strong-border) 1px solid;
  border-radius: 5px;
  cursor: pointer;
  padding: 0; /* Убираем внутренние отступы */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px; /* Фиксированная ширина */
  height: 25px; /* Фиксированная высота */
}

.swap-button:hover {
  background-color: var(--slight-active-tint);
}

.swap-button svg {
  width: 80%; /* Иконка занимает всю ширину кнопки */
  height: 80%; /* Иконка занимает всю высоту кнопки */
}

.from-to-group {
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: row;
  min-width: 400px;
  text-align: start;
}

.otherFilters {
  display: flex;
  flex-direction: column;
  align-items: start;
  text-align: start;
  margin-bottom: 20px;
}

.filterDateAndTime {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  gap: 30px;
}

.filterDateTime {

}

/*Transport buttons*/

.transport-buttons {
  display: flex;
  gap: 14px;
  flex-direction: row;
}

.transport-button {
  width: 40px;
  height: 40px;
  border: 1px solid var(--slight-border);
  border-radius: 4px;
  background-color: var(--inactive-flat-button);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.transport-button.active {
  background-color: var(--active-flat-button);
  color: var(--bright-text-color);
}

.transport-button:hover {
  border-color: var(--active-flat-button);
  background-color: var(--slight-active-tint);
}
.transport-button.active:hover {
  border-color: var(--slight-active-tint);
  background-color: var(--active-flat-button);
}

/*Update routes button*/

.updateRoutesBtn:hover {
  background-color: var(--main-stronger-active-color);
}

.scrollable-container {
  min-height: 450px;
  max-height: 550px;
  overflow-y: auto;
  padding: 0 10px;
}

</style>