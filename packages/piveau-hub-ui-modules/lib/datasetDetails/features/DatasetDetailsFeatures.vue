<template>
  <div class="row flex-column dsd-features">
    <dataset-details-keywords
      class="dsd-keywords-feature"
      v-if="showObjectArray(getKeywords) && keywordsisVisible"
      :showKeyword="showKeyword"
    />
    <dataset-details-categories-key
      class="dsd-categories-feature"
      v-if="showObjectArray(getCategories)"
      :trackGoto="trackGoto"
    />
    <dataset-details-hvd-themes
    class="dsd-categories-feature"
    v-if="showObjectArray(getHvdCategories)"
      :trackGoto="trackGoto"
    />

    <dataset-details-subject
     class="dsd-subject-feature"
      v-if="showObjectArray(getSubject)"
    />

    <!-- Documentation -->
    <dataset-details-pages
      class="dsd-pages-feature"
      v-if="showObjectArray(getPages)"
      :pages="pages"
      :increaseNumDisplayedPages="increaseNumDisplayedPages"
      :nonOverflowingIncrementsForPages="nonOverflowingIncrementsForPages"
      :trackGoto="trackGoto"
    />

    <dataset-details-visualisations
      class="dsd-visualisations-feature"
      v-if="showObjectArray(getVisualisations)"
      :trackGoto="trackGoto"
    />

    <dataset-details-data-services
      class="dsd-data-services-feature"
      v-if="showObjectArray(getDataServices)"
      :getDataServices="getDataServices"
      :nonOverflowingIncrementsForPages="nonOverflowingIncrementsForPages"
      :increaseNumDisplayedPages="increaseNumDisplayedPages"
      :trackGoto="trackGoto"
    />

    <dataset-details-is-used-by
      class="dsd-is-used-by"
      v-if="showObject(getExtendedMetadata)"
    />

    <dataset-details-relations
      class="dsd-relations-feature"
      v-if="showArray(getRelations)"
    />

    <dataset-details-map
      class="dsd-map-feature"
      v-if="showObjectArray(getSpatial)"
    />
  </div>
</template>

<script>
import DatasetDetailsKeywords from "../../datasetDetails/features/DatasetDetailsKeywords";
import DatasetDetailsSubject from "../../datasetDetails/features/DatasetDetailsSubject";
import DatasetDetailsPages from "../../datasetDetails/features/DatasetDetailsPages";
import DatasetDetailsVisualisations from "../../datasetDetails/features/DatasetDetailsVisualisations";
import DatasetDetailsDataServices from "../../datasetDetails/features/DatasetDetailsDataServices";
import DatasetDetailsIsUsedBy from "../../datasetDetails/features/DatasetDetailsIsUsedBy";
import DatasetDetailsRelations from "../../datasetDetails/features/DatasetDetailsRelations";
import DatasetDetailsMap from "../../datasetDetails/features/DatasetDetailsMap";
import DatasetDetailsCategoriesKey from "../../datasetDetails/features/DatasetDetailsCategoriesKey";
import DatasetDetailsHvdThemes from "../../datasetDetails/features/DatasetDetailsHvdThemes.vue"

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
    DatasetDetailsKeywords,
    DatasetDetailsHvdThemes
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
  data() {
    return {
      keywordsisVisible: (this.$env.content.datasetDetails.keywords.isVisible === false) ? false : true,
    }
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
      'getSpatial',
      "getHvdCategories"
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
