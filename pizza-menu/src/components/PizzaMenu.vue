<template>
  <!-- Display the list of pizzas -->
  <div class="App">
    <h3>Pizza</h3>
    <div class="pizza-options">
      <!-- Display PizzaItem component for each pizza -->
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

// Access the store
const pizzaStore = usePizzaStore();
const { pizzas } = storeToRefs(pizzaStore);
const { fetchPizzaData } = pizzaStore;

const openedItems = ref([]);

// Fetch pizza data and initialize openedItems
onMounted(async () => {
  await fetchPizzaData();
  openedItems.value = pizzas.value.map((pizza) => ({
    id: pizza.id,
    isOpen: false,
  }));
});

// Toggle the open state of the pizza item
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
  text-align: left;
  font-family: sans-serif;
  color: black;
}

.pizza-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
</style>
