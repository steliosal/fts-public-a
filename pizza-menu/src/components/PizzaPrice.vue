<template>
  <!-- Container for the pizza price input -->
  <div class="pizza-price-input">
    <div class="dollar-icon">$</div>
    <input type="number" :value="disabled ? 0.0 : localPrice" @input="handlePriceChange" :disabled="disabled" />
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";

// Define props
const props = defineProps({
  price: Number,
  onPriceChange: Function,
  disabled: Boolean,
});

// Reactive state to manage the price input value
const localPrice = ref(props.price);

// Handler for when the price input changes
function handlePriceChange(e) {
  if (!props.disabled) {
    props.onPriceChange(parseFloat(e.target.value));
  }
}
// Update localPrice when external price changes
watch(
  () => props.price,
  (newPrice) => {
    localPrice.value = newPrice;
  }
);
</script>

<style scoped>
.pizza-price-input {
  display: flex;
  align-items: center;
  border: 2px solid #7ca2b7;
  border-radius: 4px;
  background-color: #7ca2b7;
}

.dollar-icon {
  color: white;
  padding-left: 9px;
  padding-right: 9px;
  background-color: #7ca2b7;
}
input[type="number"] {
  border: none;
  width: 50px;
  padding: 8px;
  outline: none;
  text-align: center;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"]::-ms-clear,
input[type="number"]::-ms-reveal {
  display: none;
}

</style>
