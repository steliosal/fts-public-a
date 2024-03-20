import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const usePizzaStore = defineStore("pizzaStore", () => {
  const pizzas = ref([]);

  async function fetchPizzaData() {
    try {
      const response = await axios.get("/data.json");
      const sizes = response.data.sizes; 

      pizzas.value = response.data.pizzas.map((pizza) => ({
        ...pizza,
        sizes: sizes.map((size) => {
          const priceEntry = response.data.prices.find((price) => price.pizzaId === pizza.id && price.sizeId === size.id);
          return {
            ...size,
            price: priceEntry ? priceEntry.price : null,
          };
        }),
      }));
    } catch (error) {
      console.error("There was an error fetching the pizza data:", error);
    }
  }

  return { pizzas, fetchPizzaData };
});
