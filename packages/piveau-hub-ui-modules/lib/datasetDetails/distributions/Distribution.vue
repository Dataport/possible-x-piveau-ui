<template>
  <div class="position-relative" @click="selectForPreview">
    <div class="mb-3 d-flex flex-row flex-wrap flex-md-nowrap distributions__item">
      <distribution-format
        :distribution="distribution"
        :getDistributionFormat="getDistributionFormat"
        :distributionFormatTruncated="distributionFormatTruncated"
        :embed="embed"
      />
      <distribution-details
        :getDistributionTitle="getDistributionTitle"
        :distribution="distribution"
        :distributions="distributions"
        :distributionDescriptionIsExpanded="distributionDescriptionIsExpanded"
        :getDistributionDescription="getDistributionDescription"
        :toggleDistributionDescription="toggleDistributionDescription"
        :distributionDescriptionIsExpandable="distributionDescriptionIsExpandable"
        :distributionVisibleContent="distributionVisibleContent"
        :distributionExpandedContent="distributionExpandedContent"
        :distributionIsExpanded="distributionIsExpanded"
        :showLicensingAssistant="showLicensingAssistant"
        :showLicence="showLicence"
        :filterDateFormatEU="filterDateFormatEU"
        :showArray="showArray"
        :showNumber="showNumber"
        :showObject="showObject"
        :showObjectArray="showObjectArray"
        :appendCurrentLocaleToURL="appendCurrentLocaleToURL"
        :toggleDistribution="toggleDistribution"
      />
      <distribution-added
        :date="updatedDate"
      />
      <distribution-actions
        :distribution="distribution"
        :distributions="distributions"
        :isUrlInvalid="isUrlInvalid"
        :getVisualisationLink="getVisualisationLink"
        :showTooltipVisualiseButton="showTooltipVisualiseButton"
        :previewLinkCallback="previewLinkCallback"
        :openIfValidUrl="openIfValidUrl"
        :showDownloadDropdown="showDownloadDropdown"
        :getDownloadUrl="getDownloadUrl"
        :showAccessUrls="showAccessUrls"
        :isOnlyOneUrl="isOnlyOneUrl"
        :trackGoto="trackGoto"
        :getDistributionFormat="getDistributionFormat"
        :replaceHttp="replaceHttp"
      />
    </div>
    <fading-distribution-overlay
      v-if="fading"
      :distributions="distributions"
      :setDistributionsDisplayCount="setDistributionsDisplayCount"
      :increaseNumDisplayedDistributions="increaseNumDisplayedDistributions"
      :nonOverflowingIncrementsForDistributions="nonOverflowingIncrementsForDistributions"
    />
  </div>
</template>

<script>
import {
  has,
  isNil
} from 'lodash';
import { truncate } from '../../utils/helpers';
import DistributionExpand from "./distributionDetails/DistributionExpand";
import DistributionVisibleContent
  from "./distributionDetails/DistributionVisibleContent";
import DistributionExpandedContent
  from "./distributionDetails/DistributionExpandedContent";
import DistributionDescription
  from "./distributionDetails/DistributionDescription";
import DistributionFormat from "./DistributionFormat";
import FadingDistributionOverlay
  from "./FadingDistributionOverlay";
import DistributionActions from "./distributionActions/DistributionActions";
import DistributionAdded from "./DistributionAdded";

export default {
  name: 'Distribution',
  components: {
    DistributionAdded,
    DistributionActions,
    FadingDistributionOverlay,
    DistributionFormat,
    DistributionDescription,
    DistributionExpandedContent,
    DistributionVisibleContent,
    DistributionExpand
  },
  props: {
    fading: Boolean,
    distribution: Object,
    distributions: Object,
    setDistributionsDisplayCount: Function,
    openModal: Function,
    getDistributionFormat: Function,
    distributionFormatTruncated: Function,
    getDistributionTitle: Function,
    distributionVisibleContent: Array,
    distributionExpandedContent: Array,
    distributionDescriptionIsExpanded: Function,
    distributionDescriptionIsExpandable: Function,
    getDistributionDescription: Function,
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
    embed: Boolean,
  },
  computed: {
    updatedDate() {
       if (this.has(this.distribution, 'modificationDate') && !this.isNil(this.distribution.modificationDate)) {
        return this.filterDateFormatEU(this.distribution.modificationDate);
      } else {
        return this.filterDateFormatEU(this.distribution.releaseDate);
      }
    }
  },
  methods: {
    has,
    isNil,
    truncate,
    selectForPreview(){
      this.$emit('selectForPreview', this.getDistributionTitle(this.distribution))
    }
  }
};
</script>


<style lang="scss" scoped>

.text-break {
  word-break: break-word;
}

td {
  padding-left: 0 !important;
  padding-top: 1% !important;
  padding-bottom: 1% !important;
}

/*** BOOTSTRAP ***/
button:focus {
  outline:0;
}
.options, .download {
  .dropdown-menu {
    .dropdown-item {
      &:hover {
        color: initial;
        background-color: initial;
      }
    }
  }
}

.material-icons.small-icon {
  font-size: 20px;
}

.distributions__item {
  //position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}


</style>
