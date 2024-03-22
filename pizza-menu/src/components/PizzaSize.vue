<template>
  <!-- Container for a single pizza size option -->
  <div class="size-item">
    <input type="checkbox" :checked="isChecked" :id="`checkbox-${size.id}-${pizza.id}`" @change="onCheckedChange" />
    <label :for="`checkbox-${size.id}-${pizza.id}`">{{ size.name }}</label>
    <!-- Display and edit the price of this size -->
    <PizzaPrice :price="priceAmount" :onPriceChange="handlePriceChange" :disabled="!isChecked" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import PizzaPrice from "../components/PizzaPrice.vue";
import { usePizzaStore } from "../stores/pizzaStore";

// Access the store
const pizzaStore = usePizzaStore();
const { updatePrice, getPrice, getIsSelectedPrice, toggleSelectedPrice } = pizzaStore;

// Define props
const props = defineProps({
  size: Object,
  pizza: Object,
});

const previousPrice = ref(null);

// Determine initial price and checked status
const priceAmount = computed(() => {
  const priceObj = getPrice(props.pizza, props.size);
  return priceObj ? priceObj.price : 0;
});

// Check if the size is selected
const isChecked = computed(() => {
  return getIsSelectedPrice(props.pizza, props.size);
});

// Handle checkbox change
const onCheckedChange = () => {
  toggleSelectedPrice(props.pizza, props.size);
};

// Handle price change
const handlePriceChange = (newPrice) => {
  // Update the price if the checkbox is checked
  if (isChecked.value) {
    updatePrice(props.pizza, props.size, newPrice);
    // Update the previous price whenever the price changes while checked
    previousPrice.value = newPrice;
  }
};
</script>

<style scoped>
.size-selector {
  display: flex;
  flex-wrap: wrap;
}

.size-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
  gap: 5px;
}

.size-item label,
.size-item input[type="checkbox"] {
  margin-bottom: 5px;
}

.input-icon-container {
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

.size-item input[type="checkbox"] {
  display: none;
}
.size-item label {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  line-height: 25px;
  user-select: none;
}

.size-item label:before {
  content: "";
  display: block;
  width: 20px;
  height: 20px;
  background-color: #f0f0f0;
  border: 2px solid #7ca2b7;
  border-radius: 4px;
}
.size-item input[type="checkbox"]:checked + label:before {
  background-color: #7ca2b7;
}

.size-item input[type="checkbox"]:checked + label:after {
  content: "✔";
  position: absolute;
  color: white;
  font-size: 12px;
}
</style>
