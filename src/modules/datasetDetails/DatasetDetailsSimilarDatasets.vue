<template>
  <div class="mt-3">
    <div class="row">
      <div class="col-10 offset-1">
        <h2>{{ $t('message.datasetDetails.subnav.similarDatasets') }}</h2>
        <div class="loading-spinner mx-auto" v-if="!similarDatasetsFetched"></div>
        <p v-if="!similarDatasetsPresent && similarDatasetsFetched">{{ $t('message.similarDatasets.notFound') }}</p>
        <div class="mt-4" v-if="similarDatasetsPresent && similarDatasetsFetched">
          <div v-for="(similarDataset, i) in similarDatasets" :key="i">
            <div class="mt-3 border-bottom border-secondary" v-if="has(similarDataset, 'title') && has(similarDataset, 'description')">
              <a v-if="has(similarDataset, 'uri')" class="text-dark font-weight-bold" :href="appendCurrentLocaleToURL(similarDataset.uri)">
                <h3>{{ getTranslationFor(similarDataset.title, $route.query.locale, getLanguages) }}</h3>
              </a>
              <p class="text-muted text-truncate">
                <small>{{ getTranslationFor(similarDataset.description, $route.query.locale, getLanguages) }}</small>
              </p>
              <div class="mb-3">
                <span class="p-1 ml-1 badge badge-success text-center text-white" v-if="similarDataset.distance <= 20">{{ $t('message.similarDatasets.verySimilar') }}</span>
                <span class="p-1 ml-1 badge badge-info text-center text-white" v-else-if="similarDataset.distance > 20 && similarDataset.distance <= 30">{{ $t('message.similarDatasets.similar') }}</span>
                <span class="p-1 ml-1 badge badge-warning text-center text-white" v-else-if="similarDataset.distance > 30 && similarDataset.distance <= 40">{{ $t('message.similarDatasets.lessSimilar') }}</span>
                <span class="p-1 ml-1 badge badge-secondary text-center text-white" v-else>{{ $t('message.similarDatasets.marginalSimilar') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { has } from 'lodash';
  import { getTranslationFor, appendCurrentLocaleToURL } from '../utils/helpers';

  export default {
    name: 'datasetDetailsSimilarDatasets',
    dependencies: 'DatasetService',
    metaInfo() {
      return {
        title: this.$t('message.similarDatasets.similarDatasets'),
        meta: [
          {
            name: 'description',
            vmid: 'description',
            content: (`${this.$t('message.similarDatasets.similarDatasets')} - ${this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages)} - data.europa.eu`)?.substring(0, 4999),
          },
          {
            name: 'keywords',
            vmid: 'keywords',
            content: this.getKeywords.map(k => k.title).join(' ').substring(0, 4999),
          },
        ],
      };
    },
    data() {
      return {
        similarDatasetsFetched: false,
        similarDatasetsPresent: false,
      };
    },
    computed: {
      // import store-getters
      ...mapGetters('datasetDetails', [
        'getKeywords',
        'getLanguages',
        'getSimilarDatasets',
        'getTitle',
      ]),
      similarDatasets() {
        return this.getSimilarDatasets;
      },
    },
    methods: {
      // import store-actions
      ...mapActions('datasetDetails', [
        'loadDatasetDetails',
        'loadSimilarDatasets',
        'loadSimilarDatasetDetails',
        'useService',
      ]),
      has,
      appendCurrentLocaleToURL,
      getTranslationFor,
      /**
       * Update all similar datasets by adding title and description
       */
      updateSimilarDatasets() {
        this.similarDatasets.forEach(this.getDatasetDetails);
      },
      /**
       * Get dataset details by id
       */
      getDatasetDetails(similarDataset) {
        this.loadSimilarDatasetDetails(similarDataset.id);
      },
    },
    created() {
      this.useService(this.DatasetService);
      this.$nextTick(() => {
        this.$Progress.start();
        this.loadDatasetDetails(this.$route.params.ds_id)
          .then(() => {
            this.loadSimilarDatasets(this.$route.params.ds_id)
              .then((response) => {
                this.$nextTick(() => {
                  this.updateSimilarDatasets();
                  this.similarDatasetsFetched = true;
                  this.similarDatasetsPresent = response.length > 0;
                });
                this.$Progress.finish();
              })
              .catch(() => {
                this.similarDatasetsFetched = true;
                this.$Progress.fail();
              });
          })
          .catch(() => {
            this.$Progress.fail();
            this.$router.replace({
              name: 'NotFound',
              query: { locale: this.$route.query.locale, dataset: this.$route.params.ds_id },
            });
          });
      });
    },
  };
</script>

