<template>
<router-link :to="to" class="dataset-info-box text-dark text-decoration-none">
  <slot name="header">
    <div class="dataset-info-box-header">
      <h2>{{ dataset.title }}</h2>
    </div>
  </slot>

  <!-- Body slot -->
  <!-- todo: implement max description length cutoff (either by js or css) -->
  <slot name="body">
    <div class="dataset-info-box-body">
      <div class="row">
        <div v-if="false" class="col-12 col-md-2">
        </div>
        <div v-if="catalog" class="col-12 col-md-2">
          <img
            :src="src"
            width="200"
            alt="img"
            class="catalog-img catalog-img--big border border-dark"
          >
        </div>
        <div class="col-12 col-md">
          <slot>
            <template v-if="dataset.description">
              {{ dataset.description }}
            </template>
            <span v-else>
              No description available.
            </span>
          </slot>
        </div>
        <div class="col-12 col-md-3">
          <div class="d-flex flex-col flex-wrap">
            <PvBadge
              v-for="(format, i) in dataset.formats"
              :key="i"
              class="mr-1 mb-1"
              :format="format"
            />
          </div>
        </div>
      </div>
    </div>
  </slot>

  <!-- Footer slot -->
  <!-- todo: de-hardcode modified and created date -->
  <!-- todo: add tooltip functionality along with invalid date detection -->
  <slot name="footer" :dataset="dataset">
    <small class="dataset-info-box-footer d-flex justify-content-between align-items-center">
      <div class="d-flex flex-row">
          <div class="mr-1">
            <span class="font-weight-bold">Created: </span>
            <span>12.12.2021</span>
          </div>
          <div>
            <span class="font-weight-bold">Updated: </span>
            <span>12.12.2021</span>
          </div>
      </div>
      <div class="d-flex align-items-center">
        <img
          class="border border-dark mr-1"
          width="30"
          :src="src"
          :alt="dataset.catalog">
        <span>data.gov.uk</span>
      </div>
    </small>
  </slot>
</router-link>
</template>

<script lang="ts">
import { Dataset } from 'types/global';
import Vue, { PropType } from 'vue';
import type RouteLocationRaw from 'vue-router';

import PvBadge from '../PvBadge/PvBadge.vue';

export default Vue.extend({
  name: 'PvDataInfoBox',
  components: {
    PvBadge,
  },
  props: {

    /**
     * The dataset to display.
     */
    dataset: {
      type: Object as PropType<Dataset>,
      default: () => ({
        title: '',
        description: '',
        catalog: '',
        formats: [],
      } as Dataset),
    },

    /**
     * The route to navigate to when clicking on the dataset.
     */
    to: {
      type: Object as PropType<RouteLocationRaw> | string as PropType<string>,
    },

    /**
     * Specified the maximum length of the description before it is cut off.
     */
    descriptionMaxLength: {
      type: Number,
      default: 200,
    },

    /**
     * Image source for the catalog logo/flag.
     */
    src: {
      type: String,
      default: '',
    },

    /**
     * If true, swaps to catalog display mode
     */
    catalogMode: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
