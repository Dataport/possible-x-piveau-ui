<template>
<div class="format-badge badge" :type="format">{{ format }}</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { DistributionFormat } from 'types/global';

export default Vue.extend({
  name: 'PvBadge',
  props: {
    format: {
      type: Object as PropType<DistributionFormat>,
      default: 'default' as DistributionFormat,
    },
  },
});
</script>
