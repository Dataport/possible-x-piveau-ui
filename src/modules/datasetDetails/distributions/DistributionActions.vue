<template>
  <div class="col-12 col-md-3 col-lg-5 mt-2 text-md-right text-left">
    <distribution-options-dropdown
      v-if="showOptionsDropdown(distribution)"
      :showTooltipVisualiseButton="showTooltipVisualiseButton"
      :isUrlInvalid="isUrlInvalid"
      :getVisualisationLink="getVisualisationLink"
      :distribution="distribution"
      :openIfValidUrl="openIfValidUrl"
      :previewLinkCallback="previewLinkCallback"
      :showVisualisationLink="showVisualisationLink"
      :getGeoLink="getGeoLink"
      :showGeoLink="showGeoLink"
      class="distribution-actions"
    />
    <distribution-download
      v-if="showDownloadDropdown(distribution)"
      :getDownloadUrl="getDownloadUrl"
      :showAccessUrls="showAccessUrls"
      :isOnlyOneUrl="isOnlyOneUrl"
      :trackGoto="trackGoto"
      :getDistributionFormat="getDistributionFormat"
      :replaceHttp="replaceHttp"
      :distribution="distribution"
      class="distribution-actions"
    />
    <linked-data-buttons-dropdown
      :distributions="distributions"
      :distribution="distribution"
      class="distribution-actions"
    />
  </div>
</template>

<script>
import DistributionOptionsDropdown
  from "@/modules/datasetDetails/distributions/DistributionOptionsDropdown";
import DistributionDownload from "@/modules/datasetDetails/distributions/DistributionDownload";
import LinkedDataButtonsDropdown
  from "@/modules/datasetDetails/distributions/LinkedDataButtonsDropdown";
export default {
  name: "DistributionActions",
  components: {LinkedDataButtonsDropdown, DistributionDownload, DistributionOptionsDropdown},
  props: {
    distribution: Object,
    distributions: Object,
    showOptionsDropdown: Function,
    isUrlInvalid: Function,
    getVisualisationLink: Function,
    showTooltipVisualiseButton: Function,
    previewLinkCallback: Function,
    showVisualisationLink: Function,
    openIfValidUrl: Function,
    getGeoLink: Function,
    showGeoLink: Function,
    showDownloadDropdown: Function,
    getDownloadUrl: Function,
    showAccessUrls: Function,
    isOnlyOneUrl: Function,
    trackGoto: Function,
    getDistributionFormat: Function,
    replaceHttp: Function
  }
}
</script>

<style scoped>

</style>
