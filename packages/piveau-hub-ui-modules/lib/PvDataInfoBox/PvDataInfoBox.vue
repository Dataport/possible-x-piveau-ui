<template>
  <router-link
    :to="to"
    class="dataset-info-box text-dark text-decoration-none"
    :class="{'dataset-info-box--catalog': catalogMode}"
  >
    <slot name="header" v-if="!compact">
      <div class="dataset-info-box-header" data-cy="dataset-title">
        <h2 class="card-title m0">{{ datasetOrCatalogTitle }}</h2>
      </div>
    </slot>

    <!-- Body slot -->
    <slot name="body" :dataset="dataset">
      <div class="dataset-info-box-body">
        <div class="row">
          <div v-if="catalogMode && !compact" class="col-12 col-md-2">
            <img
              :src="src"
              alt="img"
              class="catalog-img border border-dark"
              :class="{'catalog-img--big': !compact}"
            />
          </div>
          <div
            class="dataset-info-box-description-container col-12 col-md"
            data-cy="dataset-description"
          >
            <slot name="header" v-if="compact">
              <div data-cy="dataset-title">
                <h2 class="card-title">{{ datasetOrCatalogTitle }}</h2>
              </div>
            </slot>

            <slot name="description">
              <pv-data-info-box-description
                v-if="!catalogMode || !compact"
                :class="'mb-3'"
                :description="dataset.description"
                :description-max-length="descriptionMaxLength"
                :truncate="descriptionMaxLength"
              />
            </slot>

            <slot name="after-description" />
          </div>
          <div
            v-if="dataset.formats && dataset.formats.length > 0"
            class="dataset-info-box-badge-container col-12 mb-3"
            :class="{ 'col-md-3': !compact }"
          >
            <slot name="right" :formats="dataset.formats">
              <PvDataInfoBoxFormats :formats="dataset.formats"></PvDataInfoBoxFormats>
            </slot>
          </div>
          <slot name="footer" :dataset="dataset" v-if="compact">
            <PvDataInfoBoxFooter
              class="col-12"
              :src="src"
              :createdDate="null"
              :updatedDate="null"
              :catalog="catalogMode ? dataset.description : dataset.catalog"
            />
            <!-- <div v-else class="dataset-info-box-footer" /> -->
          </slot>
        </div>
      </div>
    </slot>

    <!-- Footer slot -->
    <slot name="footer" :dataset="dataset" v-if="!compact">
      <PvDataInfoBoxFooter
        class="dataset-info-box-footer"
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
import { Dataset } from "../types/global";
import {defineComponent, PropType} from "vue";
import type RouteLocationRaw from "vue-router";

import PvBadge from "../PvBadge/PvBadge.vue";
import PvDataInfoBoxFooter from "./PvDataInfoBoxFooter.vue";
import PvDataInfoBoxDescription from "./PvDataInfoBoxDescription.vue";
import PvDataInfoBoxFormats from "./PvDataInfoBoxFormats.vue"

export default defineComponent({
  name: "PvDataInfoBox",
  inheritAttrs: false,
  components: {
    PvBadge,
    PvDataInfoBoxFooter,
    PvDataInfoBoxDescription,
    PvDataInfoBoxFormats,
  },
  props: {
    /**
     * The dataset to display.
     */
    dataset: {
      type: Object as PropType<Dataset>,
      default: () =>
        ({
          title: "",
          description: "",
          catalog: "",
          createdDate: "12.12.2023",
          updatedDate: "13.12.2023",
          formats: [],
        } as Dataset),
    },

    /**
     * The route to navigate to when clicking on the dataset.
     */
    to: {
      type: [Object, String] as PropType<RouteLocationRaw | string>,
      required: true,
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
      default: "",
    },

    /**
     * If true, swaps to catalog display mode
     */
    catalogMode: {
      type: Boolean,
      default: false,
    },

    /**
     * If true switches from two column to one column layout
     * and decreases vertical distancing between elements.
     */
    compact: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    datasetOrCatalogTitle(): string {
      const { dataset, catalogMode } = this;
      return catalogMode
        ? dataset.title || dataset.catalog || ""
        : dataset.title || "";
    },
  },
});
</script>
