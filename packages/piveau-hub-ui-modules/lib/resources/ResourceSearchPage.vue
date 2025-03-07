<template>
  <div class="resource-container d-flex flex-column p-0 mr-5 bg-transparent">
    <div class="container-fluid resource content">

      <!-- RESOURCE TITLE -->
      <h1 class="row col-12 page-title text-primary">{{ $t(`message.header.navigation.data.${getSelectedResource}`) }}</h1>

      <!-- RESOURCE SEARCH PAGE -->
      <div class="row">

        <!-- RESOURCE FACETS -->
        <ResourceFacets 
          v-if="useResourceFacets" 
          id="resourceFacets" 
          class="col-md-3 col-12 mb-3 mb-md-0"
          @resetFilters="initFilters"
        ></ResourceFacets>

        <!-- RESOURCES -->
        <section class="col-md col-12">

          <!-- RESOURCE FILTERS -->
          <ResourceFilters></ResourceFilters>

          <!-- RESOURCE FOUND MSG -->
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

          <!-- SELECTED RESOURCE FACETS -->
          <ResourceFacetsSelected v-if="getSelectedFacets" :selected-facets="getSelectedFacets" :available-facets="getFacets"></ResourceFacetsSelected>
          
          <!-- RESOURCE RESULTS -->
          <div v-if="!getLoading">
            <ResourceInfoBoxList :resources="getResults" :raw-selected-resource="getRawSelectedResource"></ResourceInfoBoxList>
          </div>

          <!-- LOADING SPINNER -->
          <div class="loading-spinner mx-auto mt-3 mb-3" v-if="getLoading"></div>
        </section>
      </div>

      <!-- PAGINATION -->
      <div class="row" v-if="usePagination">
        <div class="column col-12 col-md-9 offset-md-3">
          <Pagination class="mt-5"
            :items-count="getResultsCount"
            :items-per-page="getLimit"
            :get-page="getPage"
            :get-page-count="getPageCount"
            @setPage="setPage"
            @setPageLimit="setLimit"
          ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, onBeforeUnmount } from 'vue';
import $ from 'jquery';

import { useRoute, useRouter } from 'vue-router';
import { useResourcesStore } from '../store/resourcesStore';
import { useRuntimeEnv } from '../composables/useRuntimeEnv';

import Pagination from '../widgets/Pagination.vue';
import ResourceFacetsSelected from './resourceFacets/ResourceFacetsSelected.vue';

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
    let selectedResource = resourceMapping[route.params.resource_type as keyof object]
    resourcesStore.mutations.setSelectedResource(selectedResource);
    initResources();
    initFilters();
  } else router.replace({ 
    name: 'ResourceSearchPage', 
    params: { resource_type: getAvailableResources.value?.at(0) },
    query: Object.assign({}, route.query)
  });
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
          $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
          });
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

onBeforeUnmount(() => {
  $('.tooltip').remove();
});
</script>