<template>
  <div class="d-flex flex-sm-row flex-md-column flex-lg-row justify-content-start
    justify-content-lg-end mt-2 text-md-right col text-left distribution-actions">
    <distribution-preview v-if="!hidePreviewButton" :isUrlInvalid="isUrlInvalid"
      :getVisualisationLink="getVisualisationLink" :distribution="distribution" :openIfValidUrl="openIfValidUrl"
      :previewLinkCallback="previewLinkCallback" class="distribution-action" />
    <distribution-download v-if="showDownloadDropdown(distribution)" :getDownloadUrl="getDownloadUrl"
      :showAccessUrls="showAccessUrls" :isOnlyOneUrl="isOnlyOneUrl" :trackGoto="trackGoto"
      :getDistributionFormat="getDistributionFormat" :replaceHttp="replaceHttp" :distribution="distribution"
      class="distribution-action" />
    <linked-data-buttons-dropdown :distributions="distributions" :distribution="distribution"
      class="distribution-action" />
    <div>
      <app-link v-if="showValidateButton" class="btn-sm validate-btn pt-0"
        :to="{ name: 'DatasetDetailsQuality', query: { locale: $route.query.locale, validate: distribution.id } }">
        Validate 
      </app-link>
    </div>
  </div>
</template>

<script>
import AppLink from "../../../widgets/AppLink";
import DistributionPreview from "../../../datasetDetails/distributions/distributionActions/DistributionPreview";
import DistributionDownload from "../../../datasetDetails/distributions/distributionActions/DistributionDownload";
import LinkedDataButtonsDropdown
  from "../../../datasetDetails/distributions/distributionActions/LinkedDataButtonsDropdown";
export default {
  name: "DistributionActions",
  components: { AppLink, LinkedDataButtonsDropdown, DistributionDownload, DistributionPreview },
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
      return this.$env?.content?.datasetDetails?.distributions?.showValidationButton;
    },
    hidePreviewButton() {
      // only returns true if the config variable hidePreviewButton exists and is set to true
      return this.$env?.content?.datasetDetails?.distributions?.hidePreviewButton;
    }
  }
}
</script>

<style lang="scss" scoped>
.validate-btn {
  color: #0e47cb;
  vertical-align: text-bottom;
  text-decoration: none;
}
</style>
