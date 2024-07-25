<template>
  <small class="d-flex justify-content-between align-items-center">
    <slot>
      <div class="d-flex flex-row">
        <div v-if="updatedDate" class="dataset-info-box-footer-update-date d-flex flex-wrap mr-4">
            <tooltip class="font-weight-bold mr-1" :title="$t('message.tooltip.datasetDetails.updated')">
                {{ $t('message.metadata.updated') }}:
            </tooltip>
            <resource-date class="align-self-start" :date="updatedDate"></resource-date>
          </div>
          <div v-if="createdDate" class="dataset-info-box-footer-create-date d-flex flex-wrap">
            <tooltip class="font-weight-bold mr-1" :title="$t('message.tooltip.datasetDetails.created')">
                {{ $t('message.metadata.created') }}:
            </tooltip>
            <resource-date class="align-self-start" :date="createdDate"></resource-date>
          </div>
      </div>
    </slot>
  </small>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ResourceDate from '../ResourceDate.vue';
import Tooltip from "../../widgets/Tooltip.vue";

export default defineComponent({
  name: 'ResourceInfoBoxFooter',
  components: {
    ResourceDate,
    Tooltip,
  },
  props: {
    createdDate: {
      type: String,
      default: null,
    },
    updatedDate: {
      type: String,
      default: null,
    },
  },
  created() {
    console.log(this.updatedDate)
  }
});
</script>
