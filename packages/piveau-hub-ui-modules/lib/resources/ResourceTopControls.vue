<template>
  <div class="container-fluid">
    <sub-navigation>
      <div class="row">
        <div v-if="showFeed" class="navbar-datasets-feed navbar-nav align-items-center justify-content-end">
          <div class="nav-item dropdown">
            <div class="nav-link dropdown-toggle cursor-pointer"
                  id="dropdown-feeds" data-toggle="dropdown"
                  aria-haspopup="true" aria-expanded="false">
              <ins>{{ $t('message.datasets.datasetsFeed') }}</ins>
            </div>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown-feeds">
              <app-link class="dropdown-item text-decoration-none"
                :path="getFeedLink('rss')"
                :query="getFeedQuery()"
                target="_blank"
                matomo-track-page-view
              >RSS Feed</app-link>
              <app-link class="dropdown-item text-decoration-none"
                :path="getFeedLink('atom')"
                :query="getFeedQuery()"
                target="_blank"
                matomo-track-page-view
              >ATOM Feed</app-link>
            </div>
          </div>
        </div>
      </div>
    </sub-navigation>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

import { useRoute } from 'vue-router';
import { useResourcesStore } from '../store/resourcesStore';

import { useRuntimeEnv } from '../composables/useRuntimeEnv';

import AppLink from "../widgets/AppLink.vue";

const route = useRoute();
const resourcesStore = useResourcesStore();

const ENV = useRuntimeEnv();

const useFeed = ref(ENV.content.datasets.useFeed);
const baseUrl = ref(ENV.api.baseUrl);


function getFeedLink(format: string) {
  return `${baseUrl}${route.query.locale}/feeds/datasets.${format}`;
};

function getFeedQuery() {
  const feedQuery: any = {};
  const query = route?.query
  if (query?.query) feedQuery.q = query.query;
  if (facetsNotEmpty() && JSON.stringify(getFacets)) feedQuery.facets = JSON.stringify(getFacets);
  if (getPage) feedQuery.page = Math.max(Number(getPage) - 1, 0);
  if (getLimit) feedQuery.limit = getLimit;
  feedQuery.facetOperator = query?.facetOperator || 'AND';
  feedQuery.facetGroupOperator = query?.facetOperator || 'AND';
  feedQuery.dataServices = query?.dataServices || 'false';
  if (getSort) feedQuery.sort = getSort;
  return feedQuery;
};

function facetsNotEmpty() {
  return Object.values(getFacets).some(facet => facet.length > 0);
};

const getSelectedResource = computed(() => {
  return resourcesStore.getters.getSelectedResource;
});

const getLimit = computed(() => {
  return Number(route.query?.limit || resourcesStore.getters.getLimit);
});

const getPage = computed(() => {
  return Number(route.query.page || resourcesStore.getters.getPage);
});

const getFacets = computed(() => {
  return resourcesStore.getters.getFacets;
});

const getSort = computed(() => {
  return resourcesStore.getters.getSort;
});

const showFeed = computed(() => {
  return useFeed && getSelectedResource.value === 'datasets';
});
</script>
  