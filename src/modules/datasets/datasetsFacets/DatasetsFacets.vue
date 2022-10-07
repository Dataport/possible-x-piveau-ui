<template>
  <div class="container dataset-facets">
    <div class="row mx-3 mr-md-0">
      <div class="col">
        <datasets-map-facet
          :showCatalogDetails="showCatalogDetails"
        />
        <catalog-details-facet
          v-if="showCatalogDetails"
          :catalog="catalog"
          :catalogLanguageIds="catalogLanguageIds"
        />
        <span v-if="showFacetsTitle" class="row h5 font-weight-bold mt-4 mb-3">Filter by</span>
        <settings-facet
          v-if="!showCatalogDetails"
          class="row facet-field mb-3"
        />
        <div class="row facet-field mb-3"
             v-for="(field, index) in getSortedFacets"
             :key="`facet@${field.id}`"
             :class="{'mt-3': (index > 0)}"
        >
          <radio-facet
            v-if="(field.id === 'dataServices')"
            :title="dataServices.title"
            :property="dataServices.property"
            :toolTipTitle="dataServices.toolTipTitle"
            :optionIds="['true', 'false']"
            :optionLabels="[dataServices.yes, dataServices.no]"
            :initialOption="getDataServices"
            :change="changeDataServices"
          />
          <select-facet
            v-else
            :fieldId="field.id"
            :header="facetTitle(field.id)"
            :items="sortByCount(field.items, field.id)"
            :toolTipTitle="tooltip(field.id)"
            :getFacetTranslationWrapper="getFacetTranslationWrapper"
            :facetIsSelected="facetIsSelected"
            :facetClicked="facetClicked"
            :multiSelect="field.id !== 'scoring'"
            class="col pr-0"
          />
        </div>
        <div>
          <pv-show-more
            v-if="showMoreFacetsShown"
            :label="cutoff >= 0? 'More filters' : 'Less filters'"
            :upArrow="cutoff === -1"
            :action="toggleCutoff"
            class="p-0 row"
          />
        </div>
        <pv-button
          v-if="showClearButton"
          label="Clear filters"
          class="row mt-5"
          :action="clearFacets"
        />
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
// import Facet from '../../facets/SelectFacet.vue';
import Vue from 'vue';
import DatasetsFacetsItem from './DatasetsFacetsItem.vue';
import { getTranslationFor, getFacetTranslation } from '../../utils/helpers';
import DatasetsMapFacet from "@/modules/datasets/datasetsFacets/DatasetsMapFacet";
import CatalogDetailsFacet from "@/modules/datasets/datasetsFacets/CatalogDetailsFacet";
import SettingsFacet from "@/modules/datasets/datasetsFacets/SettingsFacet";

export default {
  name: 'datasetFacets',
  dependencies: ['catalogService'],
  components: {
    SettingsFacet,
    CatalogDetailsFacet,
    DatasetsMapFacet,
    DatasetsFacetsItem
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
      cutoff: this.$env.datasets.facets.cutoff,
      showClearButton: this.$env.datasets.facets.showClearButton,
      showFacetsTitle: this.$env.datasets.facets.showFacetsTitle,
      defaultFacetOrder: this.$env.datasets.facets.defaultFacetOrder,
      useScoringFacets: this.$env.datasets.facets.scoringFacets.useScoringFacets,
      useDataScopeFacets: this.$route.query.catalog.length === 0,
      showCatalogDetails: false,
      catalog: {},
      MIN_FACET_LIMIT: this.$env.datasets.facets.MIN_FACET_LIMIT,
      MAX_FACET_LIMIT: this.$env.datasets.facets.MAX_FACET_LIMIT,
      FACET_OPERATORS: this.$env.datasets.facets.FACET_OPERATORS,
      FACET_GROUP_OPERATORS: this.$env.datasets.facets.FACET_GROUP_OPERATORS,
      dataServices: {
        yes: Vue.i18n.t('message.metadata.yes'),
        no: Vue.i18n.t('message.metadata.no'),
        property: Vue.i18n.t('message.datasetFacets.facets.dataServices.dataServicesOnly'),
        title: Vue.i18n.t('message.metadata.dataServices'),
        toolTipTitle: Vue.i18n.t('message.helpIcon.dataServices'),
      }
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
    showMoreFacetsShown() {
      return this.$env.datasets.facets.cutoff > 0 && this.$env.datasets.facets.cutoff < this.getAllAvailableFacets.length;
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
      if (this.cutoff > 0) {
        return sortedFacets.slice(0, this.cutoff - 1); // -1 because we always show the settings facet
      } else {
        return sortedFacets;
      }
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
      'addFacet',
      'removeFacet',
      'setFacetGroupOperator',
      'setDataServices',
      'setPage',
      'setPageCount',
      'setMinScoring',
    ]),
    toggleCutoff() {
      this.cutoff = this.cutoff >= 0 ? -1 : this.$env.datasets.facets.cutoff;
    },
    facetTitle(fieldId) {
      return fieldId === 'scoring' ?
        Vue.i18n.t('message.header.navigation.data.metadataquality')
        : Vue.i18n.t(`message.datasetFacets.facets.${fieldId.toLowerCase()}`);
    },
    tooltip(fieldId) {
      return fieldId === 'dataScope' ? Vue.i18n.t('message.helpIcon.dataScope') : Vue.i18n.t(`message.helpIcon.${fieldId.toLowerCase()}`);
    },
    getFacetTranslationWrapper(fieldId, facetId, userLocale, fallback) {
      return fieldId === 'scoring'
        ? `${this.$t(`message.datasetFacets.facets.scoring.${facetId}`)}${facetId === 'sufficientScoring' || facetId === 'goodScoring' ? '+' : ''}`
        : this.getFacetTranslation(fieldId, facetId, userLocale, fallback);
    },
    sortByCount(items, fieldId) {
      if (fieldId === 'scoring' || fieldId === 'dataScope') return items;
      return items.slice().sort((a, b) => {
        const n = b.count - a.count;
        if (n !== 0) return b.count - a.count;
        if (a.name < b.name) return -1;
        return 1;
      });
    },
    facetIsSelected(fieldId, item) {
      const facet = item.id;
      if (fieldId === 'scoring') {
        const qMinScoring = parseInt(this.getMinScoring, 10);
        const minScoringIsSelected = this.$route.query[fieldId];
        return minScoringIsSelected && qMinScoring === item.minScoring;
      }
      if (!Object.prototype.hasOwnProperty.call(this.$route.query, fieldId)) {
        return false;
      }
      if (fieldId === 'dataScope') return this.$route.query.dataScope === facet;
      let qField = this.$route.query[fieldId];
      if (!Array.isArray(qField)) qField = [qField];
      if (fieldId === 'categories') {
        // Ignore Case for categories
        facet.toUpperCase();
        qField = qField.map(f => f.toUpperCase());
      }
      return qField.indexOf(facet) > -1;
    },
    facetClicked(field, item) {
      const facet = item.id;
      if (field === "dataScope") {
        this.dataScopeFacetClicked(facet);
      } else {
        if (field === 'scoring') this.scoringFacetClicked(item);
        this.toggleFacet(field, facet);
      }
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
      } else if (field === 'scoring') {
        // Empty facets as scoring facets are disjoint
        facets = [];
      }
      const index = facets.indexOf(facet);
      if (index > -1) {
        facets.splice(index, 1);
      } else {
        facets.push(facet);
      }
      return this.$router.push(
        { query: Object.assign({}, this.$route.query, { [field]: facets, page: 1 }) }
      ).catch(
        error => { console.log(error); }
      );
    },
    clearFacets() {
      if (Object.keys(this.$route.query).some(key => (key !== 'locale' && key !== 'page') && this.$route.query[key].length)) {
        this.$router.push({ query: { locale: this.$i18n.locale, page: "1" } })
          .catch(error => { console.log(error); });
      }
    },
    dataScopeFacetClicked(dataScope) {
      if (this.$route.query.dataScope === dataScope) {
        this.$router.push(
          { query: Object.assign({}, this.$route.query, { dataScope: [], country: [], page: 1 }) }
        ).catch(
          error => { console.log(error); }
        );
      } else {
        const country = [];
        country.push(dataScope);
        this.$router.push(
          { query: Object.assign({}, this.$route.query, { dataScope, country, page: 1 }) }
        ).catch(
          error => { console.log(error); }
        );
      }
    },
    scoringFacetClicked(item) {
      let newScoring = item.minScoring;
      if (newScoring === this.getMinScoring) newScoring = 0;
      this.setMinScoring(newScoring);
      localStorage.setItem('minScoring', JSON.stringify(newScoring));
      this.resetPage();
      window.scrollTo(0, 0);
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

<style lang="scss" scoped>

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
