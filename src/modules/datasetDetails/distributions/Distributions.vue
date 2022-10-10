<template>
    <div class="mt-1 dsd-distributions">
      <div class="row">
        <distributions-header
          :getDistributionDescription="getDistributionDescription"
          :openModal="openModal"
          :getDistributionTitle="getDistributionTitle"
          :showDownloadUrls="showDownloadUrls"
          :isUrlInvalid="isUrlInvalid"
        />
        <ul class="list list-unstyled w-100">
          <hr>
          <div class="distributions" :key="`${expandedDistributions.length}--${expandedDistributionDescriptions.length}`">
            <distribution
                v-for="(distribution, index) in displayedDistributions"
                :key="`${index}--${distribution.id}`"
                :distribution="distribution"
                :fading="!distributions.displayAll && !isDistributionsAllDisplayed && index === distributions.displayCount - 1"
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
                :showDownloadDropdown="showDownloadDropdown"
                :showLicence="showLicence"
                :showLicensingAssistant="showLicensingAssistant"
                :filterDateFormatEU="filterDateFormatEU"
                :showArray="showArray"
                :showObjectArray="showObjectArray"
                :getVisualisationLink="getVisualisationLink"
                :isOnlyOneUrl="isOnlyOneUrl"
                :getDownloadUrl="getDownloadUrl"
                :trackGoto="trackGoto"
                :showAccessUrls="showAccessUrls"
                :replaceHttp="replaceHttp"
                :previewLinkCallback="previewLinkCallback"
                :toggleDistribution="toggleDistribution"
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
        <div class="w-100 d-flex flex-row justify-content-end">
          <download-all-distributions
            v-if="!downloadAllTop"
            :getDistributionDescription="getDistributionDescription"
            :openModal="openModal"
            :getDistributionTitle="getDistributionTitle"
            :showDownloadUrls="showDownloadUrls"
            :isUrlInvalid="isUrlInvalid"
          />
        </div>
      </div>
    </div>
</template>

<script>

import Distribution from './Distribution.vue';
import DownloadAllDistributions
  from "../../datasetDetails/distributions/DownloadAllDistributions";
import {has, isNil} from "lodash";
import {getTranslationFor} from "@/modules/utils/helpers";
import { mapGetters } from "vuex";

export default {
  name: 'Distributions',
  components: {
    DownloadAllDistributions,
    Distribution
  },
  props: {
    openModal: Function,
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
    distributionIsExpanded: Function,
    showObject: Function,
    showNumber: Function,
    distributionCanShowMore: Function,
    showDownloadDropdown: Function,
    showLicence: Function,
    showLicensingAssistant: Function,
    filterDateFormatEU: Function,
    showArray: Function,
    showObjectArray: Function,
    getVisualisationLink: Function,
    isOnlyOneUrl: Function,
    getDownloadUrl: Function,
    trackGoto: Function,
    showAccessUrls: Function,
    replaceHttp: Function,
    previewLinkCallback: Function,
    toggleDistribution: Function,
    toggleDistributionDescription: Function,
    increaseNumDisplayedDistributions: Function,
    nonOverflowingIncrementsForDistributions: Function,
    isUrlInvalid: Function,
    openIfValidUrl: Function,
    showTooltipVisualiseButton: Function,
    appendCurrentLocaleToURL: Function
  },
  data() {
    return {
      downloadAllTop: this.$env.datasetDetails.bulkDownload.buttonPosition === "top"
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getLanguages',
      'getCatalog',
    ])
  },
  methods: {
    getDistributionDescription(distribution) {
      return (has(distribution, 'description') && !isNil(distribution.description)) ? getTranslationFor(distribution.description, this.$route.query.locale, this.getLanguages) : '-';
    }
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
