<template>
  <pv-data-info-box
    v-bind="$props"
    compact
  />
</template>

<script>
import { defineComponent } from 'vue';
import { PvDataInfoBox } from '@piveau/piveau-hub-ui-modules';

export default defineComponent({
  name: 'ECDataInfoBox',
  props: ['dataset', 'to', 'descriptionMaxLength', 'src', 'catalogMode', 'compact'],
  components: {
    PvDataInfoBox,
  },
});
</script>
