<template>
  <div
    class="d-flex flex-column p-0 bg-transparent"
    :data-cy="getRepresentativeLocaleOf(getTitle, $route.query.locale, getLanguages)
    && `dataset@${getRepresentativeLocaleOf(getTitle, $route.query.locale, getLanguages)}`"
  >
    <datasetDetailsNavigation :dataset-id="getID"></datasetDetailsNavigation>
    <div class="container-fluid mb-5 pt-1 content">
      <dataset-details-header />
      <router-view name="datasetDetailsSubpages"></router-view>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import DatasetDetailsHeader from './header/DatasetDetailsHeader.vue'
import DatasetDetailsNavigation from './navigation/DatasetDetailsNavigation.vue'
import { getRepresentativeLocaleOf, getTranslationFor } from '../utils/helpers';

export default {
  name: 'datasetDetails',
  components: {
    DatasetDetailsHeader,
    DatasetDetailsNavigation,
    // datasetDetailsDataset: DatasetDetailsDataset
    // datasetDetailsSimilarDatasets: DatasetDetailsSimilarDatasets
  },
  metaInfo() {
    const datasetTitleTranslated = this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages);
    const title = datasetTitleTranslated ? `${datasetTitleTranslated} - ${this.$env.title}` : undefined;
    return {
      titleTemplate(chunk) {
        return chunk ? `${chunk} - ${title}` : title;
      },
    };
  },
  data() {
    return {};
  },
  props: {
    activeTab: {
      type: Number,
      default: 0,
    },
    citationStyle: String
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getID',
      'getLanguages',
      'getTitle',
      'getDescription',
    ]),
  },
  methods: {
    ...mapActions('datasetDetails', [
    ]),
    getRepresentativeLocaleOf,
    getTranslationFor,
  }
};
</script>

<style lang="scss" scoped>
  .content {
    padding: 30px 30px 0 30px;
    margin-top: 15px;
    margin-bottom: 15px;
    background-color: white;
  }
</style>
