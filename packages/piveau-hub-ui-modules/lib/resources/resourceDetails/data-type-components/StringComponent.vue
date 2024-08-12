<template>
    <span>
      <strong>{{ label }}:</strong> {{ value }}
    </span>
  </template>
  
  <script setup>
  const props = defineProps({
    label: String,
    value: String
  });
  </script>
  
  <style scoped>

  </style>
  