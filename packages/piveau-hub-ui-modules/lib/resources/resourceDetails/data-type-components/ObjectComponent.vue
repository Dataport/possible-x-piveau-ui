<template>
    <div>
      <strong>{{ label }}:</strong>
      <div style="margin-left: 20px;">
        <DataRenderer
          v-for="(val, key) in value"
          :key="key"
          :label="key"
          :value="val"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import DataRenderer from '../DataRenderer.vue';
  
  const props = defineProps({
    label: String,
    value: Object
  });
  </script>
  
  <style scoped>
  
  </style>
  