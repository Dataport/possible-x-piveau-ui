<template>
  <div class="dsd-categories mt-3">
    <div class="row">
      <div class="col-10 offset-1">
        <h2>{{ $t('message.datasetDetails.subnav.categories') }}</h2>
        <div class="dsd-categories-items mt-4 mb-5">
          <div v-for="(category, i) in getCategories" :key="i" class="p-2 mt-3 border border-secondary">
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
  import { has } from 'lodash-es';
  import { getTranslationFor } from '../utils/helpers';
  import AppLink from "../widgets/AppLink.vue";
  import * as metaInfo from "../composables/head";

  export default {
    name: 'datasetDetailsCategories',
    components: {
      appLink: AppLink,
    },
    data() {
      return {};
    },
    computed: {
      ...mapGetters('datasetDetails', [
        'getID',
        'getCategories',
      ]),
    },
    methods: {
      has,
      getTranslationFor,
      ...mapActions('datasetDetails', [
        'loadDatasetDetails',
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
      this.$nextTick(() => {
        // Duplicated API call, execute only if data not already loaded
        if (this.$route.params.ds_id !== this.getID) {
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
        }
      });
    },
    setup() {
      metaInfo.useDatasetCategoriesHead();
    }
  };
</script>

<style scoped lang="scss">
.tag-color {
  background-color: var(--tag-color);
}
.keywords__item > div {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
</style>
