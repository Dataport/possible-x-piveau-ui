<template>
<div class="pv-badge badge">
  <slot>
    {{ value.label || value.id }}
  </slot>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { DistributionFormat } from '../types/global';

export default defineComponent({
  name: 'PvBadge',
  inheritAttrs: false,
  props: {
    value: {
      type: Object as PropType<DistributionFormat>,
      default: null,
    },
  },
});
</script>
