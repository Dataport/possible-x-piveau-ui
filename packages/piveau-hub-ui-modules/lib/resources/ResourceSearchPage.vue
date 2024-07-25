<template>
  <div class="resource-container d-flex flex-column p-0 px-3 mr-5 bg-transparent">
    <div class="container-fluid resource content">
      <slot
        name="content"
        :resource-count="getResultsCount"
        :resource="getResults"
        :locale="$route.query.locale"
        :loading="getLoading"
        :use-resource-facets="useResourceFacets"
        :facets="getFacets"
      >
        <resource-top-controls
          :resource="getSelectedResource"
          :facets="getFacets"
          :getPage="getPage"
          :getLimit="getLimit"
          class="resource-top-controls"
        ></resource-top-controls>
        <div class="row">
          <resource-facets 
            v-if="useResourceFacets" 
            id="resourceFacets" 
            class="col-md-2 col-12 mb-3 mb-md-0"
            :resource="getSelectedResource"
          ></resource-facets>
          <section class="col-md-10 col-12">
            <slot name="title">
              <div class="row">
                <h1 class="col-12 page-title text-primary">{{ $t(`message.header.navigation.data.${getSelectedResource}`) }}</h1>
              </div>
            </slot>
            <slot name="resource-filters">
              <resource-filters :resource="getSelectedResource"></resource-filters>
            </slot>
            <slot name="resource-found" :data="{
              loading: getLoading,
              resourceCount: getResultsCount,
              resourceCountFormatted: getResultsCount,
              loadingMessage: $t('message.resources.loadingMessage', { resource: $t(`message.header.navigation.data.${getSelectedResource}`) }),
              countMessage: $t('message.resources.countMessage', { resource: $t(`message.header.navigation.data.${getSelectedResource}`) }),
            }">
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
            <selectedFacetsOverview v-if="getFacets" :selected-facets="getFacets" :available-facets="getFacets"></selectedFacetsOverview>
            <template v-if="!getLoading">
              <resource-list :resources="getResults"></resource-list>
            </template>
            <div class="loading-spinner mx-auto mt-3 mb-3" v-if="getLoading"></div>
          </section>
        </div>
      </slot>
      <div class="row">
        <div class="column col-12 col-md-9 offset-md-3">
          <pagination class="mt-3"
            :items-count="getResultsCount"
            :items-per-page="getLimit"
            :get-page="getPage"
            :get-page-count="getPageCount"
            @setPageLimit="setPageLimit"
          ></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { has, isArray, isNil } from 'lodash-es';
import { getTranslationFor, truncate, getImg } from '../utils/helpers';

// Components
import AppLink from '../widgets/AppLink.vue';
import Pagination from '../widgets/Pagination.vue';
import SelectedFacetsOverview from '../facets/SelectedFacetsOverview';

// Generic Resource components
import ResourceTopControls from "../resources/ResourceTopControls.vue";
import ResourceFilters from "../resources/ResourceFilters.vue";
import ResourceFacets from "../resources/ResourceFacets.vue";
import ResourceList from "../resources/ResourceList.vue";

// Generic Resource stores
import { useResourcesStore } from '../store/resourcesStore';

export default {
  name: 'ResourceSearchPage',
  components: {
    AppLink,
    Pagination,
    SelectedFacetsOverview,
    ResourceTopControls,
    ResourceFilters,
    ResourceFacets,
    ResourceList,
  },
  props: {},
  data() {
    return {
      isLoading: false,
      facetFields: [],
      filterCollapsed: true,
      useResourceFacets: this.$env.content.resources.facets.useResourceFacets,
    };
  },
  computed: {
    getLoading() {
      return this.isLoading;
    },
    getCurrentSearchQuery() {
      return this.$route.query.query;
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
      return this.resourcesStore.getters.getResultsCount;
    },
    getLimit() {
      return parseInt(this.$route.query.limit || this.resourcesStore.getters.getLimit);
    },
    getPage() {
      return parseInt(this.$route.query.page || this.resourcesStore.getPage);
    },
    getPageCount() {
      return parseInt(this.resourcesStore.getters.getPageCount);
    },
    getFacets() {
      return {};
    },
  },
  methods: {
    isNil,
    has,
    isArray,
    truncate,
    getTranslationFor,
    getImg,
    initFacets() {
      const fields = this.$env.content.datasets.facets.defaultFacetOrder;
      const facets = [];
 
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
    setPageLimit(limit) {
      this.resourcesStore.mutations.setLimit(limit);
    },
  },
  watch: {},
  setup() {
    // Make store available in component
    const resourcesStore = useResourcesStore();
    return { resourcesStore };
  },
  created() {
    // Setup store
    this.resourcesStore.actions.loadAvailableResources()
      .then(() => {
        // Init data for selected resource
        if (this.$route.params.hasOwnProperty('resource_id')) {
          this.resourcesStore.mutations.setSelectedResource(this.$route.params.resource_id);
          this.initFacets();
          this.initResources();
        } else if (this.getAvailableResources.length > 0) {
          this.$router.push({ name: 'ResourceSearchPage', params: { resource_id: this.getAvailableResources[1] } });
        } else {
          alert('No resources available !');
        }
      });
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.alert-primary {
  color: #042648;
  background-color: #cddbe8;
  border-color: #baccdf;
}

.page-title {
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
