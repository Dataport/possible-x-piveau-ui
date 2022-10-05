<template>
  <div class="distributions__item">
    <div class="row">
      <distribution-format
        :distribution="distribution"
        :getDistributionFormat="getDistributionFormat"
        :distributionFormatTruncated="distributionFormatTruncated"
      />
      <div class="col-10 col-md-11">
        <div class="row">
          <!-- DISTRIBUTION TITLE -->
          <span class="d-inline-block col-12">
            <h3 class="m-0 text-break">{{ getDistributionTitle(distribution) }}</h3>
          </span>
          <div class="d-inline-block col-12 col-md-9 col-lg-7">
            <distribution-description
              :distribution="distribution"
              :distributions="distributions"
              :distributionDescriptionIsExpanded="distributionDescriptionIsExpanded"
              :getDistributionDescription="getDistributionDescription"
              :toggleDistributionDescription="toggleDistributionDescription"
              :distributionDescriptionIsExpandable="distributionDescriptionIsExpandable"
            />
            <distribution-expanded-content
              :distribution="distribution"
              :distributionIsExpanded="distributionIsExpanded"
              :showLicensingAssistant="showLicensingAssistant"
              :showLicence="showLicence"
              :filterDateFormatEU="filterDateFormatEU"
              :showArray="showArray"
              :showNumber="showNumber"
              :showObject="showObject"
              :showObjectArray="showObjectArray"
              :appendCurrentLocaleToURL="appendCurrentLocaleToURL"
            />
            <distribution-visible-content
              :distribution="distribution"
              :distributionIsExpanded="distributionIsExpanded"
              :showObject="showObject"
              :showLicence="showLicence"
              :showLicensingAssistant="showLicensingAssistant"
              :filterDateFormatEU="filterDateFormatEU"
            />
            <distribution-expand
              :distribution="distribution"
              :distributionCanShowMore="distributionCanShowMore"
              :toggleDistribution="toggleDistribution"
              :distributionIsExpanded="distributionIsExpanded"
            />
          </div>
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
      </div>
    </div>
    <fading-distribution-overlay
      v-if="fading"
      :distributions="distributions"
      :setDistributionsDisplayCount="setDistributionsDisplayCount"
      :increaseNumDisplayedDistributions="increaseNumDisplayedDistributions"
      :nonOverflowingIncrementsForDistributions="nonOverflowingIncrementsForDistributions"
    />
    <hr class="mt-1">
  </div>
</template>

<script>
import {
  has,
  isNil
} from 'lodash';
import { truncate } from '../../utils/helpers';
import DistributionExpand from "@/modules/datasetDetails/distributions/DistributionExpand";
import DistributionVisibleContent
  from "@/modules/datasetDetails/distributions/DistributionVisibleContent";
import DistributionExpandedContent
  from "@/modules/datasetDetails/distributions/DistributionExpandedContent";
import DistributionDescription
  from "@/modules/datasetDetails/distributions/DistributionDescription";
import DistributionFormat from "@/modules/datasetDetails/distributions/DistributionFormat";
import FadingDistributionOverlay
  from "@/modules/datasetDetails/distributions/FadingDistributionOverlay";
import DistributionActions from "@/modules/datasetDetails/distributions/DistributionActions";

export default {
  name: 'Distribution',
  components: {
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
  position: relative;
}

.mt-4 {
  margin-top: 1.5rem !important;
}
</style>
