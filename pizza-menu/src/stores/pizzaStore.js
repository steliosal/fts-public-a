import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const usePizzaStore = defineStore("pizzaStore", () => {
  const pizzas = ref([]);
  const sizes = ref([]);
  const prices = ref([]);
  const initialPrices = ref([]);
  const selectedPrices = ref([]);

  // Fetch pizza data from a local JSON file or API endpoint
  async function fetchPizzaData() {
    try {
      const response = await axios.get("/data.json");
      pizzas.value = response.data.pizzas;
      sizes.value = response.data.sizes;

      // Store a deep copy of the initial prices
      initialPrices.value = response.data.prices;

      // Check if there are stored prices in localStorage
      const storedPrices = localStorage.getItem("prices");
      if (storedPrices) {
        prices.value = JSON.parse(storedPrices);
      } else {
        // No stored prices, use the ones from the fetched data
        prices.value = response.data.prices;
      }
      // Initialize selectedPrices based on current prices
      selectedPrices.value = prices.value.map((price) => price.id);
    } catch (error) {
      console.error("There was an error fetching the pizza data:", error);
    }
  }

  // Check if prices for a pizza have been altered from their initial value
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

  // Undo prices for a pizza to their initial values
  function undoPizzaPrices(pizza) {
    prices.value.forEach((price) => {
      if (price.pizzaId === pizza.id) {
        const originalPrice = initialPrices.value.find((p) => p.id === price.id);
        price.price = originalPrice.price;
      }
    });

    // Save prices in localStorage
    localStorage.setItem("prices", JSON.stringify(prices.value));
  }

  // Reset selected prices for a pizza to their initial values
  function resetSelectedPrices(pizza) {
    const allPizzaPrices = prices.value.filter((price) => price.pizzaId === pizza.id);
    allPizzaPrices.forEach((price) => {
      const isIncluded = selectedPrices.value.includes(price.id);
      if (!isIncluded) {
        selectedPrices.value.push(price.id);
      }
    });
  }

  // Find the price object for a specific pizza and size
  function getPrice(pizza, size) {
    const priceObj = prices.value.find((price) => price.sizeId === size.id && price.pizzaId === pizza.id);
    return priceObj;
  }

  // Update the price for a specific pizza and size
  async function updatePrice(pizza, size, priceNumber) {
    // console.log("price:", priceNumber);
    const priceObj = prices.value.find((price) => price.sizeId === size.id && price.pizzaId === pizza.id);
    if (priceObj) {
      priceObj.price = priceNumber;
      // Convert the prices array to a string and save in localStorage
      localStorage.setItem("prices", JSON.stringify(prices.value));
    }
  }

  // Check if a price is selected
  function getIsSelectedPrice(pizza, size) {
    const price = getPrice(pizza, size);
    return selectedPrices.value.includes(price.id);
  }

  // Toggle a price as selected or unselected
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
