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
            <selectedFacetsOverview v-if="getSelectedFacets" :selected-facets="getSelectedFacets" :available-facets="getFacets"></selectedFacetsOverview>
            
            <!-- RESOURCE RESULTS -->
            <template v-if="!getLoading">
              <resource-info-box-list :resources="getResults" :raw-selected-resource="getRawSelectedResource"></resource-info-box-list>
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

<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { useResourcesStore } from '../store/resourcesStore';
import { useRuntimeEnv } from '../composables/useRuntimeEnv';

import Pagination from '../widgets/Pagination.vue';
import SelectedFacetsOverview from '../facets/SelectedFacetsOverview.vue';

import ResourceTopControls from "./ResourceTopControls.vue";
import ResourceInfoBoxList from "./resourceInfoBox/ResourceInfoBoxList.vue";
import ResourceFilters from "./resourceFilters/ResourceFilters.vue";
import ResourceFacets from "./resourceFacets/ResourceFacets.vue";

const route = useRoute();
const router = useRouter();
const resourcesStore = useResourcesStore();
const ENV = useRuntimeEnv();

let isLoading = ref(false);
const defaultLimit = ENV.content.resources.limit.defaultLimit;
const defaultSort = ENV.content.resources.sort.defaultSort;
const useResourceFacets = ENV.content.resources.facets.useResourceFacets;
const usePagination = ENV.routing.pagination.usePagination;
const resourceMapping = ENV.content.resources.resourceMapping;

function initResourceSearchPage() {
  if (route.params.hasOwnProperty('resource_type')) {
    let selectedResource = resourceMapping[route.params.resource_type]
    resourcesStore.mutations.setSelectedResource(selectedResource);
    initResources();
    initFilters();
  } else router.push({ name: 'ResourceSearchPage', params: { resource_type: getAvailableResources.value[0].resource }});
};

function initResources() {
  nextTick(() => {
    nextTick(() => {
      // $Progress.start();
      isLoading.value = true;
      resourcesStore.actions.loadResults()
        .then(() => {
          // $Progress.finish();
          isLoading.value = false;
        })
        .catch((error) => {
          console.error(error)
          // $Progress.fail();
          isLoading.value = false;
        })
    });
  });
};

function initFilters() {
  initQuery();
  initLimit();
  initPage();
  initSort();
};

function initQuery() {
  let query = route.query.query || '';
  setQuery(query);
};

function initLimit() {
  let limit = Number(route.query.limit || defaultLimit);
  setLimit(limit);
};

function initPage() {
  let page = Number(route.query.page || 1);
  setPage(page);
};

function initSort() {
  let sort = route.query.sort || defaultSort;
  setSort(sort);
};

function setQuery(query: any) {
  resourcesStore.mutations.setQuery(query);
};

function setLimit(limit: any) {
  resourcesStore.mutations.setLimit(limit);
};

function setPage(page: any) {
  resourcesStore.mutations.setPage(page);
};

function setSort(sort: any) {
  resourcesStore.mutations.setSort(sort);
};


const getLoading = computed(() => {
  return isLoading.value;
});

const getSelectedResource = computed(() => {
  return resourcesStore.getters.getSelectedResource;
});

const getRawSelectedResource = computed(() => {
  return resourcesStore.getters.getRawSelectedResource;
});

const getAvailableResources = computed(() => {
  return resourcesStore.getters.getAvailableResources;
});

const getResults = computed(() => {
  return resourcesStore.getters.getResults;
});

const getResultsCount = computed(() => {
  return Number(resourcesStore.getters.getResultsCount);
});

const getLimit = computed(() => {
  return Number(route.query.limit || resourcesStore.getters.getLimit);
});

const getPage = computed(() => {
  return Number(route.query.page || resourcesStore.getters.getPage);
});

const getPageCount = computed(() => {
  return Math.ceil(Number(getResultsCount.value) / Number(getLimit.value));
});

const getFacets = computed(() => {
  return resourcesStore.getters.getFacets;
});

const getSelectedFacets = computed(() => {
  return resourcesStore.getters.getSelectedFacets;
});

// TODO: Improve initial loading mechanism
if (getAvailableResources.value.length > 0) {
  initResourceSearchPage();
} else {
  resourcesStore.actions.loadAvailableResources()
  .then(() => {
    if (getAvailableResources.value.length > 0) {
      initResourceSearchPage();
    } else {
      console.error('No resources available. \n Waiting for all requests to be finished ...');
    }
  });
}
</script>