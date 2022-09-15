<template>
  <div class="mt-5">
    <div class="row">
      <div class="d-none d-lg-block col-1 my-auto pr-0 text-right"
           @click="toggleIsUsedBy()">
          <span class="arrow text-dark"
                v-if="!isUsedBy.isVisible">
            <i class="material-icons">keyboard_arrow_down</i>
          </span>
        <span class="arrow text-dark" v-else>
            <i class="material-icons">keyboard_arrow_up</i>
          </span>
      </div>
      <div class="col-11 py-2 bg-white">
        <h2 class="heading"
            data-cy="documentation-toggle"
            @click="toggleIsUsedBy()">{{ $t('message.datasetDetails.isUsedBy') }} ({{ getExtendedMetadata ? getExtendedMetadata.is_used_by.length.toLocaleString('fi') : 0 }})</h2>
      </div>
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
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "DatasetDetailsIsUsedBy",
  data() {
    return {
      isUsedBy: {
        isVisible: this.$env.datasetDetails.isUsedBy.isVisible,
      }
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getExtendedMetadata'
    ]),
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
