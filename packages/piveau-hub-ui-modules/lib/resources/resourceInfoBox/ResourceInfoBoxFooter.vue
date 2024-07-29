<template>
  <small class="d-flex justify-content-between align-items-center">
    <slot>
      <div class="d-flex flex-row">
        <div v-if="updatedDate" class="resource-info-box-footer-update-date d-flex flex-wrap mr-4">
            <tooltip class="font-weight-bold mr-1" :title="$t('message.tooltip.resourceDetails.updated')">
                {{ $t('message.metadata.updated') }}:
            </tooltip>
            <resource-date class="align-self-start" :date="updatedDate"></resource-date>
          </div>
          <div v-if="createdDate" class="resource-info-box-footer-create-date d-flex flex-wrap">
            <tooltip class="font-weight-bold mr-1" :title="$t('message.tooltip.resourceDetails.created')">
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

import Tooltip from "../../widgets/Tooltip.vue";

import ResourceDate from '../ResourceDate.vue';

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
  created() {},
});
</script>
