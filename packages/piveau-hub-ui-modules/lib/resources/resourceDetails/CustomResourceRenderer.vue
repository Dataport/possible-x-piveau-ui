<template>
    <div>
      <component
        :is="loadComponent(resource)"
        :key="resource"
        :resourceDetailsData="resourceDetailsData"
        :resource="resource"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { defineAsyncComponent } from 'vue';
  

  const props = defineProps({
    resource: {
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
  
    return defineAsyncComponent(() =>
      import(`./custom-components/${componentName}.vue`).catch(() => {
        console.error(`Component ${componentName}.vue not found.`);
        return null;
      })
    );
  };
  </script>
  