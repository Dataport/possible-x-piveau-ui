<template>
  <div
    class="d-flex flex-column p-0 bg-transparent"
    :data-cy="getRepresentativeLocaleOf(getTitle, $route.query.locale, getLanguages)
    && `dataset@${getRepresentativeLocaleOf(getTitle, $route.query.locale, getLanguages)}`"
  >
    <datasetDetailsNavigation :dataset-id="getID"></datasetDetailsNavigation>
    <div class="container-fluid mb-5 pt-1 content">
      <datasetDetailsTop v-bind:dataset-id="getID"></datasetDetailsTop>
      <router-view name="datasetDetailsSubpages"></router-view>
    </div>
  </div>
</template>

<script>
// import Actions and Getters from Store Module
import { mapActions, mapGetters } from 'vuex';

// import nested components
import DatasetDetailsTop from './DEU-datasetDetails-top';
import DatasetDetailsNavigation from './DEU-datasetDetails-navigation';
import DatasetDetailsDataset from './DEU-datasetDetails-dataset';
import DatasetDetailsSimilarDatasets from './DEU-datasetDetails-similarDatasets';
import { helpers } from '@piveau/piveau-hub-ui-modules';
const { getRepresentativeLocaleOf, getTranslationFor } = helpers;
// import DatasetDetailsActivityStream from './DEU-datasetDetails-activityStream';

export default {
  name: 'datasetDetails',
  components: {
    datasetDetailsTop: DatasetDetailsTop,
    datasetDetailsNavigation: DatasetDetailsNavigation,
    datasetDetailsDataset: DatasetDetailsDataset,
    datasetDetailsSimilarDatasets: DatasetDetailsSimilarDatasets
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
  },
  created() {
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
  @import '../styles/bootstrap_theme';

  .content {
    padding: 30px 30px 0 30px;
    margin-top: 15px;
    margin-bottom: 15px;
    background-color: white;
  }
</style>
