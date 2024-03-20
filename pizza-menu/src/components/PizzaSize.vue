<template>
  <div class="size-item">
    <input type="checkbox" :isChecked="isChecked" @change="onCheckedChange(isChecked)" />
    <label>{{ size.name }}</label>
    <PizzaPrice :price="priceAmount" :onPriceChange="handlePriceChange" :disabled="!isChecked" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import PizzaPrice from "../components/PizzaPrice.vue";
import { storeToRefs } from "pinia";
import { usePizzaStore } from "../stores/pizzaStore";

const pizzaStore = usePizzaStore();
const { prices } = storeToRefs(pizzaStore);
const isChecked = ref(true);

const props = defineProps({
  size: Object,
  pizza: Object,
});

const priceObj = prices.value.find((price) => {
  if (price.sizeId === props.size.id && price.pizzaId === props.pizza.id) {
    return price;
  }
});
const priceAmount = priceObj.price;

const handlePriceChange = (newPrice) => {
  pizzaStore.updatePrice(props.pizza, props.size, newPrice);
};

const onCheckedChange = (isChecked) => {
  isChecked = !isChecked;
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
