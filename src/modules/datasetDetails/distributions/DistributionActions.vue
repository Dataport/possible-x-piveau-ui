<template>
  <div class="d-flex flex-sm-row flex-md-column flex-lg-row justify-content-start justify-content-lg-end mt-2 text-md-right col text-left">
    <distribution-options-dropdown
      :showTooltipVisualiseButton="showTooltipVisualiseButton"
      :isUrlInvalid="isUrlInvalid"
      :getVisualisationLink="getVisualisationLink"
      :distribution="distribution"
      :openIfValidUrl="openIfValidUrl"
      :previewLinkCallback="previewLinkCallback"
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
import {has, isNil} from "lodash";
export default {
  name: "DistributionActions",
  components: {LinkedDataButtonsDropdown, DistributionDownload, DistributionOptionsDropdown},
  props: {
    distribution: Object,
    distributions: Object,
    isUrlInvalid: Function,
    getVisualisationLink: Function,
    showTooltipVisualiseButton: Function,
    previewLinkCallback: Function,
    openIfValidUrl: Function,
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
