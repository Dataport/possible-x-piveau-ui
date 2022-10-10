<template>
  <div class="dsd-item d-flex justify-content-between align-items-center">
    <h2 :title="$t('message.tooltip.datasetDetails.distribution')"
        data-toggle="tooltip"
        data-placement="top"
        data-cy="dataset-distributions">
      {{ $t('message.metadata.distributions') }} ({{ getDistributions ? getDistributions.length.toLocaleString('fi') : 0 }})
    </h2>
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

<style scoped>

</style>
