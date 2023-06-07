<template>
  <div class="w-100">
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
        :small="true"
        :getDistributions="getDistributions"
        :getDistributionDescription="getDistributionDescription"
        :openModal="openModal"
        :getDistributionTitle="getDistributionTitle"
        :showDownloadUrls="showDownloadUrls"
        :isUrlInvalid="isUrlInvalid"
      />
    </div>
    <hr>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import DownloadAllDistributions
  from "@/modules/datasetDetails/distributions/DownloadAllDistributions";

export default {
  name: "DistributionsHeader",
  components: {DownloadAllDistributions},
  props: [
    'getDistributionDescription',
    'openModal',
    'getDistributionTitle',
    'showDownloadUrls',
    'isUrlInvalid'
  ],
  data() {
    return {
      downloadAllTop: this.$env.content.datasetDetails.bulkDownload.buttonPosition === "top"
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getDistributions',
      'getLanguages'
    ])
  }
}
</script>

<style scoped>

</style>
