<template>
  <div class="dsd-feature">
    <dataset-details-feature-header
      :title="`${$t('message.datasetDetails.isUsedBy')} (${getExtendedMetadata ? getExtendedMetadata.is_used_by.toLocaleString('fi') : 0})`"
      :arrowDown="!isUsedBy.isVisible"
      tag="documentation-toggle"
      :onClick="toggleIsUsedBy"
    />
    <span v-if="isUsedBy.isVisible" class="list list-unstyled col-12">
      <hr>
        <ul class="sectionList" v-if="getExtendedMetadata.is_used_by.length != null || getExtendedMetadata.is_used_by != undefined ">
            <li v-for="(link, i) in getExtendedMetadata.is_used_by" :key="i">
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
// import DatasetDetailsFeatureHeader from "../../datasetDetails/features/DatasetDetailsFeatureHeader";

export default {
  name: "DatasetDetailsIsUsedBy",
  // components: {DatasetDetailsFeatureHeader},
  data() {
    return {
      isUsedBy: {
        isVisible: this.$env.content.datasetDetails.isUsedBy.isVisible,
      }
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getExtendedMetadata'
    ])
  },
  methods: {
    toggleIsUsedBy() {
      this.isUsedBy.isVisible = !this.isUsedBy.isVisible;
    }
  }
}
</script>

<style scoped lang="scss">
.heading {
  cursor: pointer;
}
</style>
