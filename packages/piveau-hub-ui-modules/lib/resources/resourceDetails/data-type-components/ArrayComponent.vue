<template>
    <div>
      <strong>{{ label }}:</strong>
      <ul class="array-ul">
        <li class="array-list" v-for="(item, index) in value" :key="index">
          <DataRenderer :label="'Array Item ' + (index + 1)" :value="item" />
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import DataRenderer from '../DataRenderer.vue';
  
  const props = defineProps({
    label: String,
    value: Array
  });
  </script>
  
  <style scss>
  
  </style>
  