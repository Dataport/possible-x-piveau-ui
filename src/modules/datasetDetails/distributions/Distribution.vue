<template>
  <div>
    <!-- Preview and action overlay -->
    <div
        v-if="fading"
        class="distributions__item--preview"
    >
      <!-- Fade out the last item so it has a preview feel -->
      <!-- Render actions on top of it -->
      <div class="distributions__actions pb-md-3">
        <circle
            v-for="increment in distributions.incrementSteps.filter(nonOverflowingIncrementsForDistributions)"
            :key="increment"
            class="btn btn-sm btn-secondary mr-1"
            @click="increaseNumDisplayedDistributions(increment)"
        >
          <i class="fas fa-chevron-down"/> {{ $t('message.metadata.showXMore', { increment }) }}
        </circle>
        <button
            class="btn btn-sm btn-primary"
            @click="distributions.displayCount = getDistributions.length"
        >
          <i class="fas fa-eye"/> {{ $t('message.metadata.showAll') }} {{ getDistributions.length.toLocaleString('fi') }}
        </button>
      </div>
    </div>
    <li class="row">
      <!-- DISTRIBUTION FORMAT -->
      <span class="d-inline-block col-2 col-md-1 pl-1 p-md-3 px-md-4 m-md-0 m-auto">
                  <div class="circle float-md-right text-center text-white"
                       :type="getDistributionFormat(distribution)"
                       :data-toggle="distributionFormatTruncated(distribution) ? 'tooltip' : false"
                       :data-placement="distributionFormatTruncated(distribution) ? 'top' : false"
                       :title="distributionFormatTruncated(distribution) ? getDistributionFormat(distribution) : false">
                    <span>{{ truncate(getDistributionFormat(distribution), 4, true) }}</span>
                  </div>
                </span>
      <span class="col-10 col-md-11">
                  <span class="row">
                    <!-- DISTRIBUTION TITLE -->
                    <span class="d-inline-block col-12">
                      <h3 class="m-0 text-break">{{ getDistributionTitle(distribution) }}</h3>
                    </span>
                    <span class="d-inline-block col-12 col-md-9 col-lg-7">
                      <!-- DISTRIBUTION DESCRIPTION -->
                      <span class="mt-2 d-block">
                        <small v-if="distributionDescriptionIsExpanded(distribution.id)">
                          <p class="text-muted">
                            {{ getDistributionDescription(distribution) }}
                            <span class="text-primary details-link pl-2" @click="toggleDistributionDescription(distribution.id)">
                              {{ $t('message.metadata.readLess') }}
                            </span>
                          </p>
                        </small>
                        <small v-else-if="!distributionDescriptionIsExpandable(getDistributionDescription(distribution))">
                          <p class="text-muted">{{ getDistributionDescription(distribution) }}</p>
                        </small>
                        <small v-else>
                          <p class="text-muted">
                            {{ truncate(getDistributionDescription(distribution), distributions.descriptionMaxChars) }}
                            <span class="text-primary details-link pl-2" @click="toggleDistributionDescription(distribution.id)">
                              {{ $t('message.metadata.readMore') }}
                            </span>
                          </p>
                        </small>
                      </span>
                      <!-- DISTRIBUTION EXPANDED CONTENT -->
                      <table class="col-12 table table-borderless table-responsive small pl-0 mt-2 mb-1" v-show="distributionIsExpanded(distribution.id)">
                        <tr>
                          <td class="w-25 font-weight-bold">
                            <tooltip :title="$t('message.tooltip.datasetDetails.distributions.licence')">
                              {{ $t('message.metadata.license') }}
                            </tooltip>
                          </td>
                          <td v-if="showObject(distribution.licence) && showLicence(distribution.licence)">
                            <app-link :to="distribution.licence.resource"
                                      target="_blank"
                                      @click="$emit('track-link', distribution.licence.resource, 'link')">
                              {{ distribution.licence.label }}
                            </app-link>
                            <app-link :to="distribution.licence.resource"
                                      target="_blank"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      :title="distribution.licence.description"
                                      @click="$emit('track-link', distribution.licence.resource, 'link')">
                              <i class="material-icons small-icon align-bottom text-dark">info</i>
                            </app-link>
                            <app-link :to="distribution.licence.la_url"
                                      target="_blank"
                                      @click="$emit('track-link', distribution.licence.la_url, 'link')"
                                      v-if="showLicensingAssistant(distribution)">
                              {{ $t('message.distributionLicense.licensingAssistant') }}
                            </app-link>
                            <app-link :to="distribution.licence.la_url"
                                      target="_blank"
                                      @click="$emit('track-link', distribution.licence.la_url, 'link')"
                                      v-if="showLicensingAssistant(distribution)">
                              <i class="material-icons small-icon align-bottom text-dark">open_in_new</i>
                            </app-link>
                          </td>
                          <td v-else>
                            {{ $t('message.distributionLicense.notProvided') }}
                          </td>
                        </tr>
                        <tr v-if="has(distribution, 'modificationDate') && !isNil(distribution.modificationDate)">
                          <td class="w-25 font-weight-bold">
                            <tooltip :title="$t('message.tooltip.datasetDetails.distributions.updated')">
                                {{ $t('message.metadata.updated') }}
                            </tooltip>
                          </td>
                          <td>{{ filterDateFormatEU(distribution.modificationDate) }}</td>
                        </tr>
                        <tr v-if="has(distribution, 'releaseDate') && !isNil(distribution.releaseDate)">
                          <td class="w-25 font-weight-bold">
                            <tooltip :title="$t('message.tooltip.datasetDetails.distributions.created')">
                                {{ $t('message.metadata.created') }}
                            </tooltip>
                          </td>
                          <td>
                            {{ filterDateFormatEU(distribution.releaseDate) }}
                          </td>
                        </tr>
                        <tr v-if="has(distribution, 'languages') && showArray(distribution.languages)">
                          <td class="w-25 font-weight-bold">
                            <tooltip :title="$t('message.tooltip.datasetDetails.distributions.language')">
                             {{ $t('message.metadata.languages') }}
                             </tooltip>
                          <td>
                            <div v-for="(language, i) of distribution.languages.map(lang => lang.label)" :key="i">
                              <span>{{ language }}</span>
                            </div>
                          </td>
                        </tr>
                        <tr v-if="has(distribution, 'availability') && showObject(distribution.availability) && !isNil(distribution.availability.label)">
                          <td class="w-25 font-weight-bold">
                             <tooltip :title="$t('message.tooltip.datasetDetails.distributions.availability')">
                              {{ $t('message.metadata.availability') }}
                             </tooltip>
                          </td>
                          <td>{{ distribution.availability.label }}</td>
                        </tr>
                        <tr v-if="has(distribution, 'status') && showObject(distribution.status)">
                          <td class="w-25 font-weight-bold">
                            <tooltip :title="$t('message.tooltip.datasetDetails.distributions.status')">
                              {{ $t('message.metadata.status') }}
                             </tooltip>
                          </td>
                          <td>
                            <div v-if="!isNil(distribution.status.label)">
                              {{ distribution.status.label }}
                            </div>
                          </td>
                        </tr>
                        <tr v-if="has(distribution, 'rights') && showObject(distribution.rights)">
                          <td class="w-25 font-weight-bold">
                            <tooltip :title="$t('message.tooltip.datasetDetails.distributions.rights')">
                              {{ $t('message.datasetDetails.quality.rightsAvailability') }}
                            </tooltip>
                          </td>
                          <td>
                            <!-- if wen want to show label AND resource!
                            <div v-for="(right, i) in distribution.rights" :key="i">
                              <span>{{ truncate(right, 75) }}</span>
                            </div>
                            -->
                            <div>{{ distribution.rights.label }}</div>
                          </td>
                        </tr>
                        <tr v-if="has(distribution, 'mediaType') && !isNil(distribution.mediaType)">
                          <td class="w-25 font-weight-bold">
                            <tooltip :title="$t('message.tooltip.datasetDetails.distributions.mediaType')">
                              {{ $t('message.metadata.mediaType') }}
                            </tooltip>
                          </td>
                          <td>{{ distribution.mediaType }}</td>
                        </tr>
                        <tr v-if="has(distribution, 'byteSize') && !isNil(distribution.byteSize)">
                          <td class="w-25 font-weight-bold">
                             <tooltip :title="$t('message.tooltip.datasetDetails.distributions.byteSize')">
                              {{ $t('message.metadata.byteSize') }}
                            </tooltip>
                          </td>
                          <td>{{ distribution.byteSize }}</td>
                        </tr>
                        <tr v-if="has(distribution, 'checksum') && !isNil(distribution.checksum) && has(distribution.checksum, 'algorithm') && !isNil(distribution.checksum.algorithm) && has(distribution.checksum, 'checksum_value') && !isNil(distribution.checksum.checksum_value)">
                          <td class="w-25 font-weight-bold">
                            <tooltip :title="$t('message.tooltip.datasetDetails.distributions.checksum')">
                              {{ $t('message.metadata.checksum') }}
                            </tooltip>
                          </td>
                          <td>
                            <div>{{ distribution.checksum.algorithm }}</div>
                            <div>{{ distribution.checksum.checksum_value }}</div>
                          </td>
                        </tr>
                        <tr v-if="has(distribution, 'pages') && showObjectArray(distribution.pages)">
                          <td class="w-25 font-weight-bold">{{ $t('message.metadata.pages') }}</td>
                          <td>
                            <div v-for="(page, i) of distribution.pages" :key="i">
                              <app-link :to="page">{{ truncate(page.resource, 75) }}</app-link>
                            </div>
                          </td>
                        </tr>
                        <tr v-if="has(distribution, 'type') && showObject(distribution.type)">
                          <td class="w-25 font-weight-bold">
                            <tooltip :title="$t('message.tooltip.datasetDetails.distributions.type')">
                             {{ $t('message.metadata.type') }}
                            </tooltip>
                          </td>
                          <td>
                            <div v-if="!isNil(distribution.type.label)">
                              {{ distribution.type.label }}
                            </div>
                          </td>
                        </tr>
                      </table>
                      <!-- DISTRIBUTION VISIBLE CONTENT -->
                      <table class="col-12 table table-borderless table-responsive small pl-0 mt-1 mb-0" v-show="!distributionIsExpanded(distribution.id)">
                        <tr>
                          <td class="w-25 font-weight-bold">
                            <tooltip :title="$t('message.tooltip.datasetDetails.distributions.licence')">
                               {{ $t('message.metadata.license') }}
                            </tooltip>
                            </td>
                          <td  v-if="showObject(distribution.licence) && showLicence(distribution.licence)">
                            <app-link :to="distribution.licence.resource"
                                      target="_blank"
                                      @click="$emit('track-link', distribution.licence.resource, 'link')">
                              {{ distribution.licence.label }}
                            </app-link>
                            <app-link :to="distribution.licence.resource"
                                      target="_blank"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      :title="distribution.licence.description"
                                      @click="$emit('track-link', distribution.licence.resource, 'link')">
                              <i class="material-icons small-icon align-bottom text-dark" >info</i>
                            </app-link>
                            <app-link :to="distribution.licence.la_url"
                                      target="_blank"
                                      @click="$emit('track-link', distribution.licence.la_url, 'link')"
                                      v-if="showLicensingAssistant(distribution)">
                              {{ $t('message.distributionLicense.licensingAssistant') }}
                            </app-link>
                            <app-link :to="distribution.licence.la_url"
                                      target="_blank"
                                      @click="$emit('track-link', distribution.licence.la_url, 'link')"
                                      v-if="showLicensingAssistant(distribution)">
                              <i class="material-icons small-icon align-bottom text-dark">open_in_new</i>
                            </app-link>
                          </td>
                          <td v-else>
                            {{ $t('message.distributionLicense.notProvided') }}
                          </td>
                        </tr>
                        <tr v-if="has(distribution, 'modificationDate') && !isNil(distribution.modificationDate)">
                          <td class="w-25 font-weight-bold">
                              <tooltip :title="$t('message.tooltip.datasetDetails.distributions.updated')">
                                {{ $t('message.metadata.updated') }}
                              </tooltip>
                          </td>
                          <td>{{ filterDateFormatEU(distribution.modificationDate) }}</td>
                        </tr>
                      </table>
                      <!-- DISTRIBUTION EXPAND -->
                      <div class="text-right" v-if="distributionCanShowMore(distribution)" @click="toggleDistribution(distribution.id)">
                        <small class="arrow" v-if="distributionIsExpanded(distribution.id)">
                          {{ $t('message.metadata.showLess') }}
                          <i class="material-icons align-middle small-icon">keyboard_arrow_up</i>
                        </small>
                        <small class="arrow" v-else>
                          {{ $t('message.metadata.showMore') }}
                          <i class="material-icons align-middle small-icon">keyboard_arrow_down</i>
                        </small>
                      </div>
                    </span>
                    <!-- DISTRIBUTION BUTTONS -->
                    <span class="col-12 col-md-3 col-lg-5 mt-2 text-md-right text-left">
                      <!-- DISTRIBUTION OPTIONS -->
                      <dropdown  v-if="showOptionsDropdown(distribution)"
                                :distribution="distribution"
                                :title="$t('message.tooltip.datasetDetails.distributions.options')"
                                :message="$t('message.datasetDetails.options')"
                                bgLight="true"
                                >
                          <span data-toggle="tooltip" data-placement="top" :title="showTooltipVisualiseButton(isUrlInvalid(getVisualisationLink(distribution)))">
                            <a @click.prevent="openIfValidUrl(!isUrlInvalid(getVisualisationLink(distribution)), previewLinkCallback, distribution, $event)"  :class="{ disabled: isUrlInvalid(getVisualisationLink(distribution)) }" ref="previewLink" class="dropdown-item px-3 d-flex justify-content-end align-items-center"
                                    :href="getVisualisationLink(distribution)"
                                    target="_blank"
                                    v-if="showVisualisationLink(distribution)">
                              <button role="button" class="border-0 bg-transparent button" :disabled="isUrlInvalid(getVisualisationLink(distribution))" >
                                <small class="px-2">{{ $t('message.datasetDetails.preview') }}</small>
                                  <i class="material-icons align-bottom">bar_chart</i>
                              </button>
                            </a>
                          </span>

                          <app-link class="dropdown-item px-3 d-flex justify-content-end align-items-center"
                                    :path="getGeoLink(distribution.format.label, distribution.id)"
                                    target="_blank"
                                    @click="$emit('track-link', getGeoLink(distribution.format.label, distribution.id), 'link')"
                                    v-if="showGeoLink(distribution)">
                            <small class="px-2">{{ $t('message.datasetDetails.geoVisualisation') }}</small>
                            <i class="material-icons float-right align-bottom">public</i>
                          </app-link>
                      </dropdown>
                      <!-- DISTRIBUTION DOWNLOAD -->
                      <dropdownDownload  v-if="showDownloadDropdown(distribution)"
                                         :distribution="distribution"
                                         :title="$t('message.tooltip.datasetDetails.distributions.download')"
                                         :message="$t('message.datasetDetails.download')"
                                         :isOnlyOneUrl="isOnlyOneUrl(distribution)"
                                         :getDownloadUrl="getDownloadUrl"
                                         @trackGoto="trackGoto"
                                         bgLight="true"
                      >
                          <span class="dropdown-item px-3 d-flex justify-content-end align-items-center"
                                v-if="showAccessUrls(distribution)">
                                <app-link class="text-dark text-decoration-none"
                                          :to="replaceHttp(distribution.accessUrl[0])"
                                          target="_blank"
                                          rel="dcat:distribution noopener"
                                          matomo-track-download
                                          @after-click="$emit('trackGoto')">
                                  <small class="px-2" property="dcat:mediaType" :content="getDistributionFormat">accessURL</small>
                                  <i class="material-icons align-bottom">open_in_new</i>
                                </app-link>
                                <i class="copy-text material-icons float-right align-bottom" @click="setClipboard(distribution.accessUrl[0])">file_copy</i>
                                <i class="material-icons help-icon ml-3" data-toggle="tooltip" data-placement="bottom" :title="$t('message.datasetDetails.accessURLTooltip')">help_outline</i>
                          </span>
                          <span class="dropdown-item d-block px-3 d-flex justify-content-end align-items-center"
                                v-for="(downloadURL, i) in distribution.downloadUrls"
                                :key="i">
                            <app-link class="text-dark text-decoration-none"
                                      :to="replaceHttp(downloadURL)"
                                      target="_blank"
                                      matomo-track-download
                                      @after-click="$emit('trackGoto')">
                              <small class="px-2" property="dcat:mediaType">downloadURL</small>
                              <i class="material-icons align-bottom">open_in_new</i>
                            </app-link>
                            <i class="copy-text material-icons float-right align-bottom" @click="setClipboard(downloadURL)">file_copy</i>
                            <i class="material-icons help-icon ml-3" data-toggle="tooltip" data-placement="bottom" :title="$t('message.datasetDetails.downloadURLTooltip')">help_outline</i>
                          </span>
                    </dropdownDownload>
                     <dropdown :distribution="distribution"
                               :title="$t('message.tooltip.datasetDetails.distributions.linkedData')"
                               :message="$t('message.metadata.linkedData')"
                     >
                        <resourceDetailsLinkedDataButton class="dropdown-item" format="rdf" text="RDF/XML" resources="distributions" v-bind:resources-id="distribution.id"></resourceDetailsLinkedDataButton>
                        <resourceDetailsLinkedDataButton class="dropdown-item" format="ttl" text="Turtle" resources="distributions" v-bind:resources-id="distribution.id"></resourceDetailsLinkedDataButton>
                        <resourceDetailsLinkedDataButton class="dropdown-item" format="n3" text="Notation3" resources="distributions" v-bind:resources-id="distribution.id"></resourceDetailsLinkedDataButton>
                        <resourceDetailsLinkedDataButton class="dropdown-item" format="nt" text="N-Triples" resources="distributions" v-bind:resources-id="distribution.id"></resourceDetailsLinkedDataButton>
                        <resourceDetailsLinkedDataButton class="dropdown-item" format="jsonld" text="JSON-LD" resources="distributions" v-bind:resources-id="distribution.id"></resourceDetailsLinkedDataButton>
                     </dropdown>
                    </span>
                  </span>
                </span>
    </li>
    <hr class="mt-1">
  </div>
</template>

<script>
import {
  has,
  isNil
} from 'lodash';
import Tooltip from "@/modules/widgets/Tooltip";
import Dropdown from "@/modules/widgets/Dropdown";
import AppLink from "@/modules/widgets/AppLink";
import DropdownDownload from "@/modules/widgets/DropdownDownload";
import ResourceDetailsLinkedDataButton from "@/modules/widgets/ResourceDetailsLinkedDataButton";
import ResourceAccessPopup from "@/modules/widgets/ResourceAccessPopup";

export default {
  name: 'distribution',
  components: {
    Tooltip,
    Dropdown,
    AppLink,
    DropdownDownload,
    ResourceDetailsLinkedDataButton,
    ResourceAccessPopup
  },
  props: {
    fading: Boolean,
    distribution: Object,
    openModal: Function,
    getDistributions: Array,
    distributions: Object,
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
    has,
    isNil,
  }
};
</script>


<style lang="scss" scoped>
.disabled {
  cursor: not-allowed;
}

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
