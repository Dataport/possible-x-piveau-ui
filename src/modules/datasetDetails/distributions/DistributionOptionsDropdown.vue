<template>
  <dropdown
             :title="$t('message.tooltip.datasetDetails.distributions.options')"
             :message="$t('message.datasetDetails.options')"
             bgLight="true"
             v-if="showOptionsDropdown(distribution)"
  >
    <span data-toggle="tooltip" data-placement="top" :title="showTooltipVisualiseButton(isUrlInvalid(getVisualisationLink(distribution)))">
      <a @click.prevent="openIfValidUrl(!isUrlInvalid(getVisualisationLink(distribution)), previewLinkCallback, distribution, $event)"  :class="{ disabled: isUrlInvalid(getVisualisationLink(distribution)) }" ref="previewLink" class="dropdown-item px-3 d-flex justify-content-end align-items-center"
         :href="getVisualisationLink(distribution)"
         target="_blank"
         v-if="showVisualisationLink(distribution)">
        <button role="button" class="border-0 bg-transparent button" :disabled="isUrlInvalid(getVisualisationLink(distribution))" >
          <small class="px-2">{{ $t('message.datasetDetails.preview') }}</small>
          <i class="material-icons align-bottom">bar_chart</i>
        </button>
      </a>
    </span>
    <app-link class="dropdown-item px-3 d-flex justify-content-end align-items-center"
              :path="getGeoLink(distribution.format.label, distribution.id)"
              target="_blank"
              @click="$emit('track-link', getGeoLink(distribution.format.label, distribution.id), 'link')"
              v-if="showGeoLink(distribution)">
      <small class="px-2">{{ $t('message.datasetDetails.geoVisualisation') }}</small>
      <i class="material-icons float-right align-bottom">public</i>
    </app-link>
  </dropdown>
</template>

<script>
import Dropdown from "@/modules/widgets/Dropdown";
import AppLink from "@/modules/widgets/AppLink";
import {has, isNil} from "lodash";

export default {
  name: "DistributionOptionsDropdown",
  components: {
    Dropdown,
    AppLink
  },
  props: [
    'showTooltipVisualiseButton',
    'isUrlInvalid',
    'getVisualisationLink',
    'distribution',
    'openIfValidUrl',
    'previewLinkCallback'
  ],
  data() {
    return {
      visualisationLinkFormats: [
        'csv',
        'xlsx',
        'xls',
      ],
      geoLinkFormats: {
        wms: 'WMS',
        geojson: 'GeoJSON',
        fiware_cb: 'fiware_cb',
        'fiware-cb': 'fiware_cb',
      }
    };
  },
  methods: {
    getGeoLink(format, distributionID) {
      let f = format.toLowerCase();
      // Use correct Case Sensitive strings
      f = this.geoLinkFormats[f];
      // Return Geo Visualisation Link
      return `/geo-viewer/?dataset=${distributionID}&type=${f}&lang=${this.$route.query.locale}`;
    },
    showOptionsDropdown(distribution) {
      return this.showVisualisationLink(distribution) || this.showGeoLink(distribution);
    },
    showGeoLink(distribution) {
      if (!has(distribution, 'format.label') || isNil(distribution.format.label) || !has(distribution, 'id') || isNil(distribution.id)) return false;
      const f = distribution.format.label.toLowerCase();
      return Object.keys(this.geoLinkFormats).includes(f);
    },
    showVisualisationLink(distribution) {
      if (!has(distribution, 'format.label') || isNil(distribution?.format?.label)
        || (isNil(distribution?.downloadUrls[0]) && isNil(distribution?.accessUrl[0]))) return false;
      const f = distribution?.format?.id?.toLowerCase();
      return f && this.visualisationLinkFormats.includes(f);
    }
  }
}
</script>

<style scoped lang="scss">
  .disabled {
    cursor: not-allowed;
  }
</style>
