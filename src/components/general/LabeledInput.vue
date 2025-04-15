<template>
  <div class="input-section">
    <label class="info-label">{{ label }}</label>
    <input
        class="info-input"
        :type="type"
        :value="modelValue"
        @input="onInput"
        :required="required"
        :autocomplete="autocomplete"
    />
    <span v-if="!isValid" class="error-message">{{ errorMessage }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// This is a component of a custom text input with a name label and some extra useful logic, such as validation

const props = defineProps({
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  required: { type: Boolean, default: false },
  modelValue: { type: String, default: '' },
  autocomplete: { type: String, default: ''},
  min_length: { type: Number, default: 1 },
  max_length: { type: Number, default: 20 },
  invalidByOuterFactorsMessage: { type: String, default: undefined }
});

const emit = defineEmits(['update:modelValue', 'validate']);

const isValid = ref(true);
const errorMessage = ref("");

const onInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
  validateInput(value);
};

const validateInput = (value: string) => {
  isValid.value = !(props.required && !value);
  if (!isValid.value) errorMessage.value = "Требуется ввести значение"
  if (props.min_length && value.length < props.min_length) {
    isValid.value = false;
    errorMessage.value = "Минимум " + props.min_length + " символов";
  } else if (props.max_length && value.length > props.max_length) {
    isValid.value = false;
    errorMessage.value = "Максимум " + props.max_length + " символов";
  } else if (props.invalidByOuterFactorsMessage != undefined) {
    isValid.value = false;
    errorMessage.value = props.invalidByOuterFactorsMessage;
  }
  emit('validate', isValid.value);
};

defineExpose({
  isValid: isValid,
});

watch(() => props.modelValue, validateInput);
</script>

<style scoped>
.input-section {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 0.5rem 0;
  gap: 0.2rem
}

.info-label {
  color: var(--dark-color)
}

.info-input {
  display: flex;
  width: 100%;
  padding: 7px;
  border: 1px solid var(--main-medium-active-color);
  border-radius: 5px;
  font-size: 1rem;
  color: var(--dark-color);
  background-color: var(--main-very-slightly-active-color);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.info-input:focus {
  border-color: var(--active-text);
  background-color: var(--main-brihter-calm-color);;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.error-message {
  color: red;
  font-size: 0.8em;
}
</style>