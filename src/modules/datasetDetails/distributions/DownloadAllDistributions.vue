<template>
  <div v-if="getDistributions.length > 1" class="dsd-download-all-distributions-button">
    <pv-button v-if="isLoadingAllDistributionFiles" :small="small" :rounded="true" :primary="primary" :download="true"
            class="download-all-btn"
            data-toggle="modal" data-target="#downloadAllModal"
    >
      <div class="loading-spinner"></div>
    </pv-button>
    <pv-button v-else class="download-all-btn" :small="small" :rounded="true" :primary="primary" :download="true" :action="() => openModal(downloadAllDistributions, true)">
      {{ $t('message.datasetDetails.datasets.downloadAll') }}
    </pv-button>
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
  </div>
</template>

<script>
import {has, isNil} from "lodash";
import JSZip from "jszip";
import axios from "axios";
import { saveAs } from 'file-saver';
import $ from "jquery";
import { getTranslationFor } from "../../utils/helpers";
import { mapGetters } from "vuex";

export default {
  name: "DownloadAllDistributions",
  props: [
    'getDistributionDescription',
    'getDistributionTitle',
    'openModal',
    'isUrlInvalid',
    'showDownloadUrls',
    'primary',
    'small'
  ],
  computed: {
    ...mapGetters('datasetDetails', [
      'getDistributions',
      'getTitle',
      'getCatalog',
      'getLanguages'
    ])
  },
  data() {
    return {
      downloadedFilesCounter: 0,
      numberOfFilesToZip: 0,
      downloadProgress: 0,
      failedDownloads: 0,
      isGeneratingZip: false,
      isGeneratingZipDone: false,
      isLoadingAllDistributionFiles: false,
      cancelDownloadAllAxiosRequestSource: null,
      isDownloadAllDistributionsCanceled: false,
      downloadAllSuccess: false,
      downloadAllError: false,
      bulkDownload: {
        MAX_FILE_TITLE_LENGTH: this.$env.datasetDetails.bulkDownload.MAX_FILE_TITLE_LENGTH,
        TIMEOUT_MS: this.$env.datasetDetails.bulkDownload.TIMEOUT_MS,
      }
    }
  },
  methods: {
    getTranslationFor,
    async fetchDistributionFiles(zip, files, folder, getContentTypeFormat) {
      const csvReportArray = [];
      let csvReport = 'filename,status, issue_cause downloadURL, issue_cause accessURL\n';
      let csvDownloadURLIssue;
      const problematicFormats = ['wms', 'wfs'];

      const CancelToken = axios.CancelToken;
      this.cancelDownloadAllAxiosRequestSource = CancelToken.source();
      const axiosInstance = this.$bulkDownloadAxiosInstance;
      const requestSettings = { responseType: 'blob', cancelToken: this.cancelDownloadAllAxiosRequestSource.token, timeout: this.bulkDownload.TIMEOUT_MS };

      const promises = files.map(async (file) => {
        const problematicFormat = problematicFormats.find(format => format === file.format);
        if (!problematicFormat) {
          let isRejected = true;
          let responseData;
          let fileFormat = file.format;

          // try to download from download url
          if (has(file, 'downloadUrl')) {
            responseData = await axiosInstance.get(file.downloadUrl, requestSettings).then((responseDownloadUrl) => {
              if (responseDownloadUrl.status === 200) {
                isRejected = false;
                if (!file.format.length > 0) fileFormat = getContentTypeFormat(responseDownloadUrl.headers['content-type']);
                csvReportArray.push([file.csvReportTitle, 'delivered']);
                return responseDownloadUrl.data;
              }
              return Promise.reject(new Error(responseDownloadUrl.statusText));
            }).catch((error) => {
              isRejected = true;
              csvDownloadURLIssue = error;
            });
          } else csvDownloadURLIssue = 'no download url available';
          if (this.isUrlInvalid(file.downloadUrl)) {
            csvReportArray.push([file.csvReportTitle, 'issue', 'url is invalid']);
          }
          // try to download from access url
          if (isRejected) {
            responseData = await axiosInstance.get(file.accessUrl, requestSettings).then((responseAccessUrl) => {
              if (responseAccessUrl.status === 200) {
                isRejected = false;
                if (file.format.length > 0) fileFormat = getContentTypeFormat(responseAccessUrl.headers['content-type']);
                csvReportArray.push([file.csvReportTitle, 'delivered', csvDownloadURLIssue]);
                return responseAccessUrl.data;
              }
              return Promise.reject(new Error(responseAccessUrl.statusText));
            }).catch((error) => {
              isRejected = true;
              csvReportArray.push([file.csvReportTitle, 'issue', csvDownloadURLIssue, error]);
            });
          }
          if (!isRejected) folder.file(`${file.title}.${fileFormat}`, responseData, { binary: true });
          if (!this.isDownloadAllDistributionsCanceled) {
            this.downloadedFilesCounter += 1;
            this.downloadProgress = Math.floor(100 * this.downloadedFilesCounter / this.getDistributions.length);
            if (isRejected) this.failedDownloads += 1;
          } else {
            this.downloadedFilesCounter = 0;
            this.downloadProgress = 0;
            this.failedDownloads = 0;
          }
        } else csvReportArray.push([file.csvReportTitle, 'issue', `We can't download ${problematicFormat} files using the download all button. Please try to download this file using the download button next to the file name.`]);
      });

      await Promise.all(promises);
      csvReportArray.forEach((row) => {
        csvReport += row.join(',');
        csvReport += '\n';
      });
      zip.file('file_report.csv', csvReport, { binary: true });
    },
    hideDownloadAllModal() {
      $('#downloadAllModal').modal('hide');
    },
    generateAndSaveZip(zip, zipName) {
      if (!this.isDownloadAllDistributionsCanceled) {
        this.numberOfFilesToZip = Object.keys(zip.files).length;
        this.isGeneratingZip = true;
      }

      class UserInterruptException {
        constructor(message) {
          this.message = message;
          this.name = 'UserInterruptException';
        }
      }

      zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }, () => {
        if (this.isDownloadAllDistributionsCanceled) throw new UserInterruptException('user canceled generate zip operation');
      })
        .then((blob) => {
          this.isGeneratingZip = false;
          this.isGeneratingZipDone = true;
          this.isLoadingAllDistributionFiles = false;
          this.downloadAllSuccess = true;
          saveAs(blob, zipName);
        })
        .catch((e) => {
          this.isGeneratingZip = false;
          this.isDownloadAllDistributionsCanceled = false;
          this.isLoadingAllDistributionFiles = false;
          this.downloadAllError = true;
          this.downloadedFilesCounter = 0;
          this.downloadProgress = 0;
          this.numberOfFilesToZip = 0;
          console.warn(e); // eslint-disable-line
        });

      // works with chrome => to make it compatible to more browsers look here https://jimmywarting.github.io/StreamSaver.js/examples/saving-multiple-files.html open developer tools and find saving-multiple-files.html
      // install stream saver and import it + script src="https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js"
      // if we don't want to use his service worker we can configure something (I think we have to change the mitm url) => read the api https://jimmywarting.github.io/StreamSaver.js
      // I think IE will never work with this solution
      /* const writeStream = streamSaver.createWriteStream(zipName).getWriter();
      zip.generateInternalStream({ type: 'uint8array', streamFiles: true })
        .on('data', data => writeStream.write(data))
        .on('error', err => console.error(err))
        .on('end', () => writeStream.close())
        .resume(); */
    },
    cancelDownloadAll(source) {
      // stops axios operations
      source.cancel('user canceled axios operation');
      // stops zip operation
      this.isDownloadAllDistributionsCanceled = true;
    },
    async downloadAllDistributions() {
      this.downloadedFilesCounter = 0;
      this.downloadProgress = 0;
      this.failedDownloads = 0;
      this.numberOfFilesToZip = 0;
      this.isGeneratingZip = false;
      this.isGeneratingZipDone = false;
      this.isLoadingAllDistributionFiles = true;
      this.isDownloadAllDistributionsCanceled = false;
      this.downloadAllSuccess = false;
      this.downloadAllError = false;
      const getFormat = (distribution) => {
        if (has(distribution, 'format.id') && !isNil(distribution.format.id)) {
          const type = distribution.format.id;
          return type.lastIndexOf('.') === -1 ? type.toLowerCase() : type.substring(type.lastIndexOf('.') + 1, type.length).toLowerCase();
        }
        return '';
      };
      const getContentTypeFormat = (contentType) => {
        const startIndex = contentType.lastIndexOf('/') + 1;
        const endIndex = contentType.indexOf(';') !== -1 ? contentType.indexOf(';') : contentType.length;
        return contentType.substring(startIndex, endIndex);
      };
      const cutFormatEnding = string => (string.lastIndexOf('.') !== -1 ? string.substring(0, string.lastIndexOf('.')) : string);
      const getFileName = (distribution, i) =>
        `${cutFormatEnding(this.getDistributionTitle(distribution)).substring(0, this.bulkDownload.MAX_FILE_TITLE_LENGTH)
          .replace(/\//g, ' ').trim()}-${i}`
        || `${cutFormatEnding(this.getDistributionDescription(distribution)).substring(0, this.bulkDownload.MAX_FILE_TITLE_LENGTH)
          .replace(/\//g, ' ').trim()}-${i}`;
      const getUrls = distribution => (this.showDownloadUrls(distribution) ?
        { accessUrl: `${distribution.accessUrl[0]}`, downloadUrl: `${distribution.downloadUrls[0]}` }
        : { accessUrl: `${distribution.accessUrl[0]}` });
      const getFileNameForCSV = distribution => this.getDistributionTitle(distribution).replace(/,/g, '')
        || this.getDistributionDescription(distribution).replace(/,/g, '');

      const files = this.getDistributions
        .map((distribution, i) => ({
          title: getFileName(distribution, i + 1), ...getUrls(distribution), format: getFormat(distribution), csvReportTitle: getFileNameForCSV(distribution),
        }));
      const zip = new JSZip();
      const zipName = `${this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages)}.zip`;
      const folder = zip.folder(this.getTranslationFor(this.getCatalog.title, this.$route.query.locale, this.getLanguages));
      await this.fetchDistributionFiles(zip, files, folder, getContentTypeFormat);
      await this.generateAndSaveZip(zip, zipName);
    },
    // handle navigation to extern website (cancel bulk download and hide modal)
    beforeWindowUnload(e) {
      if (this.isLoadingAllDistributionFiles && !this.isDownloadAllDistributionsCanceled) {
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = ''; // eslint-disable-line
      }
    }
  },
  created() {
    this.$once('hook:destroyed', () => {
      this.$router.beforeEach((to, from, next) => {
        if (this.isLoadingAllDistributionFiles && !this.isDownloadAllDistributionsCanceled) {
          const answer = window.confirm(this.$t('message.datasetDetails.datasets.leavePageWindow.text')); // eslint-disable-line
          if (answer) {
            // if modal is open we have to hide it when user tries to navigate back
            this.hideDownloadAllModal();
            this.cancelDownloadAll(this.cancelDownloadAllAxiosRequestSource);
            next();
          } else {
            next(false);
          }
        } else {
          this.hideDownloadAllModal();
          next();
        }
      })();
    });
    window.addEventListener('beforeunload', this.beforeWindowUnload);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.beforeWindowUnload);
  }
}
</script>

<style scoped>

</style>
