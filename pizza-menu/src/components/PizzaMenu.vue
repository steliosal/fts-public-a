<template>
  <div class="App">
    <h3>Pizza</h3>
    <div class="pizza-options">
      <PizzaItem
        v-for="(pizza, index) in pizzas"
        :key="pizza.id"
        :pizza="pizza"
        :isOpen="openedItems[index]?.isOpen"
        @toggle-open="() => onToggleOpen(pizza.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, onMounted } from "vue";
import { usePizzaStore } from "../stores/pizzaStore";
import PizzaItem from "../components/PizzaItem.vue";

// Accessing the store
const pizzaStore = usePizzaStore();
const { pizzas} = storeToRefs(pizzaStore);
const { fetchPizzaData } = pizzaStore;

const openedItems = ref([]);

onMounted(async () => {
  await fetchPizzaData();
  openedItems.value = pizzas.value.map((pizza) => ({
    id: pizza.id,
    isOpen: false,
  }));
});

function onToggleOpen(id) {
  openedItems.value = openedItems.value.map((item) => ({
    ...item,
    isOpen: item.id === id ? !item.isOpen : false,
  }));
}
</script>

<style scoped>
.App {
  display: block;
  width: 100%;
  text-align: left;
  font-family: sans-serif;
  color: black;
}

.pizza-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 50vw;
}
</style>
