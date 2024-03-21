import { defineStore } from "pinia";
import axios from "axios";
import { ref, watch, computed } from "vue";

export const usePizzaStore = defineStore("pizzaStore", () => {
  const pizzas = ref([]);
  const sizes = ref([]);
  const prices = ref([]);
  const initialPrices = ref([]);

  async function fetchPizzaData() {
    try {
      const response = await axios.get("/data.json");
      pizzas.value = response.data.pizzas;
      sizes.value = response.data.sizes;

      // Store a deep copy of the initial prices
      initialPrices.value = response.data.prices;
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

  // const isAlteredData = computed(() => {
  //   if (JSON.stringify(prices.value) !== JSON.stringify(initialPrices.value)) {
  //     return true;
  //   }
  // });

  function isAlteredPizzaPrices(pizza) {
    let isAltered = false;
    prices.value.forEach((price) => {
      if (price.pizzaId === pizza.id) {
        const originalPrice = initialPrices.value.find((p) => p.id === price.id);
        if (price.price !== originalPrice.price) {
          isAltered = true;
        }
      }
    });
    return isAltered;
  }

  function undoPizzaPrices(pizza) {
    console.log("Undoing prices for pizza:", pizza);
    console.log("prices:", prices.value);
    prices.value.forEach((price) => {
      if (price.pizzaId === pizza.id) {
        console.log("price:", price);
        const originalPrice = initialPrices.value.find((p) => p.id === price.id);
        console.log("originalPrice:", originalPrice);
        price.price = originalPrice.price;
      }
    });

    // Update localStorage with the reverted prices
    localStorage.setItem("prices", JSON.stringify(prices.value));
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

  return { pizzas, sizes, prices, isAlteredPizzaPrices, fetchPizzaData, updatePrice, undoPizzaPrices };
});
