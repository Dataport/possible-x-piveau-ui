<template>
  <div>
    <template v-for="(resource, index) in computedResources">
      <slot :resource="resource" :raw-resource="resources[index]" :index="index">
        <resource-info-box
          :key="resource.id"
          :to="`/resource/${rawSelectedResource}/${resource.id}`"
          :resource="resource"
          class="mt-3"
        ></resource-info-box>
      </slot>
    </template>
  </div>
</template>
  

<script lang="ts" setup>
import { useResourceInfoBox } from './useResourceInfoBox';

import resourceInfoBox from './ResourceInfoBox.vue';

const props = defineProps(['resources', 'rawSelectedResource']);

const computedResources = useResourceInfoBox({ 
  resources: props.resources,
});
</script>