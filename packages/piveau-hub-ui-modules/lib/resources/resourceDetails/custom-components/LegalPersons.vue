<template>
    <div>
     {{ resourceDetailsData.id }}
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    resourceDetailsData: Object,
  });

  </script>
  