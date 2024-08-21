<template>
  <div>
    <component
      :is="resolvedComponent"
      :label="label"
      :value="value"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import StringComponent from './data-type-components/StringComponent.vue';
import ArrayComponent from './data-type-components/ArrayComponent.vue';
import ObjectComponent from './data-type-components/ObjectComponent.vue';

const props = defineProps({
  label: String,
  value: [String, Object, Array]
});

const getType = (value) => {
  if (Array.isArray(value)) return 'ArrayComponent';
  if (typeof value === 'object' && value !== null) return 'ObjectComponent';
  return 'StringComponent';
};

const resolvedComponent = computed(() => {
  const type = getType(props.value);
  return {
    StringComponent,
    ArrayComponent,
    ObjectComponent
  }[type];
});
</script>