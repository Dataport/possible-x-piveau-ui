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
              :path="getGeoLink"
              target="_blank"
              @click="$emit('track-link', getGeoLink, 'link')"
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
import {mapGetters} from "vuex";

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
  }
</style>
