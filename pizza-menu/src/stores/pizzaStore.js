import { defineStore } from "pinia";
import axios from "axios";
import { ref, watch } from "vue";

export const usePizzaStore = defineStore("pizzaStore", () => {
  const pizzas = ref([]);
  const sizes = ref([]);
  const prices = ref([]);

  async function fetchPizzaData() {
    try {
      const response = await axios.get("/data.json");
      pizzas.value = response.data.pizzas;
      prices.value = response.data.prices;
      sizes.value = response.data.sizes;
    } catch (error) {
      console.error("There was an error fetching the pizza data:", error);
    }
  }

  async function updatePrice(pizza, size, priceNumber) {
    console.log("price:", priceNumber);
    const priceObj = prices.value.find((price) => {
      if (price.sizeId === size.id && price.pizzaId === pizza.id) {
        return price;
      }
    });
    priceObj.price = priceNumber;
  }

  watch(prices, (newPrices) => {
    console.log("Prices have been updated:", newPrices);
  });

  return { pizzas, prices, sizes, fetchPizzaData, updatePrice };
});
