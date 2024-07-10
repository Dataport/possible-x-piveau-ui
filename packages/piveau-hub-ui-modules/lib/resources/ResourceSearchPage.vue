<template>
  <div class="resource-container d-flex flex-column p-0 bg-transparent">
    <resource-top-controls
        :resource="currentResource"
        :facets="facets"
        :getPage="getPage"
        :getLimit="getLimit"
        class="resource-top-controls"
    />
    <div class="container-fluid resource content">
      <slot name="title">
        <h1 class="row col-12 page-title text-primary">{{ $t('message.header.navigation.data.resource') }}</h1>
      </slot>
      <slot
          name="content"
          :resource-count="getResourcesCount"
          :resource="getResults"
          :locale="$route.query.locale"
          :loading="getLoading"
          :use-resource-facets="useResourceFacets"
          :facets="getFacets"
      >
        <div class="row">
          <div class="col d-flex d-md-none justify-content-end flex-wrap">
            <button class="btn btn-primary mb-3 text-right text-white" data-toggle="collapse"
                    data-target="#resourceFacets" data-cy="btn-filter-toggle"
                    @click="filterCollapsed = !filterCollapsed">
              {{ $t('message.resourceFacets.title') }}
              <i class="material-icons small-icon align-bottom" v-if="filterCollapsed">arrow_drop_up</i>
              <i class="material-icons small-icon align-bottom" v-else>arrow_drop_down</i>
            </button>
          </div>
          <resource-facets v-if="useResourceFacets" id="resourceFacets" class="col-md-3 col-12 mb-3 mb-md-0 px-0 collapse"></resource-facets>
          <section class="col-md-9 col-12">
            <slot name="resource-filters">
              <resource-filters :resource="currentResource"></resource-filters>
            </slot>
            <slot name="resource-found" :data="{
              loading: getLoading,
              resourceCount: getResourcesCount,
              resourceCountFormatted: getResourcesCount.toLocaleString('fi'),
              loadingMessage: $t('message.resource.loadingMessage'),
              countMessage: $t('message.resource.countMessage'),
            }">
              <div class="resource-found alert alert-primary mt-3 d-flex flex-row" role="status"
                   :class="{ 'alert-danger': getResourcesCount <= 0 && !getLoading}">
                <div>
                  {{
                    getLoading ? $t('message.resource.loadingMessage') : `${getResourcesCount.toLocaleString('fi')}
                  ${$t('message.resource.countMessage')}`
                  }}
                </div>
                <div class="loading-spinner ml-3" v-if="getLoading"></div>
              </div>
            </slot>
            <selectedFacetsOverview v-if="getFacets" :selected-facets="getFacets"></selectedFacetsOverview>
            <template v-if="!getLoading">
              <resource-list :resource="getResults"></resource-list>
            </template>
            <div class="loading-spinner mx-auto mt-3 mb-3" v-if="getLoading"></div>
          </section>
        </div>
      </slot>
      <div class="row">
        <div class="column col-12 col-md-9 offset-md-3">
          <pagination class="mt-3"
                      :items-count="getResourcesCount"
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
  import {
    has,
    isArray,
    isNil,
  } from 'lodash-es';

  import SelectedFacetsOverview from '../facets/SelectedFacetsOverview';
  import AppLink from '../widgets/AppLink.vue';
  import Pagination from '../widgets/Pagination.vue';
  import { getTranslationFor, truncate, getImg } from '../utils/helpers';

  // Resource components
  import ResourceTopControls from "../resources/ResourceTopControls.vue";
  import ResourceFilters from "../resources/ResourceFilters.vue";
  import ResourceFacets from "../resources/ResourceFacets.vue";

  // Resource store
  import { useResourcesStore } from '../store/resourcesStore';

export default {
  name: 'ResourceSearchPage',
  components: {
    SelectedFacetsOverview,
    ResourceTopControls,
    ResourceFilters,
    ResourceFacets,
    AppLink,
    Pagination,
  },
  props: {},
  data() {
    return {
      facetFields: [],
      filterCollapsed: true,
      useResourceFacets: this.$env.content.resources.facets.useResourceFacets,
    };
  },
  computed: {
    currentResource() {
      return this.resourcesStore.getSelectedResource;
    },
    availableResources() {
      return this.resourcesStore.getAvailableResources;
    },
    currentSearchQuery() {
      return this.$route.query.query;
    },
    getResourcesCount() {
      return 0;
    },
    getResults() {
      this.resourcesStore.getResults;
    }
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
          resourcesStore.loadResults()
            .then(() => {
              this.$Progress.finish();
            })
            .catch((error) => {
              console.error(error)
              this.$Progress.fail();
            })
        });
      });
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
    this.resourcesStore.loadAvailableResources();
    this.resourcesStore.setSelectedResource(this.$route.params.resource_id);

    // Init data for selected resource
    if (this.$route.params.hasOwnProperty('resource_id')) {
      this.initFacets();
      this.initResources();
    } else if (this.availableResources.length > 0) {
      this.$router.push({ name: 'ResourceSearchPage', params: { resource_id: this.availableResources[0] } });
    } else {
      alert('No resources available !');
    }
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
