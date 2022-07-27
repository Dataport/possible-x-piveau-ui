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
          <span class="d-inline-block col-12 col-md-9 col-lg-7">
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
          </span>
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
            />
            <linked-data-buttons-dropdown
              :distributions="distributions"
              :distribution="distribution"
            />
          </div>
        </div>
      </div>
    </div>
    <fading-distribution-overlay
      v-if="fading"
      :distributions="distributions"
      :setDistributionsDisplayCount="setDistributionsDisplayCount"
      :increaseNumDisplayedDistributions="increaseNumDisplayedDistributions"
      :nonOverflowingIncrementsForDistributions="nonOverflowingIncrementsForDistributions"
      :getDistributions="getDistributions"
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
import LinkedDataButtonsDropdown
  from "@/modules/datasetDetails/distributions/LinkedDataButtonsDropdown";
import DistributionDownload from "@/modules/datasetDetails/distributions/DistributionDownload";
import DistributionOptionsDropdown
  from "@/modules/datasetDetails/distributions/DistributionOptionsDropdown";
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

export default {
  name: 'Distribution',
  components: {
    FadingDistributionOverlay,
    DistributionFormat,
    DistributionDescription,
    DistributionExpandedContent,
    DistributionVisibleContent,
    DistributionExpand,
    DistributionOptionsDropdown,
    DistributionDownload,
    LinkedDataButtonsDropdown
  },
  props: {
    fading: Boolean,
    distribution: Object,
    distributions: Object,
    setDistributionsDisplayCount: Function,
    openModal: Function,
    getDistributions: Array,
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
.disabled {
  cursor: not-allowed;
}

.details-link {
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.text-break {
  word-break: break-word;
}

.heading, .arrow, .copy-text {
  cursor: pointer;
}

.circle {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  padding: 20px 0;
  font-size: 12px;
  line-height: 1px;
  border-radius: 50%;
  background-color: #595959;
  &[type="HTML"] {
    background-color: #285C76;
  }
  &[type="JSON"] {
    background-color: var(--dark-orange);
  }
  &[type="XML"] {
    background-color: #8F4300;
  }
  &[type="TXT"] {
    background-color: #2B5E73;
  }
  &[type="CSV"] {
    background-color: var(--badge-green);
  }
  &[type="XLS"] {
    background-color: #1A6537;
  }
  &[type="ZIP"] {
    background-color: #252525;
  }
  &[type="API"] {
    background-color: #923560;
  }
  &[type="PDF"] {
    background-color: #B30519;
  }
  &[type="SHP"] {
    background-color: var(--badge-black);
  }
  &[type="RDF"],
  &[type="NQUAD"],
  &[type="NTRIPLES"],
  &[type="TURTLE"] {
    background-color: #0b4498;
  }
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
