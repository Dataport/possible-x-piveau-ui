<template>
  <div class="dsd-feature">
    <dataset-details-feature-header
      :title="`${$t('message.datasetDetails.relatedResources')} (${getRelations ? getRelations.length.toLocaleString('fi') : 0})`"
      :arrowDown="!relatedResources.isVisible"
      tag="documentation-toggle"
      :onClick="toggleRelatedResources"
    />
    <span v-if="relatedResources.isVisible" class="list list-unstyled col-12">
      <hr>
        <ul class="sectionList" v-if="getRelations.length != null || getRelations != undefined ">
          <li v-for="(link, i) in getRelations" :key="i">
            <a :href="link" target="_blank">{{link}}</a>
          </li>
        </ul>
      <hr>
    </span>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
// DatasetDetailsFeatureHeader is imported globally
// import DatasetDetailsFeatureHeader
//   from "../../datasetDetails/features/DatasetDetailsFeatureHeader";

export default {
  name: "DatasetDetailsRelations",
  // components: {DatasetDetailsFeatureHeader},
  data() {
    return {
      relatedResources: {
        isVisible: this.$env.content.datasetDetails.relatedResources.isVisible,
      }
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getRelations'
    ])
  },
  methods: {
    toggleRelatedResources() {
      this.relatedResources.isVisible = !this.relatedResources.isVisible;
    }
  }
}
</script>

<style scoped lang="scss">
.heading {
  cursor: pointer;
}
</style>
