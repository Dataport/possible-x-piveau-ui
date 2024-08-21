<template>
    <div v-for="(value, key) in resourceDetailsData" :key="key">
        <ResourceDataRenderer 
            :label="key" 
            :value="value" 
            v-show="value !== null && key !== 'id' && key !== 'name' && key !== 'description'">
        </ResourceDataRenderer>
    </div>
</template>
  
<script setup>
import ResourceDataRenderer from './ResourceDataRenderer.vue';

const props = defineProps({
  resourceDetailsData: Object,
});
</script>
