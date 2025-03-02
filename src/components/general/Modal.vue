<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean; // eslint-disable-line vue/no-unused-properties
}>();

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-button" @click="closeModal">×</button>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.close-button {
  color: var(--dark-color);
  background-color: rgba(156, 156, 156, 0.1);
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>