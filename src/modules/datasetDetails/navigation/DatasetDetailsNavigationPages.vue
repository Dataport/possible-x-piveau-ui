<template>
  <nav>
    <ul class="menu m-0 list-inline list-unstyled navbar-nav mr-auto">
      <li v-for="(page, index) in pages" :key="index"
        class="mr-2 list-inline-item nav-item text-nowrap"
      >
        <dataset-details-navigation-page
          :path="page.path"
          :title="page.title"
          :tooltip="page.tooltip"
          :exact="page.exact"
          class="dsd-nav-button"
        />
      </li>
    </ul>
  </nav>
</template>

<script>
import {mapGetters} from "vuex";
import Vue from "vue";
export default {
  name: "DatasetDetailsNavigationPages",
  computed: {
    ...mapGetters('datasetDetails', [
      'getID'
    ]),
    pages() {
      const id = this.getID;
      const createPage = (key, noPathKey, exact) => ({
        path: `/datasets/${id}${noPathKey ? "" : `/${key}`}`,
        title: Vue.i18n.t(`message.datasetDetails.subnav.${key}`),
        tooltip: Vue.i18n.t(`message.tooltip.datasetDetails.${key}`),
        exact
      });
      return [
        createPage("dataset", true, true),
        createPage("categories"),
        createPage("similarDatasets"),
        createPage("quality")
      ];
    }
  }
}
</script>

<style scoped lang="scss">
.nav-link {
  text-decoration: underline;
}
</style>
