<template>
  <div :class="`expand-box ${isOpen ? 'expand-box-open' : ''}`" @click="onToggleOpen">
    <div class="expand-box-header">
      <div class="expand-box-header-icon">
        <AngleIcon :isOpen="isOpen" />
      </div>
      <div class="expand-box-header-title">{{ title }}</div>
    </div>
    <div ref="contentRef" class="expand-area" :style="{ height: isOpen ? contentHeight : '0' }">
      <!-- Expandable content here -->
      <div class="expand-box-content">
        <div class="expand-box-content-data">
          <PizzaSize :sizes="pizzaSizes" />
        </div>
        <div class="expand-box-content-controls">
          <button>Revert</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, onMounted } from "vue";
import AngleIcon from "../components/AngleIcon.vue";
import PizzaSize from "../components/PizzaSize.vue";
import { usePizzaStore } from "../stores/pizzaStore";

const pizzaStore = usePizzaStore();

const props = defineProps({
  title: String,
  isOpen: Boolean,
});

const emit = defineEmits(["toggle-open"]);

const onToggleOpen = () => {
  emit("toggle-open");
};

const contentRef = ref(null);
let contentHeight = "0";


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

onMounted(() => {
  if (props.isOpen && contentRef.value) {
    contentHeight = `${contentRef.value.scrollHeight}px`;
  }
});

const pizzaSizes = ref([
  { sizeId: 1, name: "Small", price: 5, enabled: false },
  { sizeId: 2, name: "Medium", price: 7, enabled: false },
  { sizeId: 3, name: "Large", price: 9, enabled: false },
]);
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
  flex-flow: row nowrap;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
  padding: 10px;
}

.expand-box-content-controls {
  flex: 0 0 100px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: flex-end;
}

.expand-box-content-data {
  flex: 1;
}

.expand-area {
  display: block;
  width: 100%;
  overflow: hidden;
  height: 0;
  transition: height 0.3s ease-in-out;
}
</style>
