<template>
  <div
    class="d-flex flex-column p-0 bg-transparent"
    :data-cy="getRepresentativeLocaleOf(getTitle, $route.query.locale, getLanguages)
    && `dataset@${getRepresentativeLocaleOf(getTitle, $route.query.locale, getLanguages)}`"
  >
    <dataset-details-navigation v-if="topTitle" :dataset-id="getID"/>
    <div class="container-fluid mb-5 pt-1 content dsd-content">
      <dataset-details-header />
      <dataset-details-navigation v-if="!topTitle" :dataset-id="getID"/>
      <hr v-if="topTitle" />
      <router-view name="datasetDetailsSubpages"></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import DatasetDetailsHeader from './header/DatasetDetailsHeader.vue';
import DatasetDetailsNavigation from './navigation/DatasetDetailsNavigation.vue';
import { getRepresentativeLocaleOf, getTranslationFor } from '../utils/helpers';
import { useDownloadDatasetOnMount } from '../composables/useDownloadDatasetOnMount';
import { getCurrentInstance } from 'vue';

export default {
  name: 'datasetDetails',
  components: {
    // DatasetDetailsHeader,
    DatasetDetailsNavigation,
  },
  metaInfo() {
    const datasetTitleTranslated = this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages);
    const title = datasetTitleTranslated ? `${datasetTitleTranslated} - ${this.$env.metadata.title}` : undefined;
    return {
      titleTemplate(chunk) {
        return chunk ? `${chunk} - ${title}` : title;
      },
    };
  },
  data() {
    return {
      topTitle: this.$env.content.datasetDetails.header.navigation === "top"
    };
  },
  props: {
    activeTab: {
      type: Number,
      default: 0
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
    getRepresentativeLocaleOf,
    getTranslationFor,
  },
  setup() {
    const vm = getCurrentInstance();
    const router = vm.proxy.$router;
    const hubUrl = vm.proxy.$env.api.hubUrl;
    useDownloadDatasetOnMount({ router, hubUrl });
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
