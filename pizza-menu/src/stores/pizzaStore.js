import { defineStore } from "pinia";
import axios from "axios";
import { ref, watch, computed } from "vue";

export const usePizzaStore = defineStore("pizzaStore", () => {
  const pizzas = ref([]);
  const sizes = ref([]);
  const prices = ref([]);
  const initialPrices = ref([]);
  const selectedPrices = ref([]);

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
      selectedPrices.value = prices.value.map((price) => price.id);
      console.log(selectedPrices.value);
    } catch (error) {
      console.error("There was an error fetching the pizza data:", error);
    }
  }

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

  function resetSelectedPrices(pizza) {
    const allPizzaPrices = prices.value.filter((price) => price.pizzaId === pizza.id);
    allPizzaPrices.forEach((price) => {
      const isIncluded = selectedPrices.value.includes(price.id);
      if (!isIncluded) {
        selectedPrices.value.push(price.id);
      }
    });
  }

  function getPrice(pizza, size) {
    // Find the price object that matches the pizza and size
    const priceObj = prices.value.find((price) => price.sizeId === size.id && price.pizzaId === pizza.id);
    return priceObj;
  }

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

  function getIsSelectedPrice(pizza, size) {
    const price = getPrice(pizza, size);
    return selectedPrices.value.includes(price.id);
  }

  function toggleSelectedPrice(pizza, size) {
    const price = getPrice(pizza, size);
    const isIdSelected = selectedPrices.value.includes(price.id);
    if (isIdSelected) {
      // remove from selectedPrices
      selectedPrices.value = selectedPrices.value.filter((id) => id !== price.id);
    } else {
      // add to selectedPrices
      selectedPrices.value.push(price.id);
    }
  }

  return {
    pizzas,
    sizes,
    prices,
    getIsSelectedPrice,
    toggleSelectedPrice,
    isAlteredPizzaPrices,
    getPrice,
    fetchPizzaData,
    updatePrice,
    undoPizzaPrices,
    resetSelectedPrices,
  };
});
