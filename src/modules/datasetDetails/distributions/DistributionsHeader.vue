<template>
  <div class="dsd-item d-flex justify-content-between align-items-center">
    <h2 :title="$t('message.tooltip.datasetDetails.distribution')"
        data-toggle="tooltip"
        data-placement="top"
        data-cy="dataset-distributions">
      {{ $t('message.metadata.distributions') }} ({{ getDistributions ? getDistributions.length.toLocaleString('fi') : 0 }})
    </h2>
    <download-all-distributions
      v-if="downloadAllTop"
      :primary="true"
      :getDistributions="getDistributions"
      :getDistributionDescription="getDistributionDescription"
      :openModal="openModal"
      :getDistributionTitle="getDistributionTitle"
      :showDownloadUrls="showDownloadUrls"
      :getCatalog="getCatalog"
      :isUrlInvalid="isUrlInvalid"
    />
  </div>
</template>

<script>
export default {
  name: "DistributionsHeader",
  props: [
    ''
  ],
  data() {
    return {
      downloadAllTop: this.$env.datasetDetails.bulkDownload.buttonPosition === "top"
    };
  }
}
</script>

<style scoped>

</style>
