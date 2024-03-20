import { onMounted, ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const usePizzaStore = defineStore("pizzaStore", () => {
  const items = ref([]);
  const itemPrices = ref([]);
  const itemSizes = ref([]);

  onMounted(() => {
    console.log("pizzaStore onMounted");
    fetchPizzaData();
  });

  async function fetchPizzaData() {
    try {
      console.log("fetching pizza data...");
      const response = await axios.get("/data.json");
      console.log("response:", response);
      items.value = response.data.items;
      itemPrices.value = response.data.itemPrices;
      itemSizes.value = response.data.itemSizes;
    } catch (error) {
      console.error("There was an error fetching the pizza data:", error);
    }
  }

  return { items, itemPrices, itemSizes, fetchPizzaData };
});
