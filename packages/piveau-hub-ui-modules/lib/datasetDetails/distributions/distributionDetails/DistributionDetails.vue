<template>
  <div class="flex-grow-1 d-flex distribution-details">
    <div class="col-sm-12 col-md-9 col-lg-7">
      <h3 class="m-0">{{ getDistributionTitle(distribution) }}</h3>
      <distribution-description
        :distribution="distribution"
        :distributions="distributions"
        :distributionDescriptionIsExpanded="distributionDescriptionIsExpanded"
        :getDistributionDescription="getDistributionDescription"
        :toggleDistributionDescription="toggleDistributionDescription"
        :distributionDescriptionIsExpandable="distributionDescriptionIsExpandable"
      />
      <distribution-expanded-content
        :contentList="distributionVisibleExpandedContent"
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
        :contentList="distributionVisibleContent"
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
      <distribution-expand
        :distribution="distribution"
        :distributionCanShowMore="distributionCanShowMore"
        :toggleDistribution="toggleDistribution"
        :distributionIsExpanded="distributionIsExpanded"
      />
    </div>
  </div>
</template>

<script>
import {
  has,
  isNil,
  isArray,
  isObject,
  isString,
  isNumber,
  isEmpty,
} from 'lodash';
import DistributionDescription
  from "../../../datasetDetails/distributions/distributionDetails/DistributionDescription";
import DistributionExpandedContent
  from "../../../datasetDetails/distributions/distributionDetails/DistributionExpandedContent";
import DistributionVisibleContent
  from "../../../datasetDetails/distributions/distributionDetails/DistributionVisibleContent";
import DistributionExpand from "../../../datasetDetails/distributions/distributionDetails/DistributionExpand";
export default {
  name: "DistributionDetails",
  components: {
    DistributionExpand,
    DistributionVisibleContent,
    DistributionExpandedContent,
    DistributionDescription
  },
  props: [
    "getDistributionTitle",
    "distribution",
    "distributions",
    "distributionDescriptionIsExpanded",
    "getDistributionDescription",
    "toggleDistributionDescription",
    "distributionDescriptionIsExpandable",
    "distributionIsExpanded",
    "distributionVisibleContent",
    "distributionExpandedContent",
    "showLicensingAssistant",
    "showLicence",
    "filterDateFormatEU",
    "showArray",
    "showNumber",
    "showObject",
    "showObjectArray",
    "appendCurrentLocaleToURL",
    "toggleDistribution"
  ],
  computed: {
    distributionVisibleExpandedContent() {
      return this.distributionVisibleContent
        .concat(this.distributionExpandedContent);
    },
    distributionExtraContent() {
      return this.distributionExpandedContent
        .filter(item => !this.distributionVisibleContent.includes(item))
    },
  },
  methods: {
    distributionCanShowMore(distribution) {
      return this.distributionExtraContent.reduce((accu, item) => {
        switch (item) {
          case 'license': return accu || (has(distribution, 'licence'))
          case 'licenseAttributionByText': return accu || has(distribution , 'licenseAttributionByText') && (!isNil(distribution.licenseAttributionByText) && !isNil(getTranslationFor(distribution.licenseAttributionByText)))
          case 'modificationDate': return accu || has(distribution, 'modificationDate') && !isNil(distribution.modificationDate)
          case 'releaseDate': return accu || (has(distribution, 'releaseDate') && !isNil(distribution.releaseDate))
          case 'availability': return accu || (has(distribution, 'availability') && this.showObject(distribution.availability) && !isNil(distribution.availability.label))
          case 'status': return accu || (has(distribution, 'status') && this.showObject(distribution.status))
          case 'rights': return accu || (has(distribution, 'rights') && this.showObject(distribution.rights))
          case 'mediaType': return accu || (has(distribution, 'mediaType') && !isNil(distribution.mediaType))
          case 'byteSize': return accu || (has(distribution, 'byteSize') && !isNil(distribution.byteSize))
          case 'checksum': return accu || (has(distribution, 'checksum') && !isNil(distribution.checksum) && has(distribution.checksum, 'algorithm') && !isNil(distribution.checksum.algorithm) && has(distribution.checksum, 'checksum_value') && !isNil(distribution.checksum.checksum_value))
          case 'pages': return accu || (has(distribution, 'pages') && this.showObjectArray(distribution.pages))
          case 'languages': return accu || (has(distribution, 'languages') && this.showArray(distribution.languages))
          case 'compressFormat': return accu || (has(distribution, 'compressFormat') && this.showObject(distribution.compressFormat))
          case 'packageFormat': return accu || (has(distribution, 'packageFormat') && this.showObject(distribution.packageFormat))
          case 'hasPolicy': return accu || (has(distribution, 'hasPolicy') && !isNil(distribution.hasPolicy))
          case 'conformsTo': return accu || (has(distribution, 'conformsTo') && this.showObjectArray(distribution.conformsTo))
          case 'spatialResolutionInMeters': return accu || (has(distribution, 'spatialResolutionInMeters') && this.showArray(distribution.spatialResolutionInMeters))
          case 'temporalResolution': return accu || (has(distribution, 'temporalResolution') && this.showArray(distribution.temporalResolution))
          default: return accu
        }
      }, false);
    },
  }
}
</script>
