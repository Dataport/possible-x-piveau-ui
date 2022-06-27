<template>
  <div class="modal fade" id="downloadAllModal" tabindex="-1" role="dialog" aria-labelledby="download progress" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{ $t('message.datasetDetails.datasets.modal.downloadProgress') }}</h3>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="progress">
            <div class="progress-bar" role="progressbar" :style="{width: `${downloadProgress}%`}" :aria-valuenow="downloadProgress" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <div>
            {{ $t('message.datasetDetails.datasets.modal.downloadingFiles') }} {{ downloadedFilesCounter.toLocaleString('fi') }}/{{getDistributions.length.toLocaleString('fi')}}
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div>{{ $t('message.datasetDetails.datasets.modal.notDownloaded') }} {{ failedDownloads.toLocaleString('fi') }}</div>
            <i class="material-icons help-icon" data-toggle="tooltip" data-placement="bottom" :title="$t('message.datasetDetails.datasets.modal.notDownloadedTooltip')">help</i>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div>{{ $t('message.datasetDetails.datasets.modal.zipNumberOfFiles', { number: numberOfFilesToZip.toLocaleString('fi') }) }}
              <span v-if="isLoadingAllDistributionFiles && numberOfFilesToZip > 0">
                {{ $t('message.datasetDetails.datasets.modal.coupleOfMinutes') }}
              </span> <span v-else-if="isLoadingAllDistributionFiles">
                {{ $t('message.datasetDetails.datasets.modal.waitingForDownload')}}
              </span>
            </div>
            <div v-if="isGeneratingZip" class="spinner-grow text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <i v-else-if="isGeneratingZipDone" class="material-icons check-icon">check_circle</i>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ $t('message.datasetDetails.datasets.modal.close') }}</button>
          <button v-if="!downloadAllSuccess && !downloadAllError" type="button" class="btn btn-danger" data-dismiss="modal" @click="cancelDownloadAll(cancelDownloadAllAxiosRequestSource)">
            {{ $t('message.datasetDetails.datasets.modal.cancel') }}
          </button>
          <button v-else-if="downloadAllError" type="button" class="btn btn-danger" @click="downloadAllDistributions()">{{ $t('message.datasetDetails.datasets.modal.error') }}</button>
          <button v-else-if="downloadAllSuccess" type="button" class="btn btn-success" data-dismiss="modal">{{ $t('message.datasetDetails.datasets.modal.okay') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DownloadAllDistributionsModal",
  props: [
    'downloadProgress',
    'downloadedFilesCounter',
    'getDistributions',
    'failedDownloads',
    'isLoadingAllDistributionFiles',
    'numberOfFilesToZip',
    'isGeneratingZip',
    'isGeneratingZipDone',
    'downloadAllSuccess',
    'downloadAllError',
    'cancelDownloadAll',
    'cancelDownloadAllAxiosRequestSource',
    'downloadAllDistributions'
  ]
}
</script>

<style scoped>

</style>
