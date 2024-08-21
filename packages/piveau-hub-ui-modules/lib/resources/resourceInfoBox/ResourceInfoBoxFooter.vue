<template>
  <small class="d-flex justify-content-between align-items-center">
    <slot name="footer">
      <div class="d-flex flex-row py-2">
        <div v-if="props.updatedDate" class="resource-info-box-footer-update-date d-flex flex-wrap mr-4">
            <tooltip class="font-weight-bold mr-1" :title="$t('message.tooltip.resourceDetails.updated')">
                {{ $t('message.metadata.updated') }}:
            </tooltip>
            <resource-date class="align-self-start" :date="props.updatedDate"></resource-date>
          </div>
          <div v-if="props.createdDate" class="resource-info-box-footer-create-date d-flex flex-wrap">
            <tooltip class="font-weight-bold mr-1" :title="$t('message.tooltip.resourceDetails.created')">
                {{ $t('message.metadata.created') }}:
            </tooltip>
            <resource-date class="align-self-start" :date="props.createdDate"></resource-date>
          </div>
      </div>
    </slot>
  </small>
</template>

<script lang="ts" setup>
import Tooltip from "../../widgets/Tooltip.vue";
import ResourceDate from '../ResourceDate.vue';

const props = defineProps({
  createdDate: {
    type: String,
    default: null,
  },
  updatedDate: {
    type: String,
    default: null,
  },
});
</script>