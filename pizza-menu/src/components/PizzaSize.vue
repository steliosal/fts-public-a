<template>
  <div class="size-selector">
    <div v-for="size in sizes" :key="size.sizeId" class="size-item" @click.stop>
      <input type="checkbox" :id="`enable-${size.name}`" v-model="size.enabled" />
      <label :for="`enable-${size.name}`">{{ size.name }}</label>
      <div class="input-icon-container">
        <div class="dollar-icon">$</div>
        <input type="number" v-model="size.price" :disabled="!size.enabled" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  sizes: {
    type: Array,
    default: () => [],
  },
});

const sizes = computed(() =>
  props.sizes.map((size) => ({
    ...size,
    enabled: true,
  }))
);
</script>

<style scoped>
.size-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.size-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.size-item label,
.size-item input[type="checkbox"] {
  margin-bottom: 5px; 
}

.input-icon-container {
  display: flex;
  align-items: center; 
}

.dollar-icon {
  background-color: blue;
  color: white;
  padding: 0 5px; 
  border-radius: 4px; 
  margin-right: 5px; 
  display: flex;
  align-items: center; 
  justify-content: center; 
}
</style>
