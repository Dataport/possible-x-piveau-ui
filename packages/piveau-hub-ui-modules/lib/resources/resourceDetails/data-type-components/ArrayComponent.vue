<template>
    <div>
      <strong>{{ label }}:</strong>
      <ul class="array-ul">
        <li class="array-list" st v-for="(item, index) in value" :key="index">
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
  
  <style>
    li span{
    background-color: yellow;
    padding: .3rem;
    border-radius: .5rem;
  }
  </style>
  