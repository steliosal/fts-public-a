<template>
  <div class="App">
    <h1>Pizza</h1>
    <div class="pizza-options">
      <PizzaItem title="Pepperoni" :isOpen="openedItems[0].isOpen" @toggle-open="onToggleOpen('pepperoni')" />
      <PizzaItem title="Margherita" :isOpen="openedItems[1].isOpen" @toggle-open="onToggleOpen('margherita')" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PizzaItem from "../components/PizzaItem.vue";

const openedItems = ref([
  {
    id: "pepperoni",
    isOpen: false,
  },
  { id: "margherita", isOpen: true },
]);

const onToggleOpen = (id) => {
  openedItems.value.forEach((item) => {
    if (item.id === id) {
      item.isOpen = !item.isOpen;
    } else {
      item.isOpen = false;
    }
  });
};
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
