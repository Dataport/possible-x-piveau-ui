<template>
  <div>
    <component
      :is="loadComponent(selectedResource)"
      :key="selectedResource"
      :selected-resource="selectedResource"
      :resource-details-data="resourceDetailsData"
    />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import { getCurrentInstance } from 'vue';
import { resolveComponent } from 'vue';

const props = defineProps({
  selectedResource: {
    type: String,
    required: true,
  },
  resourceDetailsData: {
      type:Object,
      required:true
  }
});

const loadComponent = (resource) => {
  const componentName = resource.replace(/(^\w|_\w)/g, (match) =>
    match.replace('_', '').toUpperCase()
  );

  return resolveComponent(componentName);
};
</script>