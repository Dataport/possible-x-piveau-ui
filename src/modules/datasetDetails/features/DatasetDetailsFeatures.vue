<template>
  <div class="row flex-column dsd-features">
    <dataset-details-keywords
      v-if="showObjectArray(getKeywords)"
      :showKeyword="showKeyword"
    />
    <dataset-details-categories-key
      class="dsdCategoryFeature"
      v-if="showObjectArray(getCategories)"
      :trackGoto="trackGoto"
    />
    <dataset-details-subject
      v-if="showObjectArray(getSubject)"
    />

    <!-- Documentation -->
    <dataset-details-pages
      v-if="showObjectArray(getPages)"
      :pages="pages"
      :increaseNumDisplayedPages="increaseNumDisplayedPages"
      :nonOverflowingIncrementsForPages="nonOverflowingIncrementsForPages"
      :trackGoto="trackGoto"
    />

    <dataset-details-visualisations
      v-if="showObjectArray(getVisualisations)"
      :trackGoto="trackGoto"
    />

    <dataset-details-data-services
      v-if="showObjectArray(getDataServices)"
      :getDataServices="getDataServices"
      :nonOverflowingIncrementsForPages="nonOverflowingIncrementsForPages"
      :increaseNumDisplayedPages="increaseNumDisplayedPages"
      :trackGoto="trackGoto"
    />

    <dataset-details-is-used-by
      v-if="showObject(getExtendedMetadata)"
    />

    <dataset-details-relations
      v-if="showArray(getRelations)"
    />

    <dataset-details-map
      v-if="showObjectArray(getSpatial)"
    />
  </div>
</template>

<script>
import DatasetDetailsKeywords from "@/modules/datasetDetails/features/DatasetDetailsKeywords";
import DatasetDetailsSubject from "@/modules/datasetDetails/features/DatasetDetailsSubject";
import DatasetDetailsPages from "@/modules/datasetDetails/features/DatasetDetailsPages";
import DatasetDetailsVisualisations from "@/modules/datasetDetails/features/DatasetDetailsVisualisations";
import DatasetDetailsDataServices from "@/modules/datasetDetails/features/DatasetDetailsDataServices";
import DatasetDetailsIsUsedBy from "@/modules/datasetDetails/features/DatasetDetailsIsUsedBy";
import DatasetDetailsRelations from "@/modules/datasetDetails/features/DatasetDetailsRelations";
import DatasetDetailsMap from "@/modules/datasetDetails/features/DatasetDetailsMap";
import DatasetDetailsCategoriesKey from "@/modules/datasetDetails/features/DatasetDetailsCategoriesKey";

import {mapGetters} from "vuex";
import {has, isEmpty} from "lodash";

export default {
  name: "DatasetDetailsFeatures",
  components: {
    DatasetDetailsMap,
    DatasetDetailsCategoriesKey,
    DatasetDetailsRelations,
    DatasetDetailsIsUsedBy,
    DatasetDetailsDataServices,
    DatasetDetailsVisualisations,
    DatasetDetailsPages,
    DatasetDetailsSubject,
    DatasetDetailsKeywords
  },
  props: {
    getKeywords: Array,
    pages: Object,
    increaseNumDisplayedPages: Function,
    nonOverflowingIncrementsForPages: Function,
    showKeyword: Function,
    trackGoto: Function,
    showObjectArray: Function,
    showArray: Function,
    showObject: Function
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getSubject',
      'getPages',
      'getVisualisations',
      'getDistributions',
      'getExtendedMetadata',
      'getRelations',
      'getCategories',
      'getSpatial'
    ]),
    getDataServices() {
      if (this.getDistributions) {
        const accessServiceList = this.getDistributions
          .filter(distribution => has(distribution, 'accessService') && !isEmpty(distribution.accessService))
          .map(distribution => ({
            endpoint_url: distribution.accessService[0].endpoint_url,
            title: distribution.accessService[0].title,
            description: distribution.accessService[0].description,
            availability: has(distribution.accessService[0], 'availability') ? distribution.accessService[0].availability : {}   // field added for DCAT-AP.de
          }));
        const uniqueAccessServiceList = [...new Map(
          accessServiceList
            .filter(accessService => accessService?.endpoint_url?.length)
            .map(accessService => [
              accessService.endpoint_url[0], accessService,
            ]),
        ).values()];
        return uniqueAccessServiceList;
      }
      return [{}];
    }
  }
}
</script>

<style scoped>

</style>
