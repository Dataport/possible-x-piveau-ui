<template>
  <nav>
    <ul class="menu m-0 list-inline list-unstyled navbar-nav mr-auto">
      <li v-for="(page, index) in pages" :key="index" 
        class="mr-2 list-inline-item nav-item text-nowrap dsd-nav-button" :class="page.cName"
      >
        <dataset-details-navigation-page
          :path="page.path"
          :title="page.title"
          :tooltip="page.tooltip"
          :exact="page.exact"
        />
      </li>
    </ul>
  </nav>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  name: "DatasetDetailsNavigationPages",
  computed: {
    ...mapGetters('datasetDetails', [
      'getID'
    ]),
    pages() {
      const id = this.getID;
      const createPage = (key, noPathKey, exact, cName) => ({
        path: `/datasets/${id}${noPathKey ? "" : `/${key}`}`,
        title: this.i18n.global.t(`message.datasetDetails.subnav.${key}`),
        tooltip: this.i18n.global.t(`message.tooltip.datasetDetails.${key}`),
        exact,cName
      });
      return [
        createPage("dataset", true, true),
        createPage("categories", false, false, "dsd-nav-cat"),
        createPage("quality"),
        createPage("similarDatasets")
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
