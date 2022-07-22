<template>
  <div class="container dataset-facets">
    <div class="row mx-3 mr-md-0">
      <div class="col">
        <datasets-facet-map
          :showCatalogDetails="showCatalogDetails"
        />
        <catalog-details-facet
          v-if="showCatalogDetails"
          :catalog="catalog"
          :catalogLanguageIds="catalogLanguageIds"
        />
        <!-- Facet settings -->
        <settings-facet
          v-if="!showCatalogDetails"
        />
        <!-- Facets -->
        <div class="row facet-field mb-3"
             v-for="(field, index) in getSortedFacets"
             :key="`facet@${index}`"
             :class="{'mt-3': (index > 0)}"
        >
          <facet
            v-if="field.id === 'dataScope'"
            :header="$t('message.datasetFacets.facets.datascope')"
            :items="field.items"
            :minItems="MIN_FACET_LIMIT"
            :maxItems="MAX_FACET_LIMIT"
            :toolTipTitle="$t('message.helpIcon.dataScope')"
            class="col pr-0"
            v-slot="{ item: facet }"
          >
            <datasets-facets-item
              class="d-flex facet list-group-item list-group-item-action justify-content-between align-items-center"
              :title="$te(`message.datasetFacets.facets.datascopeField.${facet.id}`)
                ? $t(`message.datasetFacets.facets.datascopeField.${facet.id}`)
                : getFacetTranslationWrapper(field.id, facet.id, $route.query.locale, facet.title)"
              :count="getFacetCount(field, facet)"
              :hide-count="true"
              :class="{active: dataScopeFacetIsSelected(facet.id)}"
              @click.native="dataScopeFacetClicked(facet.id)"
            />
          </facet>
          <facet
            v-else-if="(field.id === 'dataServices')"
            :header="$t('message.metadata.dataServices')"
            :items="[]"
            :toolTipTitle="$t('message.helpIcon.dataServices')"
            class="col pr-0"
          >
            <template #after>
              <div class="form-group list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                {{ $t('message.datasetFacets.facets.dataServices.dataServicesOnly') }}
                <span class="ml-2 d-flex flex-wrap">
                  <div class="custom-control custom-radio">
                    <input type="radio" id="radio-yes" name="radio-facet-data-services" class="custom-control-input" @click="changeDataServices('true')" :checked="getDataServices === 'true'">
                    <label class="custom-control-label" for="radio-yes">{{ $t('message.metadata.yes') }}</label>
                  </div>
                  <div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="radio-no" name="radio-facet-data-services" @click="changeDataServices('false')" :checked="getDataServices === 'false'">
                    <label class="custom-control-label" for="radio-no">{{ $t('message.metadata.no') }}</label>
                  </div>
                </span>
              </div>
            </template>
          </facet>
          <facet
            v-else
            :header="field.id === 'scoring'
              ? $t('message.header.navigation.data.metadataquality')
              : $t(`message.datasetFacets.facets.${field.id.toLowerCase()}`)"
            :items="sortByCount(field.items, field.id)"
            :minItems="MIN_FACET_LIMIT"
            :maxItems="MAX_FACET_LIMIT"
            :toolTipTitle="$t(`message.helpIcon.${field.id.toLowerCase()}`)"
            class="col pr-0"
            v-slot="{ item: facet }"
          >
            <datasets-facets-item
              class="d-flex facet list-group-item list-group-item-action justify-content-between align-items-center"
              :title="getFacetTranslationWrapper(field.id, facet.id, $route.query.locale, facet.title)"
              :count="getFacetCount(field, facet)"
              :hide-count="field.id === 'dataScope'"
              :class="{active: field.id === 'scoring' ? scoringFacetIsSelected(facet.minScoring) : facetIsSelected(field.id, facet.id)}"
              @click.native="field.id === 'scoring' ? scoringFacetClicked(facet.minScoring): facetClicked(field.id, facet.id)"
            />
          </facet>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import {
  isObject,
  isArray,
  isString,
  has,
  isNil,
  isNumber,
} from 'lodash';
// import Facet from '../../facets/Facet.vue';
import DatasetsFacetsItem from './DatasetsFacetsItem.vue';
import { getTranslationFor, getFacetTranslation } from '../../utils/helpers';
import DatasetsFacetMap from "@/modules/datasets/datasetsFacets/DatasetsFacetMap";
import CatalogDetailsFacet from "@/modules/datasets/datasetsFacets/CatalogDetailsFacet";
import SettingsFacet from "@/modules/datasets/datasetsFacets/SettingsFacet";

export default {
  name: 'datasetFacets',
  dependencies: ['catalogService'],
  components: {
    SettingsFacet,
    CatalogDetailsFacet,
    // Facet,
    DatasetsFacetMap,
    DatasetsFacetsItem,
  },
  props: {
    dataScope: {
      type: String,
      default: null,
    },
  },
  metaInfo() {
    const catalogTitle = this.getTranslationFor(this.catalog.title, this.$route.query.locale, this.catalogLanguageIds) || this.catalog.id;
    const catalogDescription = this.getTranslationFor(this.catalog.description, this.$route.query.locale, this.catalogLanguageIds) || this.catalog.id;
    const title = this.currentSearchQuery
      ? `${this.currentSearchQuery}${this.showCatalogDetails ? ` - ${catalogTitle}` : ''}`
      : `${this.showCatalogDetails ? catalogTitle : this.$t('message.header.navigation.data.datasets')}`;
    return {
      title,
      meta: [
        { name: 'description', vmid: 'description', content: this.showCatalogDetails ? catalogDescription : `${this.$t('message.header.navigation.data.datasets')} - data.europa.eu` },
        { name: 'keywords', vmid: 'keywords', content: this.showCatalogDetails ? `${this.$env.keywords} ${this.$t('message.header.navigation.data.catalogs')}` : `${this.$env.keywords} ${this.$t('message.header.navigation.data.datasets')}` },
      ],
    };
  },
  data() {
    return {
      defaultFacetOrder: this.$env.datasets.facets.defaultFacetOrder,
      useScoringFacets: this.$env.datasets.facets.scoringFacets.useScoringFacets,
      useDataScopeFacets: this.$route.query.catalog.length === 0,
      showCatalogDetails: false,
      catalog: {},
      MIN_FACET_LIMIT: this.$env.datasets.facets.MIN_FACET_LIMIT,
      MAX_FACET_LIMIT: this.$env.datasets.facets.MAX_FACET_LIMIT,
      FACET_OPERATORS: this.$env.datasets.facets.FACET_OPERATORS,
      FACET_GROUP_OPERATORS: this.$env.datasets.facets.FACET_GROUP_OPERATORS,
    };
  },
  computed: {
    ...mapGetters('catalogDetails', [
      'getCatalog',
    ]),
    ...mapGetters('datasets', [
      'getAllAvailableFacets',
      'getDatasetsCount',
      'getFacetOperator',
      'getFacetGroupOperator',
      'getDataServices',
      'getLimit',
      'getMinScoring',
      'getPage',
      'getDatasetGeoBounds',
      'getScoringFacets',
    ]),
    datasetBoundsWatcher() {
      return this.getDatasetGeoBounds;
    },
    facetGroupOperatorWatcher() {
      return this.getFacetGroupOperator;
    },
    // dataServicesWatcher() {
    //   return this.getDataServices;
    // },
    // catalogWatcher() {
    //   return this.getCatalog;
    // },
    // showCatalogDetailsWatcher() {
    //   return this.$route.query.showcatalogdetails;
    // },
    useCatalogFacets() {
      return !this.showCatalogDetails;
    },
    currentSearchQuery() {
      return this.$route.query.query;
    },
    getSortedFacets() {
      const availableFacets = this.getAllAvailableFacets;
      const sortedFacets = [];

      this.defaultFacetOrder.forEach((facet) => {
        availableFacets.forEach((field) => {
          if (facet === field.id
            && field.items.length > 0
            && (field.id !== 'country' || this.dataScope)
            && (field.id !== 'catalog' || this.useCatalogFacets)
            && (field.id !== 'scoring' || this.useScoringFacets)
            && (field.id !== 'dataScope' || this.useDataScopeFacets)) sortedFacets.push(field);
        });
      });

      return sortedFacets;
    },
    // Returns the current catalog's available language ids
    // example: ['en', 'de', 'sv']
    catalogLanguageIds() {
      const languages = this.getCatalog && this.getCatalog.languages;
      if (!isArray(languages)) return [];
      return languages
        .map(lang => lang && lang.id)
        .filter(lang => lang);
    }
  },
  methods: {
    isObject,
    isArray,
    isString,
    has,
    isNil,
    isNumber,
    getTranslationFor,
    getFacetTranslation,
    ...mapActions('catalogDetails', [
      'loadCatalog',
      'useCatalogService',
    ]),
    ...mapActions('datasets', [
      'toggleFacet',
      'addFacet',
      'removeFacet',
      'setFacetGroupOperator',
      'setDataServices',
      'setPage',
      'setPageCount',
      'setMinScoring',
    ]),
    getFacetTranslationWrapper(fieldId, facetId, userLocale, fallback) {
      return fieldId === 'scoring'
        ? `${this.$t(`message.datasetFacets.facets.scoring.${facetId}`)}${facetId === 'sufficientScoring' || facetId === 'goodScoring' ? '+' : ''}`
        : this.getFacetTranslation(fieldId, facetId, userLocale, fallback);
    },
    sortByCount(facets, fieldId) {
      if (fieldId === 'scoring') return facets;
      return facets.slice().sort((a, b) => {
        const n = b.count - a.count;
        if (n !== 0) return b.count - a.count;
        if (a.name < b.name) return -1;
        return 1;
      });
    },
    facetIsSelected(field, facet) {
      if (!Object.prototype.hasOwnProperty.call(this.$route.query, field)) {
        return false;
      }
      let qField = this.$route.query[field];
      if (!Array.isArray(qField)) qField = [qField];
      if (field === 'categories') {
        // Ignore Case for categories
        facet.toUpperCase();
        qField = qField.map(f => f.toUpperCase());
      }
      return qField.indexOf(facet) > -1;
    },
    facetClicked(field, facet) {
      this.toggleFacet(field, facet);
      this.resetPage();
    },
    toggleFacet(field, facet) {
      if (!Object.prototype.hasOwnProperty.call(this.$route.query, [field])) {
        return this.$router.push(
          { query: Object.assign({}, this.$route.query, { [field]: [], page: 1 }) }
        ).catch(
          error => { console.log(error); }
        );
      }
      let facets = this.$route.query[field].slice();
      if (!Array.isArray(facets)) facets = [facets];
      if (field === 'categories') {
        // Ignore Case for categories
        facet.toUpperCase();
        facets = facets.map(f => f.toUpperCase());
      }
      const index = facets.indexOf(facet);
      if (index > -1) facets.splice(index, 1);
      else facets.push(facet);
      return this.$router.push(
        { query: Object.assign({}, this.$route.query, { [field]: facets, page: 1 }) }
      ).catch(
        error => { console.log(error); }
      );
    },
    scoringFacetIsSelected(minScoring) {
      const qMinScoring = parseInt(this.getMinScoring, 10);
      return qMinScoring === minScoring;
    },
    scoringFacetClicked(minScoring) {
      this.setMinScoring(minScoring);
      localStorage.setItem('minScoring', JSON.stringify(minScoring));
      this.resetPage();
      window.scrollTo(0, 0);
    },
    dataScopeFacetIsSelected(dataScope) {
      if (!Object.prototype.hasOwnProperty.call(this.$route.query, 'dataScope')) return false;
      return this.$route.query.dataScope === dataScope;
    },
    dataScopeFacetClicked(dataScope) {
      if (this.dataScopeFacetIsSelected(dataScope)) {
        this.$router.push(
          { query: Object.assign({}, this.$route.query, { dataScope: [], country: [], page: 1 }) }
        ).catch(
          error => { console.log(error); }
        );
      } else {
        const country = [];
        if (dataScope !== 'countryData') country.push(dataScope);
        this.$router.push(
          { query: Object.assign({}, this.$route.query, { dataScope, country, page: 1 }) }
        ).catch(
          error => { console.log(error); }
        );
      }
    },
    toggleFacetGroupOperator() {
      let op = this.getFacetGroupOperator;
      op = op === this.FACET_GROUP_OPERATORS.and ? this.FACET_GROUP_OPERATORS.or : this.FACET_GROUP_OPERATORS.and;
      this.setFacetGroupOperator(op);
    },
    changeDataServices(ds) {
      this.setDataServices(ds);
    },
    resetPage() {
      this.$router.replace(
        { query: Object.assign({}, this.$route.query, { page: 1 }) }
      ).catch(
        error => { console.log(error); }
      );
    },
    initShowCatalogDetails() {
      const showCatalogDetails = this.$route.query.showcatalogdetails;
      if (showCatalogDetails === 'true') {
        this.showCatalogDetails = true;
        this.loadCatalog(this.$route.query.catalog);
      } else this.showCatalogDetails = false;
    },
    getFacetCount(field, facet) {
      if (field.id === 'scoring') return '';
      return facet.count;
    }
  },
  watch: {
    facetGroupOperatorWatcher: {
      handler(facetGroupOperator) {
        this.$router.replace(
          { query: Object.assign({}, this.$route.query, { facetGroupOperator }) }
        ).catch(
          error => { console.log(error); }
        );
      },
    },
    getDataServices(dataServices) {
      this.$router.replace(
        { query: Object.assign({}, this.$route.query, { dataServices }) }
      ).catch(
        error => { console.log(error); }
      );
    },
    '$route.query.showcatalogdetails'(showCatalogDetails) {
      this.showCatalogDetails = showCatalogDetails;
    },
    getDatasetGeoBounds(bounds) {
      this.bounds = bounds
    },
    getCatalog(catalog) {
      this.catalog = catalog;
    },
  },
  created() {
    this.useCatalogService(this.catalogService);
    this.initShowCatalogDetails();
  }
};
</script>

<style lang="scss">

.facet:hover {
  cursor: pointer;
}

.custom-control {
  padding-left: 1.5rem;
  margin-right: 1rem;
}
.custom-control-label {
  &::before {
    left: -1.5rem !important;
  }
  &::after {
    left: -1.5rem !important;
  }
}
.custom-control-input:checked ~ .custom-control-label::before {
  border-color: var(--primary);
  background-color: var(--primary);
}

.active {
  background-color: var(--primary);
  border-color: var(--primary);
}

.io {
  border: 0 !important;
  margin-bottom: 3px;
  opacity: 0.8;
}
.dropdown-menu.show{
  transform: translate3d(0px, 15px, 0px) !important;
  width: max-content;
  display: block;

}

</style>
