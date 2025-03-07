<template>
    <div class="mt-1 dsd-distributions">
      <distributions-header
        :getDistributionDescription="getDistributionDescription"
        :openModal="openModal"
        :getDistributionTitle="getDistributionTitle"
        :showDownloadUrls="showDownloadUrls"
        :isUrlInvalid="isUrlInvalid"
        :showPublisher="showPublisher"
        :embed="embed"
      />
      <div class="row">
        <ul class="list list-unstyled w-100">
          <div class="distributions" :key="`${expandedDistributions.length}--${expandedDistributionDescriptions.length}`">
            <distribution
                v-for="(distribution, index) in displayedDistributions"
                @selectForPreview="selectDistribution"
                :key="`${index}--${distribution.id}`"
                :distribution="distribution"
                :fading="!distributions.displayAll && !isDistributionsAllDisplayed && index === distributions.displayCount - 1"
                :distributions="distributions"
                :setDistributionsDisplayCount="setDistributionsDisplayCount"
                :getDistributionFormat="getDistributionFormat"
                :distributionFormatTruncated="distributionFormatTruncated"
                :getDistributionTitle="getDistributionTitle"
                :distributionVisibleContent="distributionVisibleContent"
                :distributionExpandedContent="distributionExpandedContent"
                :distributionDescriptionIsExpanded="distributionDescriptionIsExpanded"
                :distributionDescriptionIsExpandable="distributionDescriptionIsExpandable"
                :getDistributionDescription="getDistributionDescription"
                :distributionIsExpanded="distributionIsExpanded"
                :showObject="showObject"
                :showNumber="showNumber"
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
                :embed="embed"
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
      <download-as-modal />
      <!-- <distribution-visualization v-if="showDistibutionVisualisation" class="mb-4"></distribution-visualization> -->
      <distribution-visualisation-slot v-if="showDistibutionVisualisation" class="mb-4"></distribution-visualisation-slot>
    </div>
</template>

<script>

// import Distribution from './Distribution.vue';
import DownloadAllDistributions from "../../datasetDetails/distributions/DownloadAllDistributions";
import {has, isNil} from "lodash";
import {getTranslationFor} from "../../utils/helpers";
import { mapGetters } from "vuex";
import DownloadAsModal from "../../datasetDetails/distributions/DistributionDownloadAsModal";
// import DistributionVisualisation from "./distributionPreview/DistributionVisualisation.vue";

export default {
  name: 'Distributions',
  components: {
    DownloadAllDistributions,
    // Distribution,
    DownloadAsModal,
    // DistributionVisualisation,
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
    distributionVisibleContent: Array,
    distributionExpandedContent: Array,
    distributionDescriptionIsExpanded: Function,
    distributionDescriptionIsExpandable: Function,
    distributionIsExpanded: Function,
    showObject: Function,
    showNumber: Function,
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
    appendCurrentLocaleToURL: Function,
    showPublisher: Boolean,
    embed: Boolean,
  },
  data() {
    return {
      downloadAllTop: this.$env.content.datasetDetails.bulkDownload.buttonPosition === "top",
      // previewedDistributionTitle: this.getDistributionTitle(this.displayedDistributions[0]),
      showDistibutionVisualisation: this.$env.content.datasetDetails.distributions.showVisualisation,
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getLanguages',
      'getCatalog',
    ]),
  },
  methods: {
    getDistributionDescription(distribution) {
      return (has(distribution, 'description') && !isNil(distribution.description)) ? getTranslationFor(distribution.description, this.$route.query.locale, this.getLanguages) : '-';
    },
    selectDistribution(distribution) {
      this.previewedDistributionTitle = distribution;
    }
  },
  // created() {
  //   this.showDistibutionVisualisation = this.$env.content.datasetDetails.distributions.showVisualisation
  // }
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
