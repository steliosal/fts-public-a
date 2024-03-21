<template>
  <div class="size-item">
    <input type="checkbox" :checked="isChecked" :id="`checkbox-${size.id}-${pizza.id}`" @change="onCheckedChange" />
    <label :for="`checkbox-${size.id}-${pizza.id}`">{{ size.name }}</label>
    <PizzaPrice :price="priceAmount" :onPriceChange="handlePriceChange" :disabled="!isChecked" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import PizzaPrice from "../components/PizzaPrice.vue";
import { storeToRefs } from "pinia";
import { usePizzaStore } from "../stores/pizzaStore";

const pizzaStore = usePizzaStore();

const { updatePrice, getPrice, getIsSelectedPrice, toggleSelectedPrice } = pizzaStore;

const previousPrice = ref(null);

const props = defineProps({
  size: Object,
  pizza: Object,
});

// Determine initial price
// Note: You might need to adjust this part based on how you manage state.
const priceAmount = computed(() => {
  const priceObj = getPrice(props.pizza, props.size);
  return priceObj ? priceObj.price : 0;
});

const isChecked = computed(() => {
  return getIsSelectedPrice(props.pizza, props.size);
});

const onCheckedChange = () => {
  toggleSelectedPrice(props.pizza, props.size);
};

// Watch for changes in isChecked to update the price accordingly
// watch(isChecked, (newVal) => {
//   if (!newVal) {
//     // Unchecked, remember the current price and set it to 0
//     previousPrice.value = priceAmount.value;
//     updatePrice(props.pizza, props.size, 0.0);
//   } else if (previousPrice.value !== null) {
//     // Rechecked, restore the previous price if it exists
//     updatePrice(props.pizza, props.size, previousPrice.value);
//   }
// });

const handlePriceChange = (newPrice) => {
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
  width: 20px; /* Size of the custom checkbox */
  height: 20px; /* Size of the custom checkbox */
  background-color: #f0f0f0; /* Background color of the checkbox */
  border: 2px solid #7ca2b7; /* Border color */
  border-radius: 4px; /* Optional for rounded corners */
}
.size-item input[type="checkbox"]:checked + label:before {
  background-color: #7ca2b7; /* Change background color when checked */
}

/* Optional: add a checkmark when checked */
.size-item input[type="checkbox"]:checked + label:after {
  content: "✔"; /* Unicode checkmark */
  position: absolute;
  color: white; /* Checkmark color */
  font-size: 12px; /* Adjust as needed */
}
</style>
