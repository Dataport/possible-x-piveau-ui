<template>
    <div>
      <strong>{{ label }}:</strong> {{ value }}
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    label: String,
    value: String
  });
  </script>
  
  <style scoped>

  </style>
  