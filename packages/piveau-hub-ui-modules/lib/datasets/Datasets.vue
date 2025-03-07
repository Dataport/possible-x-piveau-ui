<template>
  <div class="datasets-container d-flex flex-column p-0 bg-transparent">
    <datasets-top-controls
        v-if="useFeed"
        :facets="facets"
        :getPage="getPage"
        :getLimit="getLimit"
        class="datasets-top-controls"
    />
    <div class="container-fluid datasets content">
      <slot name="title">
        <h1 class="row col-12 page-title catalog-title text-primary" v-if="showCatalogDetails">
          {{ getTranslationFor(getCatalog.title, $route.query.locale, getCatalog.languages) }}</h1>
        <h1 class="row col-12 page-title text-primary" v-else>{{ $t('message.header.navigation.data.datasets') }}</h1>
      </slot>
      <slot
          name="content"
          :datasets-count="getDatasetsCount"
          :datasets="getDatasets"
          :locale="$route.query.locale"
          :loading="getLoading"
          :use-dataset-facets="useDatasetFacets"
          :facets="getFacets"
          :available-facets="getAllAvailableFacets"
      >
        <div class="row">
          <div class="col d-flex d-md-none justify-content-end flex-wrap">
            <button class="btn btn-primary mb-3 text-right text-white" data-toggle="collapse"
                    data-target="#datasetFacets" data-cy="btn-filter-toggle"
                    @click="filterCollapsed = !filterCollapsed">
              {{ $t('message.datasetFacets.title') }}
              <i class="material-icons small-icon align-bottom" v-if="filterCollapsed">arrow_drop_up</i>
              <i class="material-icons small-icon align-bottom" v-else>arrow_drop_down</i>
            </button>
          </div>
          <datasets-facets
            v-if="useDatasetFacets"
            class="col-md-3 col-12 mb-3 mb-md-0 px-0 collapse" id="datasetFacets"
            :dataScope="dataScope"
            :available-facets="getAllAvailableFacets"
          ></datasets-facets>
          <section class="col-md col-12">
            <slot name="resource-filters">
              <resource-filters :resource="getSelectedResource"></resource-filters>
            </slot>
            <slot name="datasets-found" :data="{
              loading: getLoading,
              datasetsCount: getDatasetsCount,
              datasetsCountFormatted: getDatasetsCount.toLocaleString('fi'),
              loadingMessage: $t('message.datasets.loadingMessage'),
              countMessage: $t('message.datasets.countMessage'),
            }">
              <div class="datasets-found alert alert-primary mt-3 d-flex flex-row" role="status"
                   :class="{ 'alert-danger': getDatasetsCount <= 0 && !getLoading}">
                <div>
                  {{
                    getLoading ? $t('message.datasets.loadingMessage') : `${getDatasetsCount.toLocaleString('fi')}
                  ${$t('message.datasets.countMessage')}`
                  }}
                </div>
                <div class="loading-spinner ml-3" v-if="getLoading"></div>
              </div>
            </slot>
            <div class="alert alert-warning mt-3 d-flex flex-row" v-if="showScoreDisclaimer">
              <span>
                {{ $t("message.datasets.scoreDisclaimer") }}
                <app-link path="/mqa" :query="{ locale: $route.query.locale }" target="_blank">
                  <span>{{ $t("message.metadata.methodologyPage") }}</span>
                </app-link>
              </span>
            </div>
            <!--
            <div class="alert alert-info mt-3" v-if="getGeoBoundsById('modal-map')">
              {{`${$t('message.datasets.geoBoundsMessagePre')}`}}<strong>{{getGeoBoundsById('modal-map')}}</strong>{{`. ${$t('message.datasets.geoBoundsMessageRemove')}`}}
              <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="resetGeoBounds('modal-map'); loadDatasets({})">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            -->
            <selectedFacetsOverview
              v-if="getFacets"
              :selected-facets="getFacets"
              :available-facets="getAllAvailableFacets"
            >
            </selectedFacetsOverview>
            <template v-if="!getLoading">
              <dataset-list :datasets="getDatasets" :locale="$route.query.locale || 'en'"></dataset-list>
            </template>
            <div class="loading-spinner mx-auto mt-3 mb-3" v-if="getLoading"></div>
          </section>
        </div>
      </slot>
      <div class="row">
        <div class="column col-12 col-md-9 offset-md-3">
          <pagination class="mt-3"
                      :items-count="getDatasetsCount"
                      :items-per-page="getLimit"
                      :get-page="getPage"
                      :get-page-count="getPageCount"
                      @setPageLimit="setPageLimit"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { mapActions, mapGetters } from 'vuex';
import {
  debounce,
  has,
  groupBy,
  uniqBy,
  toPairs,
  isArray,
  isNil,
} from 'lodash-es';
import $ from 'jquery';
import fileTypes from '../utils/fileTypes';
import DatasetsFacets from './datasetsFacets/DatasetsFacets.vue';
import Pagination from '../widgets/Pagination.vue';
import SelectedFacetsOverview from '../facets/SelectedFacetsOverview';
import AppLink from '../widgets/AppLink.vue';
import { getTranslationFor, truncate, getImg } from '../utils/helpers';
import DatasetsTopControls from "../datasets/DatasetsTopControls.vue";
import ResourceFilters from "../resources/resourceFilters/ResourceFilters.vue";
import DatasetList from './DatasetList.vue';
import { useDatasetsHead } from '../composables/head';

// Generic Resource stores
import { useResourcesStore } from '../store/resourcesStore';

export default {
  name: 'Datasets',
  components: {
    ResourceFilters,
    DatasetsTopControls,
    appLink: AppLink,
    selectedFacetsOverview: SelectedFacetsOverview,
    datasetsFacets: DatasetsFacets,
    pagination: Pagination,
    DatasetList,
  },
  props: {
    infiniteScrolling: {
      type: Boolean,
      default: false,
    },
    /**
     * @description Sets the catalog filter to a fixed catalog id. Disables the catalog facet and hides the facet in the selected facets overview.
     * @dev Use this prop if you want to use this component in a catalog page context where the catalog is already known (e.g., provider's page).
     */
    fixedCatalogFilter: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      baseUrl: this.$env.api.baseUrl,
      debouncedOnBottomScroll: debounce(this.onBottomScroll, 500),
      facetFields: [],
      lang: this.locale,
      filterCollapsed: true,
      catalogAllowed: false,
      useDatasetFacets: this.$env.content.datasets.facets.useDatasetFacets,
      useFeed: this.$env.content.datasets.useFeed,
    };
  },
  computed: {
    ...mapGetters('catalogDetails', [
      'getCatalog',
    ]),
    ...mapGetters('datasets', [
      'getDatasets',
      'getDatasetsCount',
      'getLimit',
      'getLoading',
      'getOffset',
      'getPage',
      'getPageCount',
      'getMinScoring',
    ]),
    ...mapGetters('datasets', {
      // Rename getters to something different because we'll perform some modifications on them.
      // These modifications involve removing catalog related information from facets for fixed catalog filter mode
      getAllAvailableFacetsOriginal: 'getAllAvailableFacets',
      getFacetsOriginal: 'getFacets',
    }),
    showCatalogDetails() {
      return !isNil(this.$route.params.ctlg_id) || this.fixedCatalogFilter;
    },
    /**
     * @description Returns the current page.
     * @returns {Number}
     *
     * @deprecated use getPage from datasets store instead
     */
    page() {
      return this.$route.query.page;
    },
    /**
     * @description Returns the active facets according to the route parameters.
     * @returns {Object}
     */
     facets() {
      const facetFields = this.$env.content.datasets.facets.defaultFacetOrder;
      const wantsToLoadCatalogByParamOrProp = this.showCatalogDetails;

      const facetObj = facetFields.reduce((acc, field) => {
        acc[field] = (wantsToLoadCatalogByParamOrProp && field === 'catalog' && !this.fixedCatalogFilter)
          ? [this.$route.params.ctlg_id || undefined]
          : this.getUrlFacetsOrDefault(field);

        return acc;
      }, {});

      // if fixedCatalogFilter is set, then set it as superCatalog
      // requirement by bayern
      const facetObjWithMaybeDefaultSuperCatalog = this.fixedCatalogFilter
        ? {
          ...facetObj,
          superCatalog: [this.fixedCatalogFilter],
        }
        : facetObj;

        return facetObjWithMaybeDefaultSuperCatalog;
    },


    getAllAvailableFacets() {
      return this.showCatalogDetails
        ? this.getAllAvailableFacetsOriginal.filter(facet => facet.id !== 'catalog')
        : this.getAllAvailableFacetsOriginal;
    },

    getFacets() {
      // Returns a record of facets with the catalog facet removed if we're in fixed catalog filter mode
      return this.showCatalogDetails
        ? {
          ...this.getFacetsOriginal,
          catalog: []
        }
        : this.getFacetsOriginal;
    },

    currentSearchQuery() {
      return this.$route.query.query;
    },
    showScoreDisclaimer() {
      return this.getMinScoring > 0;
    },
    dataScope() {
      if (!this.$route.query.dataScope) return null;
      if (isArray(this.$route.query.dataScope) && this.$route.query.dataScope.length > 0) return this.$route.query.dataScope[0];
      if (isArray(this.$route.query.dataScope) && this.$route.query.dataScope.length === 0) return null;
      return this.$route.query.dataScope;
    },
    getSelectedResource() {
      return this.resourcesStore.getters.getSelectedResource;
    },
  },
  methods: {
    isNil,
    ...mapActions('datasets', [
      'loadDatasets',
      'loadAdditionalDatasets',
      'setPage',
      'setQuery',
      'setSort',
      'addFacet',
      'removeFacet',
      'setFacets',
      'setFacetOperator',
      'setFacetGroupOperator',
      'setDataServices',
      'setPageCount',
      'setLimit',
      'setLoading',
      'setDataScope',
    ]),
    // The imported Lodash has function. Must be defined in Methods so we can use it in template
    has,
    isArray,
    truncate,
    getTranslationFor,
    getImg,
    /**
     * @description Handler-function for the scroll event.
     */
    onScroll() {
      const items = this.$el.querySelectorAll('.dataset');
      const lastItem = items[items.length - 1];
      if (lastItem) {
        const lastItemPos = lastItem.getBoundingClientRect();
        if (lastItemPos.bottom - window.innerHeight <= 0) {
          this.debouncedOnBottomScroll();
        }
      }
    },
    /**
     * @description Handler-function when bottom of the page is reached.
     */
    onBottomScroll() {
      this.$nextTick(() => {
        this.$Progress.start();
        this.loadAdditionalDatasets()
          .then(() => {
            this.$Progress.finish();
          })
          .catch(() => {
            this.$Progress.fail();
          });
      });
    },
    initLimit() {
      const limit = parseInt(this.$route.query.limit, 10);
      if (limit > 0) this.setLimit(limit);
    },
    setPageLimit(value) {
      this.setLimit(value);
      this.initDatasets();
    },
    initDataScope() {
      this.setDataScope(this.dataScope);
    },
    initPage() {
      const page = parseInt(this.$route.query.page, 10);
      if (page > 0) this.setPage(page);
      else this.setPage(1);
    },
    initQuery() {
      let query = this.$route.query.query;
      
      if (!query) query = '';

      this.setQuery(query);
    },
    initSort() {
      let sort = this.$route.query.sort;
      
      if (!sort) sort = '';

      this.setSort(sort);
    },
     initFacets() {
      const fields = this.$env.content.datasets.facets.defaultFacetOrder;
      const facetsFromRouteParams = this.facets;

      this.facetFields.push(...fields);

      // Get fields that don't exist in the router query
      const fieldsNotInRouterQuery = fields.filter(field => {
        const fieldExists = facetsFromRouteParams[field] && facetsFromRouteParams[field].length > 0;
        return !fieldExists && !this.$route.query[field];
      });

      // Construct route query parameters to be added
      const routeQueryParamsToBeAdded = fieldsNotInRouterQuery.reduce((acc, field) => {
        acc[field] = [];
        return acc;
      }, {});
      // Add the route query params that are missing
      if (Object.keys(routeQueryParamsToBeAdded) > 0) {
        this.$router.push({query: {...this.$route.query, ...routeQueryParamsToBeAdded}});
      }

      this.setFacets(facetsFromRouteParams);
    },
    getUrlFacetsOrDefault(field) {
      const urlFacets = this.$route.query[field];
      return Array.isArray(urlFacets) ? urlFacets : (urlFacets ? [urlFacets] : []);
    },
    initFacetOperator() {
      // Always set facet operator to AND when in catalog details mode
      if (this.showCatalogDetails) this.setFacetOperator('AND');
      else {
        const op = this.$route.query.facetOperator;
        if (op === 'AND' || op === 'OR') this.setFacetOperator(op);
      }
    },
    initFacetGroupOperator() {
      // The facetGroupOperator should be the same as the facetOperator
      // Always set facet operator to AND when
      // in catalog details mode
      if (this.showCatalogDetails) this.setFacetGroupOperator('AND');
      else {
        const op = this.$route.query.facetOperator;
        if (op === 'AND' || op === 'OR') this.setFacetGroupOperator(op);
      }
    },
    /**
     * @descritption Initialize the active data services facet by checking the route parameters
     */
    initDataServices() {
      const ds = this.$route.query.dataServices;
      if (ds === 'true' || ds === 'false') this.setDataServices(ds);
      else {
        this.setDataServices('false');
      }
    },
    initDatasets() {
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.$Progress.start();
          this.loadDatasets({locale: this.$route.query.locale})
            .then(() => {
              this.setPageCount(Math.ceil(this.getDatasetsCount / this.getLimit));
              this.$Progress.finish();
              $('[data-toggle="tooltip"]').tooltip({
                container: 'body',
              });
            })
            .catch((error) => {
              console.error(error)
              this.$Progress.fail();
            })
            .finally(() => this.$root.$emit('contentLoaded'));
        });
      });
    },
    initInfiniteScrolling() {
      if (this.infiniteScrolling) window.addEventListener('scroll', this.onScroll);
    },
    getFileTypeColor(format) {
      return fileTypes.getFileTypeColor(format);
    },
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    page(pageStr) {
      const page = parseInt(pageStr, 10);
      if (page > 0) this.setPage(page);
      else this.setPage(1);
    },
    dataScope: {
      handler() {
        this.initDataScope();
      },
      deep: true,
    },
  },
  created() {
    this.initDataScope();
    this.initLimit();
    this.initPage();
    this.initQuery();
    this.initSort();
    this.initFacetOperator();
    this.initFacetGroupOperator();
    this.initDataServices();
    this.initFacets();
    this.initDatasets();
    this.initInfiniteScrolling();

    if (this.resourcesStore.getters.getAvailableResources.length > 0) {
      this.resourcesStore.mutations.setSelectedResource('datasets');
    } else {
      this.resourcesStore.actions.loadAvailableResources()
        .then(() => {
            this.resourcesStore.mutations.setSelectedResource('datasets');
        });
    }
  },
  mounted() {
    // This is supposed to fix the browser issue (https://gitlab.fokus.fraunhofer.de/piveau/organisation/piveau-scrum-board/-/issues/2344)
    if (this.$route.query.refresh === 'true') {
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.loadDatasets({locale: this.$route.query.locale})
              .then(() => {
                this.$router.push({query: {locale: this.$route.query.locale}});
              })
              .catch(() => {
                this.$Progress.fail();
              });
        });
      });
    }
  },
  beforeUnmount() {
    $('.tooltip').remove();
    if (this.infiniteScrolling) window.removeEventListener('scroll', this.onScroll);
  },
  setup() {
    useDatasetsHead();

    // Make store available in component
    const resourcesStore = useResourcesStore();
    return { resourcesStore };
  },
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

.content {
  padding: 30px 30px 0 30px;
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: white;
}

.router-link-active {
  color: #175baf !important;
  border: none !important;
  border-bottom: 2px solid #175baf !important;
}

.router-link-inactive {
  color: rgba(0, 0, 0, 0.7);
  border: none !important;

  &:hover {
    color: #175baf;
  }
}

.material-icons.small-icon {
  font-size: 20px;
}

@media screen and (min-width: 768px) {
  #datasetFacets {
    display: block
  }
}
</style>
