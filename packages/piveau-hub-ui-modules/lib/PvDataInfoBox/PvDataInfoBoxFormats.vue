<template>
  <div class="dataset-formats">
    <slot name="formats" :formats="formats">
      <PvBadge
        v-for="(format, i) in formats.slice(0, 10)"
        :key="`badge@${i}`"
        class="mr-1 format-badge"
        :value="format"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        :type="format.id"
        :title="$t('message.tooltip.datasetDetails.format')"
      >
        {{ format.label || format.id || "UNKNOWN" }}
      </PvBadge>
      <span v-if="formats.length >= 10">...</span>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import PvBadge from "../PvBadge/PvBadge.vue";

export default defineComponent({
  inheritAttrs: false,
  components: {
    PvBadge,
  },
  props: {
    formats: {
      type: Array as PropType<Array<any>>,
      required: true,
    },
  },
});
</script>

<style scoped>
</style>
