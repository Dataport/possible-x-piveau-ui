<template>
  <div class="position-relative d-inline-block ml-1 mb-1">
    <a @click.prevent="openIfValidUrl(!isUrlInvalid(getVisualisationLink(distribution)), previewLinkCallback, distribution, $event)"  :class="{ disabled: isUrlInvalid(getVisualisationLink(distribution)) }" ref="previewLink" class="d-flex justify-content-between btn btn-sm btn-primary p-0 pl-2 pr-2 w-100 rounded-lg btn-color dropdown-button"
        :href="getVisualisationLink(distribution)"
        target="_blank"
        v-if="showVisualisationLink(distribution)">
          {{ $t('message.datasetDetails.preview') }}
    </a>
    <a @click="$emit('track-link', getGeoLink, 'link')"
        :href="getGeoLink"
        target="_blank"
        v-else-if="showGeoLink(distribution)"
        class="d-flex justify-content-between btn btn-sm btn-primary p-0 pl-2 pr-2 w-100 rounded-lg btn-color dropdown-button">
          {{ $t('message.datasetDetails.preview') }}
    </a>
    <span v-else class="d-flex justify-content-between btn btn-sm p-0 pl-2 pr-2 w-100 rounded-lg btn-color dropdown-button text-opacity-0">{{ $t('message.datasetDetails.preview') }}</span>
  </div>
</template>
<script>
import AppLink from "../../../widgets/AppLink";
import {has, isNil} from "lodash";
import {mapGetters} from "vuex";

export default {
  name: "DistributionPreview",
  components: {
    AppLink,
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
      },
      geoLink: this.$env?.datasetDetails?.distributions?.geoLink,
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getCatalog',
      'getID'
    ]),
    getGeoLink() {
      const format = this.distribution.format.label;
      let f = format.toLowerCase();
      // Use correct Case Sensitive strings
      f = this.geoLinkFormats[f];
      if (this.geoLink) {
        const geoLinkVariables = {
          catalog: this.getCatalog.id,
          dataset: this.getID,
          distribution: this.distribution.id,
          type: f,
          lang: this.$route.query.locale,
          accessUrl: this.distribution?.accessUrl[0],
        }
        // Inject variables into geo link
        for (let linkVariable in geoLinkVariables) {
          this.geoLink = this.geoLink.replace(`{${linkVariable}}`, geoLinkVariables[linkVariable]);
        }
        // Return Geo Visualisation Link
        return this.geoLink;
        // return `/geo-viewer/?dataset=${distributionID}&type=${f}&lang=${this.$route.query.locale}`;
      }
      // Return default Geo Visualisation Link if no link in user-config provided
      return `/geo-viewer/?catalog=${this.getCatalog.id}&dataset=${this.getID}&distribution=${this.distribution.id}&type=${f}&lang=${this.$route.query.locale}`;
    }
  },
  methods: {
    showOptionsDropdown(distribution) {
      return this.showVisualisationLink(distribution) || this.showGeoLink(distribution);
    },
    showGeoLink(distribution) {
      if (!has(distribution, 'format.label') || isNil(distribution.format.label) || !has(distribution, 'id') || isNil(distribution.id) || !has(distribution, 'accessUrl[0]')) return false;
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
    pointer-events: none;
    text-decoration: none;
    color: gray;
  }
  .text-opacity-0 {
    opacity: 0;
    cursor: default!important;
  }
</style>
