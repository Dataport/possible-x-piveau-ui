<template>
  <div class="object-component">
    <strong>{{ label }}</strong>
    <div style="margin-left: 20px;">
      <ResourceDataRenderer
        v-for="(val, key) in value"
        :key="key"
        :label="key"
        :value="val"
      />
      <!-- <div style="margin-left: 20px;">
        <ResourceDataRenderer
        v-for="(val, key) in value"
        :key="key"
        :label="key"
        :value="val"
      />
      
  </div> -->
      <!-- <table> <ResourceDataRenderer
        v-for="(val, key) in value"
        :key="key"
      >
          <tr>{{ key }}</tr>
          <td>{{ val }}</td>
      </ResourceDataRenderer></table> -->


  </div>
  </div>
</template>

<script setup>
import ResourceDataRenderer from '../ResourceDataRenderer.vue';

const props = defineProps({
  label: String,
  value: Object
});
</script>

<style scoped>
  .object-component{
    
  border-bottom: 1px solid red;
  }
  .object-component span{
      background-color: transparent !important;
  }
</style>