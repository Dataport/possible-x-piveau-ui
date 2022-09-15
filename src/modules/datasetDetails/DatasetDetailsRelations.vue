<template>
  <div class="row mt-5">
    <div class="d-none d-lg-block col-1 my-auto pr-0 text-right"
         @click="toggleRelatedResources()">
        <span class="arrow text-dark"
              v-if="!relatedResources.isVisible">
          <i class="material-icons">keyboard_arrow_down</i>
        </span>
      <span class="arrow text-dark" v-else>
          <i class="material-icons">keyboard_arrow_up</i>
        </span>
    </div>
    <div class="col-11 py-2 bg-white">
      <h2 class="heading"
          data-cy="documentation-toggle"
          @click="toggleRelatedResources()">{{ $t('message.datasetDetails.relatedResources') }} ({{ getRelations ? getRelations.length.toLocaleString('fi') : 0 }})</h2>
    </div>
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

export default {
  name: "DatasetDetailsRelations",
  data() {
    return {
      ...mapGetters('datasetDetails', [
        'getRelations'
      ]),
      relatedResources: {
        isVisible: this.$env.datasetDetails.relatedResources.isVisible,
      }
    };
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
