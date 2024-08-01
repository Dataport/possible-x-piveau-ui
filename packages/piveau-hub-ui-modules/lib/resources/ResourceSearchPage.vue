<template>
  <div class="resource-container d-flex flex-column p-0 px-3 mr-5 bg-transparent">
    <div class="container-fluid resource content">
      <slot name="content">
        
      <!-- RESOURCE TOP CONTROLS -->
        <resource-top-controls class="resource-top-controls"></resource-top-controls>
        
        <div class="row">

          <!-- RESOURCE FACETS -->
          <resource-facets 
            v-if="useResourceFacets" 
            id="resourceFacets" 
            class="col-md-3 col-12 mb-3 mb-md-0"
            @resetFilters="initFilters"
          ></resource-facets>

          <!-- RESOURCES -->
          <section class="col-md col-12">

            <!-- RESOURCE TITLE -->
            <slot name="title">
              <div class="row">
                <h1 class="col-12 page-title text-primary">{{ $t(`message.header.navigation.data.${getSelectedResource}`) }}</h1>
              </div>
            </slot>

            <!-- RESOURCE FILTERS -->
            <slot name="resource-filters">
              <resource-filters></resource-filters>
            </slot>

            <!-- RESOURCE FOUND MSG -->
            <slot name="resource-found">
              <div class="resource-found alert alert-primary mt-3 d-flex flex-row" role="status"
                   :class="{ 'alert-danger': getResultsCount <= 0 && !getLoading}">
                <div>
                  {{
                    getLoading 
                    ? $t('message.resources.loadingMessage', { resource: $t(`message.header.navigation.data.${getSelectedResource}`) }) 
                    : `${$t('message.resources.countMessage', { resource: $t(`message.header.navigation.data.${getSelectedResource}`) })} (${getResultsCount})`
                  }}
                </div>
                <div class="loading-spinner ml-3" v-if="getLoading"></div>
              </div>
            </slot>

            <!-- SELECTED RESOURCE FACETS -->
            <selectedFacetsOverview v-if="getFacets" :selected-facets="getFacets" :available-facets="getFacets"></selectedFacetsOverview>
            
            <!-- RESOURCE RESULTS -->
            <template v-if="!getLoading">
              <resource-info-box-list :resources="getResults"></resource-info-box-list>
            </template>

            <!-- LOADING SPINNER -->
            <div class="loading-spinner mx-auto mt-3 mb-3" v-if="getLoading"></div>
          </section>
        </div>
      </slot>

      <!-- PAGINATION -->
      <div class="row" v-if="usePagination">
        <div class="column col-12 col-md-9 offset-md-3">
          <pagination class="mt-5"
            :items-count="getResultsCount"
            :items-per-page="getLimit"
            :get-page="getPage"
            :get-page-count="getPageCount"
            @setPage="setPage"
            @setPageLimit="setLimit"
          ></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Components
import Pagination from '../widgets/Pagination.vue';
import SelectedFacetsOverview from '../facets/SelectedFacetsOverview';

// Generic Resource components
import ResourceTopControls from "../resources/ResourceTopControls.vue";
import ResourceInfoBoxList from "../resources/resourceInfoBox/ResourceInfoBoxList.vue";
import ResourceFilters from "../resources/resourceFilters/ResourceFilters.vue";
import ResourceFacets from "../resources/resourceFacets/ResourceFacets.vue";

// Generic Resource stores
import { useResourcesStore } from '../store/resourcesStore';

export default {
  name: 'ResourceSearchPage',
  components: {
    Pagination,
    SelectedFacetsOverview,
    ResourceTopControls,
    ResourceFilters,
    ResourceFacets,
    ResourceInfoBoxList,
  },
  props: {},
  data() {
    return {
      isLoading: false,
      defaultLimit: this.$env.content.resources.limit.defaultLimit,
      defaultSort: this.$env.content.resources.limit.defaultSort,
      usePagination: this.$env.content.resources.page.usePagination,
      useResourceFacets: this.$env.content.resources.facets.useResourceFacets,
    };
  },
  computed: {
    getLoading() {
      return this.isLoading;
    },
    getSelectedResource() {
      return this.resourcesStore.getters.getSelectedResource;
    },
    getAvailableResources() {
      return this.resourcesStore.getters.getAvailableResources;
    },
    getResults() {
      return this.resourcesStore.getters.getResults;
    },
    getResultsCount() {
      return parseInt(this.resourcesStore.getters.getResultsCount);
    },
    getLimit() {
      return parseInt(this.$route.query.limit || this.resourcesStore.getters.getLimit);
    },
    getPage() {
      return parseInt(this.$route.query.page || this.resourcesStore.getters.getPage);
    },
    getPageCount() {
      return Math.ceil(this.getResultsCount / this.getLimit);
    },
    getFacets() {
      return {};
    },
  },
  methods: {
    initResourceSearchPage() {
      if (this.$route.params.hasOwnProperty('resource_id')) {
        this.resourcesStore.mutations.setSelectedResource(this.$route.params.resource_id);
        this.initResources();
        this.initFilters();
      } else this.$router.push({ name: 'ResourceSearchPage', params: { resource_id: this.getAvailableResources[0] }});
    },
    initResources() {
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.$Progress.start();
          this.isLoading = true;
          this.resourcesStore.actions.loadResults()
            .then(() => {
              this.$Progress.finish();
              this.isLoading = false;
            })
            .catch((error) => {
              console.error(error)
              this.$Progress.fail();
              this.isLoading = false;
            })
        });
      });
    },
    initFilters() {
      this.initQuery();
      this.initLimit();
      this.initPage();
      this.initSort();
      this.initFacets();
    },
    initQuery() {
      let query = this.$route.query?.query || '';
      this.setQuery(query);
    },
    initLimit() {
      let limit = this.$route.query?.limit || this.defaultLimit;
      this.setLimit(limit);
    },
    initPage() {
      let page = this.$route.query?.page || 1;
      this.setPage(page);
    },
    initSort() {
      let sort = this.$route.query?.sort || this.defaultSort;
      this.setSort(sort);
    },
    initFacets() {
      let facets = this.$route.query?.facets || [];
      this.setFacets(facets);
    },
    setQuery(query) {
      this.resourcesStore.mutations.setQuery(query);
    },
    setLimit(limit) {
      this.resourcesStore.mutations.setLimit(limit);
    },
    setPage(page) {
      this.resourcesStore.mutations.setPage(page);
    },
    setSort(sort) {
      this.resourcesStore.mutations.setSort(sort);
    },
    setFacets(facets) {
      this.resourcesStore.mutations.setFacets(facets);
    },
  },
  watch: {},
  setup() {
    const resourcesStore = useResourcesStore();
    return { resourcesStore };
  },
  created() {
    if (this.getAvailableResources.length > 0) {
      this.initResourceSearchPage();
    } else {
      this.resourcesStore.actions.loadAvailableResources()
      .then(() => {
        if (this.getAvailableResources.length > 0) {
          this.initResourceSearchPage();
        } else {
          console.error('No resources available.');
        }
      });
    }
  },
  mounted() {},
};
</script>./resourceInfoBox/ResourceInfoBoxList.vue