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
<!--      <pv-show-more-->
<!--        :label="distributionIsExpanded(distribution.id)? 'Show less' : 'Show more'"-->
<!--        :upArrow="distributionIsExpanded(distribution.id)"-->
<!--        :action="() => toggleDistribution(distribution.id)"-->
<!--        class="row text-primary"-->
<!--      />-->
    </div>
  </div>
</template>

<script>
import DistributionDescription
  from "@/modules/datasetDetails/distributions/DistributionDescription";
import DistributionExpandedContent
  from "@/modules/datasetDetails/distributions/DistributionExpandedContent";
import DistributionVisibleContent
  from "@/modules/datasetDetails/distributions/DistributionVisibleContent";
import DistributionExpand from "@/modules/datasetDetails/distributions/DistributionExpand";
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
    "showLicensingAssistant",
    "showLicence",
    "filterDateFormatEU",
    "showArray",
    "showNumber",
    "showObject",
    "showObjectArray",
    "appendCurrentLocaleToURL",
    "distributionCanShowMore",
    "toggleDistribution"
  ]
}
</script>

<style scoped>

</style>
