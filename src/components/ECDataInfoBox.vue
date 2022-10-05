<template>
  <pv-data-info-box
    v-bind="$props"
    compact
  />
</template>

<script lang="ts">
import Vue from 'vue';
import PvDataInfoBox from '@/modules/PvDataInfoBox/PvDataInfoBox.vue';

export default Vue.extend({
  name: 'ECDataInfoBox',
  props: ['dataset', 'to', 'descriptionMaxLength', 'src', 'catalogMode', 'compact'],
  components: {
    PvDataInfoBox,
  },
})

</script>