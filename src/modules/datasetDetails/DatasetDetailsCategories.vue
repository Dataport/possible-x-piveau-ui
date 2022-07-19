<template>
  <div class="mt-3">
    <div class="row">
      <div class="col-10 offset-1">
        <h2>{{ $t('message.datasetDetails.subnav.categories') }}</h2>
        <div class="categories mt-4 mb-5">
          <div v-for="(category, i) in getCategories" :key="i" class="p-2 mt-3 border border-secondary bg-light">
            <app-link :to="getCategoryLink(category)" v-if="showCategory(category)">
              {{ getTranslationFor(category.title, $route.query.locale) }}
            </app-link>
          </div>
          <div v-if="getCategories && getCategories.length === 0">
            <p>{{ $t('message.datasetCategories.noCategories') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { has } from 'lodash';
  import { getTranslationFor } from '../utils/helpers';
  import AppLink from "../widgets/AppLink.vue";

  export default {
    name: 'datasetDetailsCategories',
    dependencies: 'DatasetService',
    components: {
      appLink: AppLink,
    },
    metaInfo() {
      return {
        title: this.$t('message.metadata.categories'),
        meta: [
          {
            name: 'description',
            vmid: 'description',
            content: (`${this.$t('message.metadata.categories')} - ${this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages)} - data.europa.eu`).substr(0, 4999),
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
      return {};
    },
    computed: {
      // import store-getters
      ...mapGetters('datasetDetails', [
        'getCategories',
        'getKeywords',
        'getLanguages',
        'getTitle',
      ]),
    },
    methods: {
      has,
      getTranslationFor,
      // import store-actions
      ...mapActions('datasetDetails', [
        'loadDatasetDetails',
        'useService',
      ]),
      showCategory(category) {
        return has(category, 'id');
      },
      getCategoryLink(category) {
        const categoryID = category.id.toUpperCase();
        return { path: `/datasets?categories=${categoryID}`, query: Object.assign({}, { locale: this.$route.query.locale }) };
      },
    },
    created() {
      this.useService(this.DatasetService);
      this.$nextTick(() => {
        this.$Progress.start();
        this.loadDatasetDetails(this.$route.params.ds_id)
          .then(() => {
            this.$Progress.finish();
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

