<template>
  <sub-navigation>
    <div class="container-fluid justify-content-between">
      <div class="navbar-nav align-items-center justify-content-end">
        <div class="nav-item dropdown">
          <div v-if="useFeed" class="nav-link dropdown-toggle cursor-pointer"
               id="dropdown-feeds" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
            <ins>{{ $t('message.datasets.datasetsFeed') }}</ins>
          </div>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdown-feeds">
            <app-link class="dropdown-item text-decoration-none"
                      :path="getFeedLink('rss')"
                      :query="getFeedQuery()"
                      target="_blank"
                      matomo-track-page-view>
              RSS Feed</app-link>
            <app-link class="dropdown-item text-decoration-none"
                      :path="getFeedLink('atom')"
                      :query="getFeedQuery()"
                      target="_blank"
                      matomo-track-page-view>
              ATOM Feed</app-link>
          </div>
        </div>
      </div>
    </div>
  </sub-navigation>
</template>

<script>
import AppLink from "@/modules/widgets/AppLink";
import SubNavigation from "@/modules/navigation/SubNavigation";
import {mapGetters} from "vuex";

export default {
  name: "DataSetsTopControls",
  components: {SubNavigation, AppLink},
  props: [
    "facets",
    "getPage",
    "getLimit"
  ],
  data() {
    return {
      useFeed: this.$env.datasets.useFeed,
      baseUrl: this.$env.api.baseUrl,
    }
  },
  computed: {
    ...mapGetters('datasets', [
      'getSort'
    ])
  },
  methods: {
    getFeedLink(format) {
      return `${this.baseUrl}${this.$route.query.locale}/feeds/datasets.${format}`;
    },
    getFeedQuery() {
      const feedQuery = {};
      const query = this.$route?.query
      if (query?.query) feedQuery.q = query.query;
      if (this.facetsNotEmpty() && JSON.stringify(this.facets)) feedQuery.facets = JSON.stringify(this.facets);
      if (this.getPage) feedQuery.page = Math.max(this.getPage - 1, 0);
      if (this.getLimit) feedQuery.limit = this.getLimit;
      feedQuery.facetOperator = query?.facetOperator || 'AND';
      feedQuery.facetGroupOperator = query?.facetOperator || 'AND';
      feedQuery.dataServices = query?.dataServices || 'false';
      if (this.getSort) feedQuery.sort = this.getSort;
      return feedQuery;
    },
    facetsNotEmpty() {
      return Object.values(this.facets).some(facet => facet.length > 0);
    }
  }
}
</script>

