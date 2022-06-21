<template>
<router-link :to="to" class="dataset-info-box text-dark text-decoration-none">
  <slot name="header">
    <div
      class="dataset-info-box-header"
      data-cy="dataset-title"
    >
      <h2>{{ datasetOrCatalogTitle }}</h2>
    </div>
  </slot>

  <!-- Body slot -->
  <!-- todo: implement max description length cutoff (either by js or css) -->
  <slot name="body">
    <div class="dataset-info-box-body">
      <div class="row">
        <div v-if="catalogMode" class="col-12 col-md-2">
          <img
            :src="src"
            alt="img"
            class="catalog-img catalog-img--big border border-dark"
          >
        </div>
        <div
          class="dataset-info-box-description col-12 col-md"
          data-cy="dataset-description"
        >
          <slot name="description">
            <p v-if="dataset.description">
              {{ descriptionMaxLength
                ? truncate(dataset.description, descriptionMaxLength)
                : dataset.description
              }}
            </p>
            <span v-else>
              No description available.
            </span>
          </slot>
        </div>
        <div
          v-if="dataset.formats && dataset.formats.length > 0"
          class="col-12 col-md-3"
        >
            <PvBadge
              v-for="(format, i) in dataset.formats.slice(0, 10)"
              :key="`badge@${i}`"
              class="mr-1"
              :format="format"
              data-toggle="tooltip"
              data-placement="top"
              :title="$t('message.tooltip.datasetDetails.format')"
            >
              {{ format.label || format.id || 'UNKNOWN' }}
            </PvBadge>
          <span v-if="dataset.formats.length >= 10">...</span>
        </div>
      </div>
    </div>
  </slot>

  <!-- Footer slot -->
  <slot name="footer" :dataset="dataset">
    <PvDataInfoBoxFooter
      v-if="!catalogMode"
      :src="src"
      :createdDate="dataset.createdDate"
      :updatedDate="dataset.updatedDate"
      :catalog="dataset.catalog"
    />
    <div v-else class="dataset-info-box-footer" />
  </slot>
</router-link>
</template>

<script lang="ts">
import { Dataset } from 'types/global';
import Vue, { PropType } from 'vue';
import type RouteLocationRaw from 'vue-router';

import PvBadge from '../PvBadge/PvBadge.vue';
import PvDataInfoBoxFooter from './PvDataInfoBoxFooter.vue';

import { truncate } from '../utils/helpers';

export default Vue.extend({
  name: 'PvDataInfoBox',
  components: {
    PvBadge,
    PvDataInfoBoxFooter,
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
        createdDate: '12.12.2021',
        updatedDate: '13.12.2021',
        formats: [],
      } as Dataset),
    },

    /**
     * The route to navigate to when clicking on the dataset.
     */
    to: {
      type: [Object, String] as PropType<RouteLocationRaw | string>,
      required: true
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

  computed: {
    datasetOrCatalogTitle() {
      const { dataset, catalogMode } = this;
      return catalogMode
        ? dataset.title || dataset.catalog || ''
        : dataset.title || ''
    }
  },

  methods: {
    truncate,
  },
});
</script>
