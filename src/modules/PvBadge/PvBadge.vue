<template>
<div class="pv-badge badge" :type="format.id">
  <slot>
    {{ format.label || format.id }}
  </slot>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DistributionFormat } from 'types/global';

export default Vue.extend({
  name: 'PvBadge',
  props: {
    format: {
      type: Object as PropType<DistributionFormat>,
      default: null,
    },
  },
});
</script>
