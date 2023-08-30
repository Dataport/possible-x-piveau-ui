<template>
  <div class="distributions-header-container w-100">
  <div class="distributions-header-title-container dsd-item d-flex justify-content-between align-items-center">
      <div class="distributions-header-title">
        <h2 :title="$t('message.tooltip.datasetDetails.distribution')"
            data-toggle="tooltip"
            data-placement="top"
            data-cy="dataset-distributions"
            class="distributions-header-title-title">
          {{ $t('message.metadata.distributions') }} 
        </h2>
       
        <div class="distributions-header-title-count-container">
          <h3 class="distributions-header-title-count">{{ getDistributions ? getDistributions.length.toLocaleString('fi') : 0 }}</h3>
        </div>
        
      </div>
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
    <hr class="distributions-header-bottom-hr">
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import DownloadAllDistributions
  from "../../datasetDetails/distributions/DownloadAllDistributions";

export default {
  name: "DistributionsHeader",
  components: {DownloadAllDistributions},
  props: [
    'getDistributionDescription',
    'openModal',
    'getDistributionTitle',
    'showDownloadUrls',
    'isUrlInvalid',
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
  },
}
</script>

<style lang="scss" scoped>
  .distributions-header-title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .distributions-header-title-title {
    margin-right: 8px;
  }

  .distributions-header-title-count {
    &::before {
      content: '('
    }
    &::after {
      content: ')'
    }
  }
</style>
