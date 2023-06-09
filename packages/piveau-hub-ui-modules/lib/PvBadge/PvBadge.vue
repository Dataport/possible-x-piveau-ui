<template>
<div class="pv-badge badge">
  <slot>
    {{ value.label || value.id }}
  </slot>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import type { PropType } from 'vue';
import type { DistributionFormat } from '../types/global';

export default Vue.extend({
  name: 'PvBadge',
  props: {
    value: {
      type: Object as PropType<DistributionFormat>,
      default: null,
    },
  },
});
</script>
