<template>
  <sub-navigation :title="getTranslationFor(getTitle, $route.query.locale, getLanguages)">
    <div class="d-flex container-fluid justify-content-between px-0 dsd-nav">
      <dataset-details-navigation-pages />
      <dataset-details-navigation-links
        :datasetId="datasetId"
      />
    </div>
  </sub-navigation>
</template>

<script>
import { mapGetters } from 'vuex';
import { getTranslationFor } from "../../utils/helpers";
// import SubNavigation from '../../navigation/SubNavigation.vue';
import DatasetCitationModal from '../../citation/DatasetCitationModal.vue';
import DatasetDetailsNavigationPages
  from "@/modules/datasetDetails/navigation/DatasetDetailsNavigationPages";
import DatasetDetailsNavigationLinks
  from "@/modules/datasetDetails/navigation/DatasetDetailsNavigationLinks";

  export default {
    name: 'datasetDetailsNavigation',
    components: {
      DatasetDetailsNavigationLinks,
      DatasetDetailsNavigationPages,
      // SubNavigation,
      DatasetCitationModal
    },
    props: {
      datasetId: {
        type: String,
        required: true,
      },
    },
    computed: {
      ...mapGetters('datasetDetails', [
        'getTitle',
        'getLanguages'
      ])
    },
    methods: {
      getTranslationFor
    }
  };
</script>
