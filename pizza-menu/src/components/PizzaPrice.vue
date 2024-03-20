<template>
  <div class="pizza-price-input">
    <div class="dollar-icon">$</div>
    <input type="number" :value="localPrice" @input="handlePriceChange" :disabled="disabled" />
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";

const props = defineProps({
  price: Number,
  onPriceChange: Function,
  disabled: Boolean,
});

const localPrice = ref(props.disabled ? 0 : props.price);

// Emit price change to parent component
function handlePriceChange(e) {
  // localPrice.value = e.target.value;
  props.onPriceChange(parseFloat(e.target.value));
}

// Watch for external price changes
// watch(
//   () => props.price,
//   (newPrice) => {
//     localPrice.value = newPrice;
//   }
// );
</script>

<style scoped>
.pizza-price-input {
  display: flex;
  align-items: center;
}

.dollar-icon {
  background-color: blue;
  color: white;
  padding: 0 5px;
  border-radius: 4px;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
