<template>
  <div class="size-item">
    <input type="checkbox" v-model="isChecked" @change="onCheckedChange" />
    <label>{{ size.name }}</label>
    <PizzaPrice :price="priceAmount" :onPriceChange="handlePriceChange" :disabled="!isChecked" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import PizzaPrice from "../components/PizzaPrice.vue";
import { storeToRefs } from "pinia";
import { usePizzaStore } from "../stores/pizzaStore";

const pizzaStore = usePizzaStore();
const { prices } = storeToRefs(pizzaStore);
const { updatePrice } = pizzaStore;
const isChecked = ref(true);
const previousPrice = ref(null);

const props = defineProps({
  size: Object,
  pizza: Object,
});

// const priceObj = prices.value.find((price) => {
//   if (price.sizeId === props.size.id && price.pizzaId === props.pizza.id) {
//     return price;
//   }
// });
// const priceAmount = priceObj.price;

// Determine initial price
// Note: You might need to adjust this part based on how you manage state.
const priceAmount = computed(() => {
  const priceObj = prices.value.find((price) => price.sizeId === props.size.id && price.pizzaId === props.pizza.id);
  return priceObj ? priceObj.price : 0;
});

// Watch for changes in isChecked to update the price accordingly
watch(isChecked, (newVal) => {
  if (!newVal) {
    // Unchecked, remember the current price and set it to 0
    previousPrice.value = priceAmount.value;
    updatePrice(props.pizza, props.size, 0.0);
  } else if (previousPrice.value !== null) {
    // Rechecked, restore the previous price if it exists
    updatePrice(props.pizza, props.size, previousPrice.value);
  }
});

// const handlePriceChange = (newPrice) => {
//   if (isChecked.value) {
//     // Only update price if the item is checked
//     updatePrice(props.pizza, props.size, newPrice);
//   }
// };
const handlePriceChange = (newPrice) => {
  if (isChecked.value) {
    updatePrice(props.pizza, props.size, newPrice);
    // Update the previous price whenever the price changes while checked
    previousPrice.value = newPrice;
  }
};

const onCheckedChange = () => {
  if (!isChecked.value) {
    updatePrice(props.pizza, props.size, 0.0); // Set price to 0.00 when unchecked
  }
};
</script>

<style scoped>
.size-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.size-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
</style>
