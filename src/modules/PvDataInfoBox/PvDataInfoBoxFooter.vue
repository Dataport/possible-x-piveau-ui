<template>
  <small class="dataset-info-box-footer d-flex justify-content-between align-items-center">
    <slot>
      <div class="d-flex flex-row">
          <div v-if="createdDate" class="d-flex flex-wrap mr-1">
            <tooltip
              :title="$t('message.tooltip.datasetDetails.created')"
              class="font-weight-bold mr-1"
            >
                {{ $t('message.metadata.created') }}:
            </tooltip>
            <dataset-date class="align-self-start" :date="createdDate"/>
          </div>
          <div v-if="updatedDate" class="d-flex flex-wrap">
            <tooltip
              :title="$t('message.tooltip.datasetDetails.updated')"
              class="font-weight-bold mr-1"
            >
                {{ $t('message.metadata.updated') }}:
            </tooltip>
            <dataset-date class="align-self-start" :date="updatedDate"/>
          </div>
      </div>
      <div class="d-flex flex-wrap align-items-center">
        <img
          class="border border-dark mr-1"
          width="30"
          :src="src"
          :alt="catalog">
        <span> {{ catalog }} </span>
      </div>
    </slot>
  </small>
</template>

<script lang="ts">
import Vue from 'vue';

import DatasetDate from '../datasets/DatasetDate.vue';
import Tooltip from "../widgets/Tooltip.vue";

export default Vue.extend({
  name: 'PvDataInfoBoxFooter',
  components: {
    DatasetDate,
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

    catalog: {
      type: String,
      required: true,
    },

    /**
     * Image source for the catalog logo/flag.
     */
    src: {
      type: String,
      default: '',
    },
  },
});
</script>
