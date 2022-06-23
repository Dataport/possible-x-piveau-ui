<template>
    <div class="mt-1">
      <resource-access-popup ref="externalResourceModal" />
      <div class="row">
        <div class="col-12 col-lg-11 offset-lg-1 d-flex justify-content-between align-items-center">
          <h2 :title="$t('message.tooltip.datasetDetails.distribution')"
              data-toggle="tooltip"
              data-placement="top"
              data-cy="dataset-distributions">{{ $t('message.metadata.distributions') }} ({{ getDistributions ? getDistributions.length.toLocaleString('fi') : 0 }})</h2>
          <div v-if="getDistributions.length > 1">
            <button v-if="isLoadingAllDistributionFiles" class="btn btn-sm btn-primary download-all-btn d-flex justify-content-center rounded-lg btn-color" data-toggle="modal" data-target="#downloadAllModal">
              <div class="loading-spinner"></div>
            </button>
            <button v-else class="btn btn-sm btn-primary download-all-btn rounded-lg btn-color" @click="openModal(downloadAllDistributions, true)">{{ $t('message.datasetDetails.datasets.downloadAll') }}</button>
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
                    <div>{{ $t('message.datasetDetails.datasets.modal.downloadingFiles') }} {{ downloadedFilesCounter.toLocaleString('fi') }}/{{getDistributions.length.toLocaleString('fi')}}</div>
                    <div class="d-flex justify-content-between align-items-center">
                      <div>{{ $t('message.datasetDetails.datasets.modal.notDownloaded') }} {{ failedDownloads.toLocaleString('fi') }}</div>
                      <i class="material-icons help-icon" data-toggle="tooltip" data-placement="bottom" :title="$t('message.datasetDetails.datasets.modal.notDownloadedTooltip')">help</i>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                      <div>{{ $t('message.datasetDetails.datasets.modal.zipNumberOfFiles', { number: numberOfFilesToZip.toLocaleString('fi') }) }} <span v-if="isLoadingAllDistributionFiles && numberOfFilesToZip > 0">{{ $t('message.datasetDetails.datasets.modal.coupleOfMinutes') }}</span> <span v-else-if="isLoadingAllDistributionFiles">{{ $t('message.datasetDetails.datasets.modal.waitingForDownload')}}</span></div>
                      <div v-if="isGeneratingZip" class="spinner-grow text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                      <i v-else-if="isGeneratingZipDone" class="material-icons check-icon">check_circle</i>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ $t('message.datasetDetails.datasets.modal.close') }}</button>
                    <button v-if="!downloadAllSuccess && !downloadAllError" type="button" class="btn btn-danger" data-dismiss="modal" @click="cancelDownloadAll(cancelDownloadAllAxiosRequestSource)">{{ $t('message.datasetDetails.datasets.modal.cancel') }}</button>
                    <button v-else-if="downloadAllError" type="button" class="btn btn-danger" @click="downloadAllDistributions()">{{ $t('message.datasetDetails.datasets.modal.error') }}</button>
                    <button v-else-if="downloadAllSuccess" type="button" class="btn btn-success" data-dismiss="modal">{{ $t('message.datasetDetails.datasets.modal.okay') }}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul class="list list-unstyled col-12">
          <hr>
          <div class="distributions" :key="`${expandedDistributions.length}--${expandedDistributionDescriptions.length}`">
            <distribution
                v-for="(distribution, index) in displayedDistributions"
                :key="`${index}--${distribution.id}`"
                class="distributions__item"

                :distribution="distribution"
                :fading="!distributions.displayAll && !isDistributionsAllDisplayed && index === distributions.displayCount - 1"
                :openModal="openModal"
                :getDistributions="getDistributions"
                :distributions="distributions"
                :getDistributionFormat="getDistributionFormat"
                :distributionFormatTruncated="distributionFormatTruncated"
                :truncate="truncate"
                :getDistributionTitle="getDistributionTitle"
                :distributionDescriptionIsExpanded="distributionDescriptionIsExpanded"
                :distributionDescriptionIsExpandable="distributionDescriptionIsExpandable"
                :getDistributionDescription="getDistributionDescription"
                :distributionIsExpanded="distributionIsExpanded"
                :showObject="showObject"
                :distributionCanShowMore="distributionCanShowMore"
                :showOptionsDropdown="showOptionsDropdown"
                :showDownloadDropdown="showDownloadDropdown"
                :showLicence="showLicence"
                :showLicensingAssistant="showLicensingAssistant"
                :filterDateFormatEU="filterDateFormatEU"
                :showArray="showArray"
                :showObjectArray="showObjectArray"
                :showVisualisationLink="showVisualisationLink"
                :getVisualisationLink="getVisualisationLink"
                :showGeoLink="showGeoLink"
                :isOnlyOneUrl="isOnlyOneUrl"
                :getDownloadUrl="getDownloadUrl"
                :trackGoto="trackGoto"
                :showAccessUrls="showAccessUrls"
                :replaceHttp="replaceHttp"
                :previewLinkCallback="previewLinkCallback"
                :downloadAllDistributions="downloadAllDistributions"
                :toggleDistribution="toggleDistribution"
                :setClipboard="setClipboard"
                :getGeoLink="getGeoLink"
                :toggleDistributionDescription="toggleDistributionDescription"
                :increaseNumDisplayedDistributions="increaseNumDisplayedDistributions"
                :cancelDownloadAll="cancelDownloadAll"
                :cancelDownloadAllAxiosRequestSource="cancelDownloadAllAxiosRequestSource"
                :nonOverflowingIncrementsForDistributions="nonOverflowingIncrementsForDistributions"
                :isUrlInvalid="isUrlInvalid"
                :openIfValidUrl="openIfValidUrl"
                :showTooltipVisualiseButton="showTooltipVisualiseButton"
            />
          </div>
        </ul>
      </div>
    </div>
</template>

<script>

import Distribution from './Distribution.vue';
import AppLink from '../../widgets/AppLink.vue';
import Tooltip from '../../widgets/Tooltip.vue';
import Dropdown from '../../widgets/Dropdown.vue';
import DropdownDownload from '../../widgets/DropdownDownload.vue';
import ResourceAccessPopup from '../../widgets/ResourceAccessPopup.vue';
import ResourceDetailsLinkedDataButton from '../ResourceDetailsLinkedDataButton.vue';

export default {
  name: 'distributions',
  components: {
    Distribution,
    Tooltip,
    Dropdown,
    AppLink,
    DropdownDownload,
    ResourceDetailsLinkedDataButton,
    ResourceAccessPopup
  },
  props: {
    getDistributions: Array,
    expandedDistributions: Array,
    expandedDistributionDescriptions: Array,
    displayedDistributions: Array,
    distributions: Object,
    isDistributionsAllDisplayed: Boolean,
    pages: Object,
    getDistributionFormat: Function,
    distributionFormatTruncated: Function,
    truncate: Function,
    getDistributionTitle: Function,
    distributionDescriptionIsExpanded: Function,
    distributionDescriptionIsExpandable: Function,
    getDistributionDescription: Function,
    distributionIsExpanded: Function,
    showObject: Function,
    distributionCanShowMore: Function,
    showOptionsDropdown: Function,
    showDownloadDropdown: Function,
    isLoadingAllDistributionFiles: Boolean,
    downloadProgress: Number,
    downloadedFilesCounter: Number,
    failedDownloads: Number,
    numberOfFilesToZip: Number,
    isGeneratingZip: Boolean,
    isGeneratingZipDone: Boolean,
    downloadAllSuccess: Boolean,
    downloadAllError: Boolean,
    showLicence: Function,
    showLicensingAssistant: Function,
    filterDateFormatEU: Function,
    showArray: Function,
    showObjectArray: Function,
    showVisualisationLink: Function,
    getVisualisationLink: Function,
    showGeoLink: Function,
    isOnlyOneUrl: Function,
    getDownloadUrl: Function,
    trackGoto: Function,
    showAccessUrls: Function,
    replaceHttp: Function,
    previewLinkCallback: Function,
    downloadAllDistributions: Function,
    toggleDistribution: Function,
    setClipboard: Function,
    getGeoLink: Function,
    toggleDistributionDescription: Function,
    increaseNumDisplayedDistributions: Function,
    cancelDownloadAll: Function,
    cancelDownloadAllAxiosRequestSource: Object,
    nonOverflowingIncrementsForDistributions: Function,
    isUrlInvalid: Function,
    openIfValidUrl: Function,
    showTooltipVisualiseButton: Function,
  },
  methods: {
    openModal(callback, toggleDownloadPopup) {
      this.$refs.externalResourceModal.openModal(callback, toggleDownloadPopup)
    },
  }
};
</script>

<style lang="scss" scoped>

  .catalogue-label {
    white-space: pre-line;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .tag-color {
    background-color: var(--tag-color);
  }
  .subjectBg {
    background-color: #196fd2;
  }
  .btn-color {
     &:hover {
       background-color: #196fd2;
       border-color: #196fd2;
     }
  }

  .heading, .arrow, .copy-text {
    cursor: pointer;
  }

  .details-link {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .text-break {
    word-break: break-word;
  }

  .circle {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    padding: 20px 0;
    font-size: 12px;
    line-height: 1px;
    border-radius: 50%;
    background-color: #595959;
    &[type="HTML"] {
      background-color: #285C76;
    }
    &[type="JSON"] {
      background-color: var(--dark-orange);
    }
    &[type="XML"] {
      background-color: #8F4300;
    }
    &[type="TXT"] {
      background-color: #2B5E73;
    }
    &[type="CSV"] {
      background-color: var(--badge-green);
    }
    &[type="XLS"] {
      background-color: #1A6537;
    }
    &[type="ZIP"] {
      background-color: #252525;
    }
    &[type="API"] {
      background-color: #923560;
    }
    &[type="PDF"] {
      background-color: #B30519;
    }
    &[type="SHP"] {
      background-color: var(--badge-black);
    }
    &[type="RDF"],
    &[type="NQUAD"],
    &[type="NTRIPLES"],
    &[type="TURTLE"] {
      background-color: #0b4498;
    }
  }

  td {
    padding-left: 0 !important;
    padding-top: 1% !important;
    padding-bottom: 1% !important;
  }

  .download-all-btn {
    min-width: 100px;
    height: 31px;
  }

  /*** BOOTSTRAP ***/
  button:focus {
    outline:0;
  }
  .options, .download {
    .dropdown-menu {
      .dropdown-item {
        &:hover {
          color: initial;
          background-color: initial;
        }
      }
    }
  }
.spinner-grow {
  width: 20px;
  height: 20px;
}

  /*** FONT AWESOME ICONS ***/
  .fa-check-square {
    color: #28a745;
    width: 16px;
    height: 16px;
  }

  /*** MATERIAL ICONS ***/
  %modal-icon {
    font-size: 18px;
    cursor: default;
  }

  .help-icon {
    @extend %modal-icon;
  }

  .check-icon {
    @extend %modal-icon;
    color: #28a745;
  }

  .material-icons.small-icon {
    font-size: 20px;
  }

  .distributions {

    &__item {
      position: relative;

      &--preview {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, white 55%);
        z-index: 10;
      }
    }

    &__actions {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 100%;
      z-index: 11;
    }
  }
  .mt-4 {
    margin-top: 1.5rem !important;
  }

  .keywords {

    &__item {
      position: relative;
    }

    &__actions {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 100%;
      z-index: 11;
    }
  }
  .sectionList {
    list-style-type: '→ ';
    margin-left:6.5%;
  }
  @media only screen and (max-width: 991px) {
  .sectionList {
    margin-left: 0;
  }
}
</style>
