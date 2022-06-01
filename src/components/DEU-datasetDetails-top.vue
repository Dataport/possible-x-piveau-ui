<template>
  <div>
    <div class="row">
      <div class="col-12">
        <datasetDetailsHeader></datasetDetailsHeader>
      </div>
    </div>
  </div>
</template>


<script>
  import { mapGetters, mapActions } from 'vuex';
  import DatasetDetailsHeader from './DEU-datasetDetails-header';
  import { AppLink } from "@piveau/piveau-hub-ui-modules";

  export default {
    name: 'datasetDetailsTop',
    dependencies: ['DatasetService'],
    components: {
      datasetDetailsHeader: DatasetDetailsHeader,
      appLink: AppLink,
    },
    data() {
      return {
        rtpToken: '',
        catalogId: '',
      };
    },
    computed: {
      // import store-getters
      ...mapGetters('datasetDetails', [
        'getID',
        'getTitle',
        'getCatalog',
        'getCategories',
        'getContactPoints',
        'getCountry',
        'getDescription',
        'getDistributions',
        'getPublisher',
        'getKeywords',
      ]),
    },
    props: {
      activeTab: {
        type: Number,
        default: 0,
      },
    },
    methods: {
      // import store-actions
      ...mapActions('datasetDetails', [
        'loadDatasetDetails',
        'useService',
      ]),
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/bootstrap_theme';

  /*** MATERIAL ICONS ***/
  .material-icons.small-icon {
    font-size: 20px;
  }
</style>
