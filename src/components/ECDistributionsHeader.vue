<template>
  <div class="dsd-item d-flex flex-column">
    <h2 :title="$t('message.tooltip.datasetDetails.distribution')"
        class="mb-lg-4"
        data-toggle="tooltip"
        data-placement="top"
        data-cy="dataset-distributions"
    >
      {{ $t('message.metadata.distributions') }} ({{ getDistributions ? getDistributions.length.toLocaleString('fi') : 0 }})
    </h2>
    <div class="d-none d-lg-flex distributions-list-top">
      <div class="col-6"><span>Link to the data</span></div>
      <div class="col-1"><span>Format</span></div>
      <div class="col-2"><span>Distribution added</span></div>
      <div class="col-3"><span>Actions</span></div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "ECDistributionsHeader",
  computed: {
    ...mapGetters('datasetDetails', [
      'getDistributions'
    ])
  }
}
</script>

<style lang="scss" scoped>
.distributions-list-top {
  background-color: #f2f4f8;
  > div {
    padding: 1rem;
    font-weight: bold;
  }
}
</style>
