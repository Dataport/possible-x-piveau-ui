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
  
<script>
import { useResourcesStore } from '../store/resourcesStore';

import AppLink from "../widgets/AppLink.vue";

export default {
  name: "ResourceTopControls",
  components: {
    AppLink
  },
  data() {
    return {
      useFeed: this.$env.content.datasets.useFeed,
      baseUrl: this.$env.api.baseUrl,
    }
  },
  computed: {
    getSelectedResource() {
      return this.resourcesStore.getters.getSelectedResource;
    },
    getLimit() {
      return parseInt(this.$route.query.limit || this.resourcesStore.getters.getLimit);
    },
    getPage() {
      return parseInt(this.$route.query.page || this.resourcesStore.getters.getPage);
    },
    getFacets() {
      return this.resourcesStore.getters.getFacets;
    },
    getSort() {
      return this.resourcesStore.getters.getSort;
    },
    showFeed() {
      return this.useFeed && this.getSelectedResource === 'datasets';
    },
  },
  methods: {
    getFeedLink(format) {
      return `${this.baseUrl}${this.$route.query.locale}/feeds/datasets.${format}`;
    },
    getFeedQuery() {
      const feedQuery = {};
      const query = this.$route?.query
      if (query?.query) feedQuery.q = query.query;
      if (this.facetsNotEmpty() && JSON.stringify(this.getFacets)) feedQuery.facets = JSON.stringify(this.getFacets);
      if (this.getPage) feedQuery.page = Math.max(this.getPage - 1, 0);
      if (this.getLimit) feedQuery.limit = this.getLimit;
      feedQuery.facetOperator = query?.facetOperator || 'AND';
      feedQuery.facetGroupOperator = query?.facetOperator || 'AND';
      feedQuery.dataServices = query?.dataServices || 'false';
      if (this.getSort) feedQuery.sort = this.getSort;
      return feedQuery;
    },
    facetsNotEmpty() {
      return Object.values(this.getFacets).some(facet => facet.length > 0);
    }
  },
  setup() {
    const resourcesStore = useResourcesStore();
    return { resourcesStore };
  },
}
</script>  