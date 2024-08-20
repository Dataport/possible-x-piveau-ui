<template>
  <div class="container-fluid catalogs content">
    <h1 class="row col-12 page-title text-primary">{{ $t('message.header.navigation.data.catalogs') }}</h1>
    <div class="row">
      <catalogues-facets v-if="useCatalogFacets" class="col-md-3 col-12 mb-3 mb-md-0 px-0"></catalogues-facets>
      <section class="col-md col-12">
        <resource-filters class="filters-group" :resource="getSelectedResource"></resource-filters>
        <div class="alert alert-primary mt-3 d-flex flex-row" :class="{ 'alert-danger': getCatalogsCount <= 0 && !getLoading}">
          <div>
            {{ getLoading ? $t('message.catalogs.loadingMessage'):`${getCatalogsCount.toLocaleString('fi')}
            ${$t('message.catalogs.countMessage')}`}}
          </div>
          <div class="loading-spinner ml-3" v-if="getLoading"></div>
        </div>
        <selectedFacetsOverview v-if="getFacets" :selected-facets="getFacets" :available-facets="getAvailableFacets"></selectedFacetsOverview>
        <pv-data-info-box
          v-for="catalog in getCatalogs"
          :key="`data-info-box@${catalog.id}`"
          catalog-mode
          :to="{
            path: `/catalogues/${catalog.id}`,
            query: {
              locale: $route.query.locale
            },
          }"
          :src="getImg(getCatalogImage(catalog))"
          :dataset="{
            title: getTranslationFor(catalog.title, $route.query.locale, getCatalogLanguages(catalog)),
            description:
              getTranslationFor(catalog.description, $route.query.locale, getCatalogLanguages(catalog)),
            catalog: getTranslationFor(catalog.title, $route.query.locale, getCatalogLanguages(catalog)),
            createdDate: null,
            updatedDate: null,
            formats: [],
          }"
          :description-max-length="1000"
          :data-cy="`catalog@${catalog.id}`"
          class="mt-3"
        />
        <div class="loading-spinner mx-auto mt-3 mb-3" v-if="getLoading"></div>
      </section>
    </div>
    <div class="row">
      <div class="column col-12 col-md-9 offset-md-3">
        <pagination class="mt-3"
          :items-count="getCatalogsCount"
          :items-per-page="getLimit"
          :get-page="getPage"
          :get-page-count="getPageCount"
          @setPageLimit="setPageLimit"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import { mapActions, mapGetters } from 'vuex';
import { debounce, has } from 'lodash-es';
import fileTypes from '../utils/fileTypes';
import CataloguesFacets from './cataloguesFacets/CataloguesFacets.vue';
import Pagination from '../widgets/Pagination.vue';
import SelectedFacetsOverview from '../facets/SelectedFacetsOverview.vue';
import ResourceFilters from "../resources/resourceFilters/ResourceFilters.vue";
import dateFilters from '../filters/dateFilters';
import { getImg, getCountryFlagImg, getTranslationFor } from '../utils/helpers';
import { useDatasetsHead } from '../composables/head';

// Generic Resource stores
import { useResourcesStore } from '../store/resourcesStore';

export default {
  name: 'catalogs',
  components: {
    ResourceFilters,
    SelectedFacetsOverview,
    CataloguesFacets,
    Pagination
  },
  props: {
    infiniteScrolling: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      autocompleteData: {
        suggestions: {},
        show: true,
      },
      debouncedOnBottomScroll: debounce(this.onBottomScroll, 500),
      facetFields: [],
      query: '',
      sortSelected: `relevance desc, modified desc, title.${this.$route.query.locale} asc`,
      sortSelectedLabel: this.$t('message.sort.relevance'),
      currentSearchQuery: this.$route.query.query,
      useCatalogFacets: this.$env.content.catalogs.facets.useCatalogFacets,
    };
  },
  computed: {
    ...mapGetters('catalogs', [
      'getCatalogs',
      'getCatalogsCount',
      'getFacets',
      'getLimit',
      'getLoading',
      'getOffset',
      'getPage',
      'getPageCount',
      'getAvailableFacets',
    ]),
    page() {
      return this.$route.query.page;
    },
    facets() {
      const facets = {};
      for (const field of this.facetFields) {
        let urlFacets = this.$route.query[field];
        if (!urlFacets) urlFacets = [];
        else if (!Array.isArray(urlFacets)) urlFacets = [urlFacets];
        facets[field] = urlFacets;
      }
      return facets;
    },
    getSelectedResource() {
      return this.resourcesStore.getters.getSelectedResource;
    },
  },
  methods: {
    ...mapActions('catalogs', [
      'autocompleteQuery',
      'loadCatalogs',
      'loadAdditionalCatalogs',
      'setQuery',
      'setPage',
      'addFacet',
      'setFacets',
      'setFacetOperator',
      'setFacetGroupOperator',
      'setPageCount',
      'setSort',
      'setLimit',
      'setLoading',
    ]),
    has,
    getImg,
    getTranslationFor,
    getCountryFlagImg,
    initLimit() {
      const limit = parseInt(this.$route.query.limit, 10);
      if (limit > 0) this.setLimit(limit);
    },
    setPageLimit(value) {
        this.setLimit(value);
        this.initCatalogues();
    },
    initPage() {
      const page = parseInt(this.$route.query.page, 10);
      if (page > 0) this.setPage(page);
      else this.setPage(1);
    },
    initQuery() {
      let query = this.$route.query.query;
      if (!query) {
        query = '';
        this.setQuery('');
      } else {
        this.query = query;
        this.setQuery(query);
      }
    },
    initSort() {
      let sort = this.$route.query.sort;
      if (sort) {
        sort = sort.split(',')[0].toLowerCase();
        if (sort === 'relevance+desc') this.sortSelectedLabel = this.$t('message.sort.relevance');
        if (sort.includes('title') && sort.includes('asc')) this.sortSelectedLabel = this.$t('message.sort.nameAZ');
        if (sort.includes('title') && sort.includes('desc')) this.sortSelectedLabel = this.$t('message.sort.nameZA');
        if (sort === 'modified+desc') this.sortSelectedLabel = this.$t('message.sort.lastUpdated');
        if (sort === 'issued+desc') this.sortSelectedLabel = this.$t('message.sort.lastCreated');
        this.sortSelected = this.$route.query.sort;
      }
    },
    initFacetOperator() {
      const op = this.$route.query.facetOperator;
      if (op === 'AND' || op === 'OR') this.setFacetOperator(op);
    },
    initFacetGroupOperator() {
      // const op = this.$route.query.facetGroupOperator;
      const op = this.$route.query.facetOperator;
      if (op === 'AND' || op === 'OR') this.setFacetGroupOperator(op);
    },
    initFacets() {
      const fields = this.$env.content.catalogs.facets.defaultFacetOrder;
      for (const field of fields) {
        this.facetFields.push(field);
        if (!Object.prototype.hasOwnProperty.call(this.$route.query, [field])) {
          this.$router.replace({
            query: Object.assign({}, this.$route.query, { [field]: [] }),
          });
        } else {
          for (const facet of this.$route.query[field]) {
            this.addFacet({ field, facet });
          }
        }
      }
    },
    initCatalogues() {
      this.$nextTick(() => {
        this.$Progress.start();
        this.loadCatalogs({})
          .then(() => {
            this.setPageCount(Math.ceil(this.getCatalogsCount / this.getLimit));
            this.$Progress.finish();
            $('[data-toggle="tooltip"]').tooltip({
                container: 'body',
            });
          })
          .catch(() => this.$Progress.fail());
      });
    },
    initInfiniteScrolling() {
        if (this.infiniteScrolling) window.addEventListener('scroll', this.onScroll);
    },
    setSortMethod(method, order, label) {
      this.sortSelectedLabel = label;
      if (method === 'relevance') this.sortSelected = `${method}+${order}, modified+desc, title.${this.$route.query.locale}+asc`;
      if (method === 'modified') this.sortSelected = `${method}+${order}, relevance+desc, title.${this.$route.query.locale}+asc`;
      if (method === `title.${this.$route.query.locale}`) this.sortSelected = `${method}+${order}, relevance+desc, modified+desc`;
      if (method === `title.${this.$route.query.locale}`) this.sortSelected = `${method}+${order}, relevance+desc, modified+desc`;
      if (method === 'issued') this.sortSelected = `${method}+${order}, relevance+desc, title.${this.$route.query.locale}+asc`;
    },
    changeQuery(query) {
      // this.autocomplete(query);
      this.$router.replace({ query: Object.assign({}, this.$route.query, { query }) });
      this.setQuery(query);
    },
    autocomplete(query) {
      this.autocompleteQuery(query)
        .then((response) => {
          this.autocompleteData.suggestions = [];
          const suggestions = response.data.result;
          const displayedSuggestions = [];
          for (const ds of suggestions.results) {
            displayedSuggestions.push(ds);
          }
          this.autocompleteData.suggestions = displayedSuggestions;
          this.autocompleteData.show = query.length !== 0;
        })
        .catch(error => { console.error(error); });
    },
    handleSuggestionSelection(suggestion) {
      this.$router.push({ path: this.$route.path.slice(-1) === '/' ? `${this.$route.path}${suggestion.idName}` : `${this.$route.path}/${suggestion.idName}` });
    },
    onScroll() {
      const items = this.$el.querySelectorAll('.catalog');
      const lastItem = items[items.length - 1];
      if (lastItem) {
        const lastItemPos = lastItem.getBoundingClientRect();
        if (lastItemPos.bottom - window.innerHeight <= 0) {
          this.debouncedOnBottomScroll();
        }
      }
    },
    onBottomScroll() {
      this.$nextTick(() => {
        this.$Progress.start();
        this.setLoading(true);
        this.loadAdditionalCatalogs()
          .then(() => {
            this.$Progress.finish();
            this.setLoading(false);
          })
          .catch(() => {
            this.$Progress.fail();
            this.setLoading(false);
          });
      });
    },
    removeDuplicatesOf(array) {
      return [...new Set(array)];
    },
    getFileTypeColor(format) {
      return fileTypes.getFileTypeColor(format);
    },
    filterDateFormatUS(date) {
      return dateFilters.formatUS(date);
    },
    filterDateFormatEU(date) {
      return dateFilters.formatEU(date);
    },
    filterDateFromNow(date) {
      return dateFilters.fromNow(date);
    },
    getCatalogLink(catalog) {
      return `/catalogues/${catalog.id}&locale=${this.$route.query.locale}`;
    },
    getCatalogImage(catalog) {
      return this.$env.content.catalogs.useCatalogCountries
        ? `${this.$env.content.catalogs.defaultCatalogImagePath}/${has(catalog, 'country.id') ? catalog.country.id : this.$env.content.catalogs.defaultCatalogCountryID}`
        : `${this.$env.content.catalogs.defaultCatalogImagePath}/${has(catalog, 'id') ? catalog.id : this.$env.content.catalogs.defaultCatalogID}`;
    },
    getFooterTags(catalog) {
      return [`${has(catalog, 'count') ? catalog.count : 0}`];
    },
    getCatalogLanguages(catalog) {
      return has(catalog, 'country.id') ? [catalog.country.id].concat(catalog.languages) : catalog.languages;
    },
    isSortSelectedLabelInDropdown() {
      if (this.sortSelectedLabel === this.$t('message.sort.nameAZ')
        || this.sortSelectedLabel === this.$t('message.sort.nameZA')
        || this.sortSelectedLabel === this.$t('message.sort.lastCreated')) {
        return true;
      }
      return false;
    },
    isSortSelectedLabelActive(label) {
      if (label === this.sortSelectedLabel) return true;
      return false;
    },
  },
  watch: {
    facets: {
      handler(facets) {
        this.setFacets(facets);
      },
      deep: true,
    },
    page(pageStr) {
      const page = parseInt(pageStr, 10);
      if (page > 0) this.setPage(page);
      else this.setPage(1);
    },
    sortSelected: {
      handler(sort) {
        this.$router.replace({ query: Object.assign({}, this.$route.query, { sort }) });
        this.setSort(sort);
      },
      deep: true,
    },
    $route(to) {
      this.currentSearchQuery = to.query.query;
    },
  },
  created() {
    this.initLimit();
    this.initPage();
    this.initQuery();
    this.initSort();
    this.initFacetOperator();
    this.initFacetGroupOperator();
    this.initFacets();
    this.initCatalogues();
    this.initInfiniteScrolling();

    this.setQuery(this.$route.query?.query);

    if (this.resourcesStore.getters.getAvailableResources.length > 0) {
      this.resourcesStore.mutations.setSelectedResource('catalogues');
    } else {
      this.resourcesStore.actions.loadAvailableResources()
        .then(() => {
            this.resourcesStore.mutations.setSelectedResource('catalogues');
        });
    }
  },
  beforeUnmount() {
    $('.tooltip').remove();
    if (this.infiniteScrolling) window.removeEventListener('scroll', this.onScroll);
  },
  setup() {
    useDatasetsHead({ isCatalog: true })

    // Make store available in component
    const resourcesStore = useResourcesStore();
    return { resourcesStore };
  }
};
</script>

<style lang="scss" scoped>

  .alert-primary {
    color: #042648;
    background-color: #cddbe8;
    border-color: #baccdf;
  }

  .page-title {
    // maybe we can change custom theme h1 to 3rem
    font-size: 3rem;
    margin-bottom: 15px;
  }

  .search-button {
    border-radius: 100% !important;

    &:hover {
      background-color: #196fd2;
      border-color: #196fd2
    }
  }

  .cursor-pointer {
    cursor: pointer;
  }
  .custom-button {
    border: 1px solid black;
    background-color: white;
    outline: none;
  }
  .custom-middle-button {
    border: 1px solid black;
    border-left: none;
    background-color: white;
    outline: none;
  }
  .custom-dropdown-button {
    border: 1px solid black;
    padding: 0;
    background-color: white;
    outline: none;
  }
  .active-styles {
    background-color: rgba(0, 29, 133,0.1);
    color: black;
  }
  .inactive-styles {
    color: rgba(0, 0, 0, 0.5);

    &:hover {
      background-color: rgb(247, 247, 247);
      color: black;
    }
    &:focus {
      background-color: rgb(247, 247, 247);
      color: black;
    }
  }
  .custom-border-right {
    border-right: 1px solid black;
  }
  .border-radius-start {
    border-top-left-radius: 1.875rem;
    border-bottom-left-radius: 1.875rem;
  }
  .border-radius-end {
    border-top-right-radius: 1.875rem;
    border-bottom-right-radius: 1.875rem;
  }
  .border-right-custom {
    padding-right: 0.5rem;
    border-right: 1px solid black
  }
  .router-link-active {
    color: #175baf !important;
    border: none !important;
    border-bottom: 2px solid #175baf !important;
  }
  .router-link-inactive {
    color: #7f7f7f;
    border: none !important;
    &:hover {
      color: #175baf;
    }
  }
  .suggestion-input-group {
    position: relative;
  }
  .suggestion-input {
    position: absolute;
    top: 0;
  }
  .suggestion-list-group {
    position: relative;
    width: 100%;
  }
  .suggestion-list {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 100;
  }
</style>
