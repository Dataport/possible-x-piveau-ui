<template>
    <div class="mt-1">
      <div class="row">
        <div class="col-12 col-lg-11 offset-lg-1 d-flex justify-content-between align-items-center">
          <h2 :title="$t('message.tooltip.datasetDetails.distribution')"
              data-toggle="tooltip"
              data-placement="top"
              data-cy="dataset-distributions">
            {{ $t('message.metadata.distributions') }} ({{ getDistributions ? getDistributions.length.toLocaleString('fi') : 0 }})
          </h2>
          <download-all-distributions
            :getDistributions="getDistributions"
            :getDistributionDescription="getDistributionDescription"
            :openModal="openModal"
            :getDistributionTitle="getDistributionTitle"
            :showDownloadUrls="showDownloadUrls"
            :getCatalog="getCatalog"
            :isUrlInvalid="isUrlInvalid"
          />
        </div>
        <ul class="list list-unstyled col-12">
          <hr>
          <div class="distributions" :key="`${expandedDistributions.length}--${expandedDistributionDescriptions.length}`">
            <distribution
                v-for="(distribution, index) in displayedDistributions"
                :key="`${index}--${distribution.id}`"
                :distribution="distribution"
                :fading="!distributions.displayAll && !isDistributionsAllDisplayed && index === distributions.displayCount - 1"
                :getDistributions="getDistributions"
                :distributions="distributions"
                :setDistributionsDisplayCount="setDistributionsDisplayCount"
                :getDistributionFormat="getDistributionFormat"
                :distributionFormatTruncated="distributionFormatTruncated"
                :getDistributionTitle="getDistributionTitle"
                :distributionDescriptionIsExpanded="distributionDescriptionIsExpanded"
                :distributionDescriptionIsExpandable="distributionDescriptionIsExpandable"
                :getDistributionDescription="getDistributionDescription"
                :distributionIsExpanded="distributionIsExpanded"
                :showObject="showObject"
                :showNumber="showNumber"
                :distributionCanShowMore="distributionCanShowMore"
                :showOptionsDropdown="showOptionsDropdown"
                :showDownloadDropdown="showDownloadDropdown"
                :showLicence="showLicence"
                :showLicensingAssistant="showLicensingAssistant"
                :filterDateFormatEU="filterDateFormatEU"
                :showArray="showArray"
                :showObjectArray="showObjectArray"
                :showVisualisationLink="showVisualisationLink"
                :getVisualisationLink="getVisualisationLink"
                :showGeoLink="showGeoLink"
                :isOnlyOneUrl="isOnlyOneUrl"
                :getDownloadUrl="getDownloadUrl"
                :trackGoto="trackGoto"
                :showAccessUrls="showAccessUrls"
                :replaceHttp="replaceHttp"
                :previewLinkCallback="previewLinkCallback"
                :toggleDistribution="toggleDistribution"
                :setClipboard="setClipboard"
                :getGeoLink="getGeoLink"
                :toggleDistributionDescription="toggleDistributionDescription"
                :increaseNumDisplayedDistributions="increaseNumDisplayedDistributions"
                :nonOverflowingIncrementsForDistributions="nonOverflowingIncrementsForDistributions"
                :isUrlInvalid="isUrlInvalid"
                :openIfValidUrl="openIfValidUrl"
                :showTooltipVisualiseButton="showTooltipVisualiseButton"
                :appendCurrentLocaleToURL="appendCurrentLocaleToURL"
            />
          </div>
        </ul>
      </div>
    </div>
</template>

<script>

import Distribution from './Distribution.vue';
import AppLink from '../../widgets/AppLink.vue';
import Tooltip from '../../widgets/Tooltip.vue';
import Dropdown from '../../widgets/Dropdown.vue';
import DropdownDownload from './DistributionDropdownDownload.vue';
import ResourceDetailsLinkedDataButton from '../../widgets/ResourceDetailsLinkedDataButton.vue';
import DownloadAllDistributions
  from "../../datasetDetails/distributions/DownloadAllDistributions";

export default {
  name: 'Distributions',
  components: {
    DownloadAllDistributions,
    Distribution,
    Tooltip,
    Dropdown,
    AppLink,
    DropdownDownload,
    ResourceDetailsLinkedDataButton
  },
  props: {
    openModal: Function,
    getDistributions: Array,
    getCatalog: Object,
    expandedDistributions: Array,
    expandedDistributionDescriptions: Array,
    displayedDistributions: Array,
    distributions: Object,
    setDistributionsDisplayCount: Function,
    isDistributionsAllDisplayed: Boolean,
    pages: Object,
    showDownloadUrls: Function,
    getDistributionFormat: Function,
    distributionFormatTruncated: Function,
    getDistributionTitle: Function,
    distributionDescriptionIsExpanded: Function,
    distributionDescriptionIsExpandable: Function,
    getDistributionDescription: Function,
    distributionIsExpanded: Function,
    showObject: Function,
    showNumber: Function,
    distributionCanShowMore: Function,
    showOptionsDropdown: Function,
    showDownloadDropdown: Function,
    showLicence: Function,
    showLicensingAssistant: Function,
    filterDateFormatEU: Function,
    showArray: Function,
    showObjectArray: Function,
    showVisualisationLink: Function,
    getVisualisationLink: Function,
    showGeoLink: Function,
    isOnlyOneUrl: Function,
    getDownloadUrl: Function,
    trackGoto: Function,
    showAccessUrls: Function,
    replaceHttp: Function,
    previewLinkCallback: Function,
    toggleDistribution: Function,
    setClipboard: Function,
    getGeoLink: Function,
    toggleDistributionDescription: Function,
    increaseNumDisplayedDistributions: Function,
    nonOverflowingIncrementsForDistributions: Function,
    isUrlInvalid: Function,
    openIfValidUrl: Function,
    showTooltipVisualiseButton: Function,
    appendCurrentLocaleToURL: Function
  }
};
</script>

<style lang="scss" scoped>

  .catalogue-label {
    white-space: pre-line;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .tag-color {
    background-color: var(--tag-color);
  }
  .subjectBg {
    background-color: #196fd2;
  }
  .btn-color {
     &:hover {
       background-color: #196fd2;
       border-color: #196fd2;
     }
  }

  .heading, .arrow, .copy-text {
    cursor: pointer;
  }

  .download-all-btn {
    min-width: 100px;
    height: 31px;
  }

  /*** BOOTSTRAP ***/
  button:focus {
    outline:0;
  }

.spinner-grow {
  width: 20px;
  height: 20px;
}

  /*** FONT AWESOME ICONS ***/
  .fa-check-square {
    color: #28a745;
    width: 16px;
    height: 16px;
  }

  /*** MATERIAL ICONS ***/
  %modal-icon {
    font-size: 18px;
    cursor: default;
  }

  .help-icon {
    @extend %modal-icon;
  }

  .check-icon {
    @extend %modal-icon;
    color: #28a745;
  }

  .material-icons.small-icon {
    font-size: 20px;
  }

  .mt-4 {
    margin-top: 1.5rem !important;
  }

  .keywords {

    &__item {
      position: relative;
    }

    &__actions {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 100%;
      z-index: 11;
    }
  }
  .sectionList {
    list-style-type: '→ ';
    margin-left:6.5%;
  }
  @media only screen and (max-width: 991px) {
  .sectionList {
    margin-left: 0;
  }
}
</style>
