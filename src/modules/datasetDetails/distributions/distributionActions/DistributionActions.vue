<template>
  <div class="d-flex flex-sm-row flex-md-column flex-lg-row justify-content-start
    justify-content-lg-end mt-2 text-md-right col text-left distribution-actions">
    <distribution-options-dropdown
      :showTooltipVisualiseButton="showTooltipVisualiseButton"
      :isUrlInvalid="isUrlInvalid"
      :getVisualisationLink="getVisualisationLink"
      :distribution="distribution"
      :openIfValidUrl="openIfValidUrl"
      :previewLinkCallback="previewLinkCallback"
      class="distribution-action"
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
      class="distribution-action"
    />
    <linked-data-buttons-dropdown
      :distributions="distributions"
      :distribution="distribution"
      class="distribution-action"
    />
    <app-link v-if="showValidateButton" class="btn-sm pt-0" :to="{ name: 'DatasetDetailsQuality', query: { locale: $route.query.locale, validate: distribution.id }}">
        Validate
    </app-link>
  </div>
</template>

<script>
import AppLink from "@/modules/widgets/AppLink";
import DistributionOptionsDropdown
  from "@/modules/datasetDetails/distributions/distributionActions/DistributionOptionsDropdown";
import DistributionDownload from "@/modules/datasetDetails/distributions/distributionActions/DistributionDownload";
import LinkedDataButtonsDropdown
  from "@/modules/datasetDetails/distributions/distributionActions/LinkedDataButtonsDropdown";
export default {
  name: "DistributionActions",
  components: {AppLink, LinkedDataButtonsDropdown, DistributionDownload, DistributionOptionsDropdown},
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
    replaceHttp: Function,
  },
  computed: {
    showValidateButton() {
      return this.$env?.datasetDetails?.distributions?.showValidationButton;
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
