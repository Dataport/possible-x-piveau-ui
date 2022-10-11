<template>
  <div class="mb-3 d-flex flex-row flex-wrap flex-md-nowrap distributions__item">
    <distribution-format
      :distribution="distribution"
      :getDistributionFormat="getDistributionFormat"
      :distributionFormatTruncated="distributionFormatTruncated"
    />
    <distribution-details
      :getDistributionTitle="getDistributionTitle"
      :distribution="distribution"
      :distributions="distributions"
      :distributionDescriptionIsExpanded="distributionDescriptionIsExpanded"
      :getDistributionDescription="getDistributionDescription"
      :toggleDistributionDescription="toggleDistributionDescription"
      :distributionDescriptionIsExpandable="distributionDescriptionIsExpandable"
      :distributionIsExpanded="distributionIsExpanded"
      :showLicensingAssistant="showLicensingAssistant"
      :showLicence="showLicence"
      :filterDateFormatEU="filterDateFormatEU"
      :showArray="showArray"
      :showNumber="showNumber"
      :showObject="showObject"
      :showObjectArray="showObjectArray"
      :appendCurrentLocaleToURL="appendCurrentLocaleToURL"
      :distributionCanShowMore="distributionCanShowMore"
      :toggleDistribution="toggleDistribution"
    />
    <distribution-added
      :date="addedDate"
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
<!--      </div>-->
<!--    </div>-->
<!--    <fading-distribution-overlay-->
<!--      v-if="fading"-->
<!--      :distributions="distributions"-->
<!--      :setDistributionsDisplayCount="setDistributionsDisplayCount"-->
<!--      :increaseNumDisplayedDistributions="increaseNumDisplayedDistributions"-->
<!--      :nonOverflowingIncrementsForDistributions="nonOverflowingIncrementsForDistributions"-->
<!--    />-->
<!--    <hr class="mt-1">-->
<!--  </div>-->
</template>

<script>
import {
  has,
  isNil
} from 'lodash';
import { truncate } from '../../utils/helpers';
import DistributionExpand from "@/modules/datasetDetails/distributions/distributionDetails/DistributionExpand";
import DistributionVisibleContent
  from "@/modules/datasetDetails/distributions/distributionDetails/DistributionVisibleContent";
import DistributionExpandedContent
  from "@/modules/datasetDetails/distributions/distributionDetails/DistributionExpandedContent";
import DistributionDescription
  from "@/modules/datasetDetails/distributions/distributionDetails/DistributionDescription";
import DistributionFormat from "@/modules/datasetDetails/distributions/DistributionFormat";
import FadingDistributionOverlay
  from "@/modules/datasetDetails/distributions/FadingDistributionOverlay";
import DistributionActions from "@/modules/datasetDetails/distributions/distributionActions/DistributionActions";
import DistributionAdded from "@/modules/datasetDetails/distributions/DistributionAdded";

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
    distributionDescriptionIsExpanded: Function,
    distributionDescriptionIsExpandable: Function,
    getDistributionDescription: Function,
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
    appendCurrentLocaleToURL: Function,
  },
  computed: {
    addedDate() {
      if (has(this.distribution, 'releaseDate') && !isNil(this.distribution.releaseDate)) {
        return this.filterDateFormatEU(this.distribution.releaseDate);
      }
      return "";
    }
  },
  methods: {
    has,
    isNil,
    truncate
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
