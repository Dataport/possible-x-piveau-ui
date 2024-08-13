<template>
    <div class="object-component">
      <strong>{{ label }}</strong>
      <div style="margin-left: 20px;">
        <DataRenderer
          v-for="(val, key) in value"
          :key="key"
          :label="key"
          :value="val"
        />
        <!-- <div style="margin-left: 20px;">
         <DataRenderer
          v-for="(val, key) in value"
          :key="key"
          :label="key"
          :value="val"
        />
       
    </div> -->
        <!-- <table> <DataRenderer
          v-for="(val, key) in value"
          :key="key"
        >
            <tr>{{ key }}</tr>
            <td>{{ val }}</td>
        </DataRenderer></table> -->
 

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
    .object-component{
     
    
    }
    .object-component span{
        background-color: transparent !important;
    }
  </style>
  