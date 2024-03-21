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
      sizes.value = response.data.sizes;
      // prices.value = response.data.prices;

      const storedPrices = localStorage.getItem("prices");
      if (storedPrices) {
        // Parse the stored string back into an array and use it
        prices.value = JSON.parse(storedPrices);
      } else {
        // No stored prices, use the ones from the fetched data
        prices.value = response.data.prices;
      }
    } catch (error) {
      console.error("There was an error fetching the pizza data:", error);
    }
  }

  // async function updatePrice(pizza, size, priceNumber) {
  //   console.log("price:", priceNumber);
  //   const priceObj = prices.value.find((price) => {
  //     if (price.sizeId === size.id && price.pizzaId === pizza.id) {
  //       return price;
  //     }
  //   });
  //   priceObj.price = priceNumber;
  // }

  async function updatePrice(pizza, size, priceNumber) {
    console.log("price:", priceNumber);
    const priceObj = prices.value.find((price) => price.sizeId === size.id && price.pizzaId === pizza.id);
    if (priceObj) {
      priceObj.price = priceNumber;
      // Convert the prices array to a string and save in localStorage
      localStorage.setItem("prices", JSON.stringify(prices.value));
    }
  }

  watch(prices, (newPrices) => {
    console.log("Prices have been updated:", newPrices);
  });

  return { pizzas, prices, sizes, fetchPizzaData, updatePrice };
});
