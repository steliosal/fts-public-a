<template>
  <!-- Container for an individual pizza item -->
  <div :class="`expand-box ${isOpen ? 'expand-box-open' : ''}`">
    <!-- Clickable Header to toggle open/close state -->
    <div class="expand-box-header" @click="onToggleOpen">
      <div class="expand-box-header-icon">
        <AngleIcon :isOpen="isOpen" />
      </div>
      <div class="expand-box-header-title">{{ pizza.name }}</div>
    </div>
    <div ref="contentRef" class="expand-area" :style="{ height: isOpen ? contentHeight : '0' }">
      <!-- Expandable content here -->
      <div class="expand-box-content">
        <div class="expand-box-content-data">
          <!-- List of pizza sizes for this item -->
          <PizzaSize v-for="size in sizes" :key="size.id" :size="size" :pizza="pizza" />
        </div>
        <div class="expand-box-content-controls">
          <!-- Undo button to revert changes -->
          <button v-if="isAlteredPizzaPrices(pizza)" @click="undoChanges" class="undo-button"><UndoIcon /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import AngleIcon from "../components/AngleIcon.vue";
import UndoIcon from "../components/UndoIcon.vue";
import PizzaSize from "../components/PizzaSize.vue";
import { storeToRefs } from "pinia";
import { usePizzaStore } from "../stores/pizzaStore";

// Access the store
const pizzaStore = usePizzaStore();
const { sizes } = storeToRefs(pizzaStore);
const { isAlteredPizzaPrices } = pizzaStore;

// Define props
const props = defineProps({
  pizza: Object,
  isOpen: Boolean,
});

// Emit the toggle-open event
const emit = defineEmits(["toggle-open"]);

const onToggleOpen = () => {
  emit("toggle-open");
};

// Ref for the content area
const contentRef = ref(null);
let contentHeight = "0";

// Adjust the content height based on the isOpen state
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && contentRef.value) {
      contentHeight = `${contentRef.value.scrollHeight}px`;
    } else {
      contentHeight = "0";
    }
  },
  { immediate: true }
);

// Adjust the content height on mount
onMounted(() => {
  if (props.isOpen && contentRef.value) {
    contentHeight = `${contentRef.value.scrollHeight}px`;
  }
});

// Revert any changes made to the pizza's prices
const undoChanges = () => {
  pizzaStore.undoPizzaPrices(props.pizza);
  pizzaStore.resetSelectedPrices(props.pizza);
};
</script>

<style scoped>
.expand-box {
  display: block;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.expand-box.expand-box-open {
  background-color: #e2f0f8;
  box-shadow: none;
}

.expand-box-header {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  user-select: none;
}

.expand-box-header-icon {
  flex: 0 0 35px;
  width: 25px;
  height: 25px;
  padding: 0 7px;
  transform: rotate(90deg);
  transition: transform 0.3s ease;
  transform-origin: 50% 50%;
  fill: currentColor;
  stroke: transparent;
  transition: transform 0.3s ease-in-out;
}

.expand-box-header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.expand-box-header-icon > svg {
  display: block;
  width: 100%;
  height: 100%;
}

.expand-box-header-title {
  flex: 1;
  display: block;
  text-align: left;
  padding: 10px 10px 10px 0;
}

.expand-box-content {
  display: flex;

  justify-content: space-between;

  padding: 20px;
}

.expand-box-content-controls {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-end;
}

.expand-box-content-data {
  display: flex;
}

.expand-area {
  display: block;
  width: 100%;
  overflow: hidden;
  height: 0;
  transition: height 0.3s ease-in-out;
}

.undo-button {
  border: 2px solid #7ca2b7;
  background-color: white;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}
</style>
