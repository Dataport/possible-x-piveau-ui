<template>
  <div class="renderer-wrapper">
    <component
      :is="loadComponent(selectedResource)"
      :key="selectedResource"
      :selected-resource="selectedResource"
      :resource-details-data="resourceDetailsData"
      :copy-to-clipboard="copyToClipboard"
    />
  </div>
</template>

<script setup>
import { resolveComponent } from 'vue';

const props = defineProps({
  selectedResource: {
    type: String,
    required: true,
  },
  resourceDetailsData: {
    type: Object,
    required: true,
  },
  copyToClipboard: {
    type: Function,
    required: false,
  },
});

const loadComponent = (resource) => {
  const componentName = resource.replace(/(^\w|_\w)/g, (match) =>
    match.replace('_', '').toUpperCase()
  );

  return resolveComponent(componentName);
};
</script>

<style scoped>
/* No pop-up styles needed */
</style>
