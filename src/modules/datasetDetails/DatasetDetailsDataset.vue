<template>
  <div v-if="!loadingDatasetDetails">
    <resource-access-popup ref="externalResourceModal" />
    <span property="dc:issued" :content="getReleaseDate"></span>
    <span property="dc:modified" :content="getModificationDate"></span>
    <dataset-details-banners
      :dateIncorrect="dateIncorrect"
      :machineTranslated="machineTranslated"
      :translationNotAvailable="translationNotAvailable"
    />
    <dataset-details-description />
    <distributions
      :openModal="openModal"
      :getDistributions="getDistributions"
      :getCatalog="getCatalog"
      :expandedDistributions="expandedDistributions"
      :expandedDistributionDescriptions="expandedDistributionDescriptions"
      :displayedDistributions="displayedDistributions"
      :isDistributionsAllDisplayed="isDistributionsAllDisplayed"
      :distributions="distributions"
      :setDistributionsDisplayCount="setDistributionsDisplayCount"
      :pages="pages"
      :showDownloadUrls="showDownloadUrls"
      :isOnlyOneUrl="isOnlyOneUrl"
      :getDistributionFormat="getDistributionFormat"
      :distributionFormatTruncated="distributionFormatTruncated"
      :getDistributionTitle="getDistributionTitle"
      :distributionDescriptionIsExpanded="distributionDescriptionIsExpanded"
      :distributionDescriptionIsExpandable="distributionDescriptionIsExpandable"
      :getDistributionDescription="getDistributionDescription"
      :distributionIsExpanded="distributionIsExpanded"
      :showNumber="showNumber"
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
      :getDownloadUrl="getDownloadUrl"
      :trackGoto="trackGoto"
      :showAccessUrls="showAccessUrls"
      :replaceHttp="replaceHttp"
      :previewLinkCallback="previewLinkCallback"
      :toggleDistribution="toggleDistribution"
      :getGeoLink="getGeoLink"
      :toggleDistributionDescription="toggleDistributionDescription"
      :increaseNumDisplayedDistributions="increaseNumDisplayedDistributions"
      :nonOverflowingIncrementsForDistributions="nonOverflowingIncrementsForDistributions"
      :appendCurrentLocaleToURL="appendCurrentLocaleToURL"
      :isUrlInvalid="isUrlInvalid"
      :openIfValidUrl="openIfValidUrl"
      :showTooltipVisualiseButton="showTooltipVisualiseButton"
    />
    <dataset-details-keywords
      v-if="showObjectArray(getKeywords)"
      :sortAlphabetically="sortAlphabetically"
      :showKeyword="showKeyword"
    />
    <dataset-details-subject
      v-if="showObjectArray(getSubject)"
      :sortAlphabetically="sortAlphabetically"
    />

    <!-- PAGES -->
    <div class="mt-5" v-if="showObjectArray(getPages)">
      <div class="row">
        <div class="d-none d-lg-block col-1 my-auto pr-0 text-right"
              @click="togglePage()">
          <span class="arrow text-dark"
                v-if="!pages.isVisible">
            <i class="material-icons">keyboard_arrow_down</i>
          </span>
          <span class="arrow text-dark" v-else>
            <i class="material-icons">keyboard_arrow_up</i>
          </span>
        </div>
        <div class="col-11 py-2 bg-white">
          <h2 class="heading"
              data-cy="documentation-toggle"
              @click="togglePage()">{{ $t('message.metadata.documentations') }}  ({{ getPages ? getPages.length.toLocaleString('fi') : 0 }})</h2>
        </div>
        <ul v-if="pages.isVisible" class="list list-unstyled col-12" data-cy="documentation">
          <hr>
          <div class="distributions" :key="`${expandedPages.length}--${expandedPageDescriptions.length}`">
            <div
              v-for="(page, i) in displayedPages"
              :key="i"
              class="distributions__item"
            >
              <!-- Preview and action overlay -->
              <div
                v-if="!pages.displayAll && !isPagesAllDisplayed && i === pages.displayCount - 1"
                class="distributions__item--preview"
              >
                <!-- Fade out the last item so it has a preview feel -->
                <!-- Render actions on top of it -->
                <div class="distributions__actions pb-md-3">
                  <button
                    v-for="increment in pages.incrementSteps.filter(nonOverflowingIncrementsForPages)"
                    :key="increment"
                    class="btn btn-sm btn-secondary mr-1"
                    @click="increaseNumDisplayedPages(increment)"
                  >
                    <i class="fas fa-chevron-down"/> {{ $t('message.metadata.showXMore', { increment }) }}
                  </button>
                  <button
                    class="btn btn-sm btn-primary"
                    @click="pages.displayCount = getPages.length"
                  >
                    <i class="fas fa-eye"/> {{ $t('message.metadata.showAll') }} {{ getPages.length.toLocaleString('fi') }}
                  </button>
                </div>
              </div>
              <li class="row">
                <!-- PAGE FORMAT -->
                <span class="d-inline-block col-2 col-md-1 pl-1 p-md-3 px-md-4 m-md-0 m-auto">
                  <div class="circle float-md-right text-center text-white"
                        :type="getPageFormat(page)"
                        :data-toggle="pageFormatTruncated(page) ? 'tooltip' : false"
                        :data-placement="pageFormatTruncated(page) ? 'top' : false"
                        :title="pageFormatTruncated(page) ? getPageFormat(page) : false">
                    <span>{{ truncate(getPageFormat(page), 4, true) }}</span>
                  </div>
                </span>
                <span class="col-10 col-md-11">
                  <span class="row">
                    <!-- PAGE TITLE -->
                    <span class="d-inline-block col-12">
                      <h3 class="m-0 text-break" :title="getPageTitle(page)">{{ getPageTitle(page) }}</h3>
                    </span>
                    <span class="d-inline-block col-12 col-md-9 col-lg-7">
                      <!-- PAGE DESCRIPTION -->
                      <span class="mt-2 d-block">
                        <small v-if="pageDescriptionIsExpanded(`page-description-toggle-${i}`)">
                          <p class="text-muted">
                            {{ getPageDescription(page) }}
                            <span class="text-primary details-link pl-2" @click="togglePageDescription(`page-description-toggle-${i}`)">
                              {{ $t('message.metadata.readLess') }}
                            </span>
                          </p>
                        </small>
                        <small v-else-if="!pageDescriptionIsExpandable(getPageDescription(page))">
                          <p class="text-muted">{{ getPageDescription(page) }}</p>
                        </small>
                        <small v-else>
                          <p class="text-muted">
                            {{ truncate(getPageDescription(page), pages.descriptionMaxChars) }}
                            <span class="text-primary details-link pl-2" @click="togglePageDescription(`page-description-toggle-${i}`)">
                              {{ $t('message.metadata.readMore') }}
                            </span>
                          </p>
                        </small>
                      </span>
                    </span>
                    <!-- PAGE BUTTONS -->
                    <span class="col-12 col-md-3 col-lg-5 mt-2 text-md-right text-left">
                      <!-- PAGE ACCESS -->
                      <span class="download dropdown d-inline-block">
                        <app-link class="btn btn-sm btn-primary p-0 pl-2 pr-2 w-100 rounded-lg btn-color"
                                  :to="page.resource"
                                  target="_blank"
                                  rel="dcat:distribution noopener"
                                  matomo-track-download
                                  @after-click="trackGoto">
                              {{ $t('message.datasetDetails.access') }}
                        </app-link>
                      </span>
                    </span>
                  </span>
                </span>
              </li>
              <hr class="mt-1">
            </div>
          </div>
        </ul>
      </div>
    </div>

    <!-- VISUALISATION -->
    <div class="mt-5" v-if="showObjectArray(getVisualisations)">
      <div class="row">
        <div class="d-none d-lg-block col-1 my-auto pr-0 text-right"
              @click="toggleVisualisation()">
          <span class="arrow text-dark"
                v-if="!visualisations.isVisible">
            <i class="material-icons">keyboard_arrow_down</i>
          </span>
          <span class="arrow text-dark" v-else>
            <i class="material-icons">keyboard_arrow_up</i>
          </span>
        </div>
        <div class="col-11 py-2 bg-white">
          <h2 class="heading"
              @click="toggleVisualisation()">{{ $t('message.metadata.visualisations') }} ({{ getVisualisations ? getVisualisations.length.toLocaleString('fi') : 0 }})</h2>
        </div>
        <ul v-if="visualisations.isVisible" class="list list-unstyled col-12">
          <hr>
          <div class="distributions" :key="`${expandedVisualisations.length}--${expandedVisualisationDescriptions.length}`">
            <div
              v-for="(visualisation, i) in displayedVisualisations"
              :key="i"
              class="distributions__item"
            >
              <!-- Preview and action overlay -->
              <div
                v-if="!visualisations.displayAll && !isVisualisationsAllDisplayed && i === visualisations.displayCount - 1"
                class="distributions__item--preview"
              >
                <!-- Fade out the last item so it has a preview feel -->
                <!-- Render actions on top of it -->
                <div class="distributions__actions pb-md-3">
                  <button
                    v-for="increment in visualisations.incrementSteps.filter(nonOverflowingIncrementsForVisualisations)"
                    :key="increment"
                    class="btn btn-sm btn-secondary mr-1"
                    @click="increaseNumDisplayedVisualisations(increment)"
                  >
                    <i class="fas fa-chevron-down"/> {{ $t('message.metadata.showXMore', { increment }) }}
                  </button>
                  <button
                    class="btn btn-sm btn-primary"
                    @click="visualisations.displayCount = getVisualisations.length"
                  >
                    <i class="fas fa-eye"/> {{ $t('message.metadata.showAll') }} {{ getVisualisations.length.toLocaleString('fi') }}
                  </button>
                </div>
              </div>
              <li class="row">
                <!-- VISUALISATION FORMAT -->
                <span class="d-inline-block col-2 col-md-1 pl-1 p-md-3 px-md-4 m-md-0 m-auto">
                  <div class="circle float-md-right text-center text-white"
                        :type="getVisualisationFormat(visualisation)"
                        :data-toggle="visualisationFormatTruncated(visualisation) ? 'tooltip' : false"
                        :data-placement="visualisationFormatTruncated(visualisation) ? 'top' : false"
                        :title="visualisationFormatTruncated(visualisation) ? getVisualisationFormat(visualisation) : false">
                    <span>{{ truncate(getVisualisationFormat(visualisation), 4, true) }}</span>
                  </div>
                </span>
                <span class="col-10 col-md-11">
                  <span class="row">
                    <!-- VISUALISATION TITLE -->
                    <span class="d-inline-block col-12">
                      <h3 class="m-0 text-break" :title="getVisualisationTitle(visualisation)">{{ getVisualisationTitle(visualisation) }}</h3>
                    </span>
                    <span class="d-inline-block col-12 col-md-9 col-lg-7">
                      <!-- VISUALISATION DESCRIPTION -->
                      <span class="mt-2 d-block">
                        <small v-if="visualisationDescriptionIsExpanded(`visualisation-description-toggle-${i}`)">
                          <p class="text-muted">
                            {{ getVisualisationDescription(visualisation) }}
                            <span class="text-primary details-link pl-2" @click="toggleVisualisationDescription(`visualisation-description-toggle-${i}`)">
                              {{ $t('message.metadata.readLess') }}
                            </span>
                          </p>
                        </small>
                        <small v-else-if="!visualisationDescriptionIsExpandable(getVisualisationDescription(visualisation))">
                          <p class="text-muted">{{ getVisualisationDescription(visualisation) }}</p>
                        </small>
                        <small v-else>
                          <p class="text-muted">
                            {{ truncate(getVisualisationDescription(visualisation), visualisations.descriptionMaxChars) }}
                            <span class="text-primary details-link pl-2" @click="toggleVisualisationDescription(`visualisation-description-toggle-${i}`)">
                              {{ $t('message.metadata.readMore') }}
                            </span>
                          </p>
                        </small>
                      </span>
                    </span>
                    <!-- VISUALISATION BUTTONS -->
                    <span class="col-12 col-md-3 col-lg-5 mt-2 text-md-right text-left">
                      <!-- VISUALISATION DOWNLOAD -->
                      <span class="download dropdown d-inline-block">
                        <app-link class="btn btn-sm btn-primary p-0 pl-2 pr-2 w-100 rounded-lg btn-color"
                                  :to="visualisation.accessUrl[0]"
                                  target="_blank"
                                  rel="dcat:distribution noopener"
                                  matomo-track-download
                                  @after-click="trackGoto">
                              {{ $t('message.datasetDetails.access') }}
                        </app-link>
                        </span>
                    </span>
                  </span>
                </span>
              </li>
              <hr class="mt-1">
            </div>
          </div>
        </ul>
      </div>
    </div>

    <!-- DATA SERVICES -->
    <div class="mt-5" v-if="showObjectArray(getDataServices)">
      <div class="row">
        <div class="d-none d-lg-block col-1 my-auto pr-0 text-right"
              @click="toggleDataServices()">
          <span class="arrow text-dark"
                v-if="!dataServices.isVisible">
            <i class="material-icons">keyboard_arrow_down</i>
          </span>
          <span class="arrow text-dark" v-else>
            <i class="material-icons">keyboard_arrow_up</i>
          </span>
        </div>
        <div class="col-11 py-2 bg-white">
          <h2 class="heading"
              data-cy="documentation-toggle"
              @click="toggleDataServices()">{{ $t('message.metadata.dataServices') }}  ({{ getDataServices ? getDataServices.length.toLocaleString('fi') : 0 }})</h2>
        </div>
        <ul v-if="dataServices.isVisible" class="list list-unstyled col-12" data-cy="documentation">
          <hr>
          <div class="distributions" :key="`${expandedDataServices.length}--${expandedDataServicesDescriptions.length}`">
            <div
              v-for="(dataService, i) in displayedDataServices"
              :key="i"
              class="distributions__item"
            >
              <!-- Preview and action overlay -->
              <div
                v-if="!dataServices.displayAll && !isDataServicesAllDisplayed && i === dataServices.displayCount - 1"
                class="distributions__item--preview"
              >
                <!-- Fade out the last item so it has a preview feel -->
                <!-- Render actions on top of it -->
                <div class="distributions__actions pb-md-3">
                  <button
                    v-for="increment in dataServices.incrementSteps.filter(nonOverflowingIncrementsForPages)"
                    :key="increment"
                    class="btn btn-sm btn-secondary mr-1"
                    @click="increaseNumDisplayedPages(increment)"
                  >
                    <i class="fas fa-chevron-down"/> {{ $t('message.metadata.showXMore', { increment }) }}
                  </button>
                  <button
                    class="btn btn-sm btn-primary"
                    @click="dataServices.displayCount = getDataServices.length"
                  >
                    <i class="fas fa-eye"/> {{ $t('message.metadata.showAll') }} {{ getDataServices.length.toLocaleString('fi') }}
                  </button>
                </div>
              </div>
              <li class="row">
                <!-- DATA SERVICE FORMAT PLACEHOLDER -->
                <span class="d-inline-block col-2 col-md-1 pl-1 p-md-3 px-md-4 m-md-0 m-auto">
                  <div class="circle float-md-right text-center text-white invisible"/>
                </span>
                <span class="col-10 col-md-11">
                  <span class="row">
                    <!-- DATA SERVICE TITLE -->
                    <span class="d-inline-block col-12">
                      <h3 class="m-0 text-break" :title="getDataServiceTitle(dataService)">{{ getDataServiceTitle(dataService) }}</h3>
                    </span>
                    <span class="d-inline-block col-12 col-md-9 col-lg-7">
                      <!-- DATA SERVICE DESCRIPTION -->
                      <span class="mt-2 d-block">
                        <small v-if="dataServiceDescriptionIsExpanded(`data-service-description-toggle-${i}`)">
                          <p class="text-muted">
                            {{ getDataServiceDescription(dataService) }}
                            <span class="text-primary details-link pl-2" @click="toggleDataServiceDescription(`data-service-description-toggle-${i}`)">
                              {{ $t('message.metadata.readLess') }}
                            </span>
                          </p>
                        </small>
                        <small v-else-if="!dataServiceDescriptionIsExpandable(getDataServiceDescription(dataService))">
                          <p class="text-muted">{{ getDataServiceDescription(dataService) }}</p>
                        </small>
                        <small v-else>
                          <p class="text-muted">
                            {{ truncate(getDataServiceDescription(dataService), dataService.descriptionMaxChars) }}
                            <span class="text-primary details-link pl-2" @click="toggleDataServiceDescription(`data-service-description-toggle-${i}`)">
                              {{ $t('message.metadata.readMore') }}
                            </span>
                          </p>
                        </small>
                      </span>
                    </span>
                    <!-- DATA SERVICE BUTTONS -->
                    <span class="col-12 col-md-3 col-lg-5 mt-2 text-md-right text-left">
                      <!-- DATA SERVICE ACCESS -->
                      <span class="download dropdown d-inline-block">
                        <app-link class="btn btn-sm btn-primary p-0 pl-2 pr-2 w-100 rounded-lg btn-color"
                                  :to="dataService.endpoint_url[0]"
                                  target="_blank"
                                  rel="dcat:distribution noopener"
                                  matomo-track-download
                                  @after-click="trackGoto">
                              {{ $t('message.datasetDetails.access') }}
                        </app-link>
                      </span>
                    </span>
                  </span>
                </span>
              </li>
              <hr class="mt-1">
            </div>
          </div>
        </ul>
      </div>
    </div>
    <!-- DATA IS_USED_BY_SECTION -->
    <div class="mt-5" v-if="showObject(getExtendedMetadata)">
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

    <!-- DATA RELATED RESOURCE -->
    <dataset-details-relations
      v-if="showArray(getRelations)"
      :getRelations="getRelations"
    />

    <dataset-details-map
      v-if="showObjectArray(getSpatial)"
      :getSpatial="getSpatial"
    />

    <!-- INFO -->
    <dataset-details-info
      :filterDateFormatEU="filterDateFormatEU"
      :showObjectArray="showObjectArray"
      :showArray="showArray"
      :showString="showString"
      :showObject="showObject"
      :showNumber="showNumber"
    />
  </div>
</template>

<script lang="ts">
  // @ts-nocheck
  /* eslint-disable no-confusing-arrow, no-nested-ternary, no-return-assign, no-confusing-arrow */
  import $ from 'jquery';
  import { mapActions, mapGetters } from 'vuex';
  import {
    has,
    isNil,
    isArray,
    isObject,
    isString,
    isNumber,
    isEmpty,
  } from 'lodash';
  import AppLink from '../widgets/AppLink.vue';
  import Tooltip from '../widgets/Tooltip.vue';
  import Distributions from './distributions/Distributions.vue';
  import dateFilters from '../filters/dateFilters';
  import {
    getTranslationFor, getCountryFlagImg, truncate, replaceHttp, appendCurrentLocaleToURL
  } from '../utils/helpers';
  import ResourceAccessPopup from '../widgets/ResourceAccessPopup.vue';
  import DatasetDetailsBanners from "@/modules/datasetDetails/DatasetDetailsBanners.vue";
  import DatasetDetailsDescription from "@/modules/datasetDetails/DatasetDetailsDescription.vue";
  import DatasetDetailsKeywords from "@/modules/datasetDetails/DatasetDetailsKeywords.vue";
  import DatasetDetailsSubject from "@/modules/datasetDetails/DatasetDetailsSubject.vue";
  import DatasetDetailsInfo from "@/modules/datasetDetails/DatasetDetailsInfo.vue";
  import DatasetDetailsMap from "@/modules/datasetDetails/DatasetDetailsMap.vue";

  export default {
    name: 'datasetDetailsDataset',
    dependencies: 'DatasetService',
    components: {
      DatasetDetailsMap,
      DatasetDetailsInfo,
      DatasetDetailsSubject,
      DatasetDetailsKeywords,
      DatasetDetailsDescription,
      DatasetDetailsBanners,
      AppLink,
      Tooltip,
      Distributions,
      ResourceAccessPopup
    },
    metaInfo() {
      return {
        meta: [
          {
            name: 'description',
            vmid: 'description',
            content: (this.getDescription
              ? `${this.getTranslationFor(this.getDescription, this.$route.query.locale, this.getLanguages.map(lang => lang.id))}`
              : `${this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages.map(lang => lang.id))}`).substring(0, 4999),
          },
          {
            name: 'keywords',
            vmid: 'keywords',
            content: isNil(this.getKeywords) || this.getKeywords === 0
              ? ''
              : this.getKeywords.map(k => k.title).join(' ').substring(0, 4999),
          },
          {
            name: 'subject',
            vmid: 'subject',
          },
          {
            name: 'robots',
            content: 'index',
          },
        ],
        script: this.validateDataset(),
        link: [
          { rel: 'canonical', href: window.location.href },
        ],
      };
    },
    data() {
      return {
        defaultLocale: this.$env.languages.locale,
        // has to be INITIAL_DATASET_DESCRIPTION_LENGTH
        isDatasetDescriptionExpanded: false,
        loadingDatasetDetails: false,
        dateIncorrect: false,
        machineTranslated: false,
        translationNotAvailable: false,
        expandedDistributions: [],
        expandedDistributionDescriptions: [],
        expandedPages: [],
        expandedPageDescriptions: [],
        expandedVisualisations: [],
        expandedVisualisationDescriptions: [],
        expandedDataServices: [],
        expandedDataServicesDescriptions: [],
        visualisationLinkFormats: [
          'csv',
          'xlsx',
          'xls',
        ],
        geoLinkFormats: {
          wms: 'WMS',
          geojson: 'GeoJSON',
          fiware_cb: 'fiware_cb',
          'fiware-cb': 'fiware_cb',
        },
        datasetSchema: {},
        distributions: {
          displayAll: this.$env.datasetDetails.distributions.displayAll,
          displayCount: this.$env.datasetDetails.distributions.displayCount,
          incrementSteps: this.$env.datasetDetails.distributions.incrementSteps,
          descriptionMaxLines: this.$env.datasetDetails.distributions.descriptionMaxLines,
          descriptionMaxChars: this.$env.datasetDetails.distributions.descriptionMaxChars,
        },
        pages: {
          isVisible: this.$env.datasetDetails.pages.isVisible,
          displayAll: this.$env.datasetDetails.pages.displayAll,
          displayCount: this.$env.datasetDetails.pages.displayCount,
          incrementSteps: this.$env.datasetDetails.pages.incrementSteps,
          descriptionMaxLines: this.$env.datasetDetails.pages.descriptionMaxLines,
          descriptionMaxChars: this.$env.datasetDetails.pages.descriptionMaxChars,
        },
        visualisations: {
          isVisible: this.$env.datasetDetails.visualisations.isVisible,
          displayAll: this.$env.datasetDetails.visualisations.displayAll,
          displayCount: this.$env.datasetDetails.visualisations.displayCount,
          incrementSteps: this.$env.datasetDetails.visualisations.incrementSteps,
          descriptionMaxLines: this.$env.datasetDetails.visualisations.descriptionMaxLines,
          descriptionMaxChars: this.$env.datasetDetails.visualisations.descriptionMaxChars,
        },
        dataServices: {
          isVisible: this.$env.datasetDetails.dataServices.isVisible,
          displayAll: this.$env.datasetDetails.dataServices.displayAll,
          displayCount: this.$env.datasetDetails.dataServices.displayCount,
          incrementSteps: this.$env.datasetDetails.dataServices.incrementSteps,
          descriptionMaxLines: this.$env.datasetDetails.dataServices.descriptionMaxLines,
          descriptionMaxChars: this.$env.datasetDetails.dataServices.descriptionMaxChars,
        },
        isUsedBy: {
          isVisible: this.$env.datasetDetails.isUsedBy.isVisible,
        }
      };
    },
    computed: {
      // todo: refactor this to refer to store
      isTrusted: () => process.env.NODE_ENV === 'development',
      // import store-getters
      ...mapGetters('datasetDetails', [
      'getKeywords',
      'getAccessRights',
      'getAccrualPeriodicity',
      'getCatalog',
      'getContactPoints',
      'getDescription',
      'getDistributions',
      'getExtendedMetadata',
      'getID',
      'getSubject',
      'getLanguages',
      'getLicences',
      'getModificationDate',
      'getOtherIdentifiers',
      'getPages',
      'getPublisher',
      'getRelations',
      'getReleaseDate',
      'getSpatial',
      'getTranslationMetaData',
      'getTitle',
      'getVisualisations'
      ]),
      getDataServices() {
        if (this.getDistributions) {
          const accessServiceList = this.getDistributions
            .filter(distribution => has(distribution, 'accessService') && !isEmpty(distribution.accessService))
            .map(distribution => ({
              endpoint_url: distribution.accessService[0].endpoint_url,
              title: distribution.accessService[0].title,
              description: distribution.accessService[0].description,
            }));
          const uniqueAccessServiceList = [...new Map(
            accessServiceList
              .filter(accessService => accessService?.endpoint_url?.length)
              .map(accessService => [
                accessService.endpoint_url[0], accessService,
              ]),
          ).values()];
          return uniqueAccessServiceList;
        }
        return [{}];
      },
      displayedDistributions() {
        const sorted = [...this.getDistributions].sort((a, b) => {
          if (getTranslationFor(a.title, this.$route.query.locale, this.getLanguages) < getTranslationFor(b.title, this.$route.query.locale, this.getLanguages)) { return -1; }
          if (getTranslationFor(a.title, this.$route.query.locale, this.getLanguages) > getTranslationFor(b.title, this.$route.query.locale, this.getLanguages)) { return 1; }
          return 0;
        });
        return this.distributions.displayAll
          ? Object.freeze(sorted)
          : Object.freeze(sorted.slice(0, this.distributions.displayCount));
      },
      isDistributionsAllDisplayed() {
        return this.distributions.displayCount === this.getDistributions.length;
      },
      remainingDistributions() {
        return this.getDistributions.length - this.distributions.displayCount;
      },
      displayedPages() {
        const sorted = [...this.getPages].sort((a, b) => {
          if (getTranslationFor(a.title, this.$route.query.locale, this.getLanguages) < getTranslationFor(b.title, this.$route.query.locale, this.getLanguages)) { return -1; }
          if (getTranslationFor(a.title, this.$route.query.locale, this.getLanguages) > getTranslationFor(b.title, this.$route.query.locale, this.getLanguages)) { return 1; }
          return 0;
        });
        return this.pages.displayAll
          ? Object.freeze(sorted)
          : Object.freeze(sorted.slice(0, this.pages.displayCount));
      },
      isPagesAllDisplayed() {
        return this.pages.displayCount === this.getPages.length;
      },
      remainingPages() {
        return this.getPages.length - this.pages.displayCount;
      },
      displayedVisualisations() {
        const sorted = [...this.getVisualisations].sort((a, b) => {
          if (getTranslationFor(a.title, this.$route.query.locale, this.getLanguages) < getTranslationFor(b.title, this.$route.query.locale, this.getLanguages)) { return -1; }
          if (getTranslationFor(a.title, this.$route.query.locale, this.getLanguages) > getTranslationFor(b.title, this.$route.query.locale, this.getLanguages)) { return 1; }
          return 0;
        });
        return this.visualisations.displayAll
          ? Object.freeze(sorted)
          : Object.freeze(sorted.slice(0, this.visualisations.displayCount));
      },
      isVisualisationsAllDisplayed() {
        return this.visualisations.displayCount === this.getVisualisations.length;
      },
      remainingVisualisations() {
        return this.getVisualisations.length - this.visualisations.displayCount;
      },
      displayedDataServices() {
        const sorted = [...this.getDataServices].sort((a, b) => {
          if (getTranslationFor(a.title, this.$route.query.locale, this.getLanguages) < getTranslationFor(b.title, this.$route.query.locale, this.getLanguages)) { return -1; }
          if (getTranslationFor(a.title, this.$route.query.locale, this.getLanguages) > getTranslationFor(b.title, this.$route.query.locale, this.getLanguages)) { return 1; }
          return 0;
        });
        return this.dataServices.displayAll
          ? Object.freeze(sorted)
          : Object.freeze(sorted.slice(0, this.dataServices.displayCount));
      },
      isDataServicesAllDisplayed() {
        return this.dataServices.displayCount === this.getDataServices.length;
      },
      remainingDataServices() {
        return this.getDataServices.length - this.dataServices.displayCount;
      }
    },
    methods: {
      // import store-actions
      ...mapActions('datasetDetails', [
        'loadDatasetDetails',
        'setLoading',
        'useService',
        'loadQualityData',
        'loadQualityDistributionData',
      ]),
      // Lodash has function
      has,
      isNil,
      isArray,
      isObject,
      isString,
      isNumber,
      appendCurrentLocaleToURL,
      getTranslationFor,
      getCountryFlagImg,
      truncate,
      replaceHttp,
      setDistributionsDisplayCount(count: number) {
        this.distributions.displayCount = count;
      },
      openModal(callback, toggleDownloadPopup) {
        this.$refs.externalResourceModal.openModal(callback, toggleDownloadPopup)
      },
      previewLinkCallback(distribution) {
        return () => {
          this.$emit('track-link', this.getVisualisationLink(distribution), 'link');
          window.open(this.getVisualisationLink(distribution), '_blank');
        };
      },
      sortAlphabetically(array, property) {
        try {
          array.sort((a, b) => {
            const propA = a[property].toLowerCase();
            const propB = b[property].toLowerCase();

            return propA > propB
              ? 1
              : -1;
          });
        } catch (e) {
          // Catch TypeErrors for undefined Keyword titles
          console.warn('CATCHED ERROR - UNDEFINED KEYWORD TITLES'); // eslint-disable-line
          console.warn(e); // eslint-disable-line
        }
      },
      validateDataset() {
        const isConform = true;
        // const descriptionLength = (this.datasetSchema.description !== undefined) ? this.datasetSchema.description.length : 0;
        // const titleLength = (this.datasetSchema.name !== undefined) ? this.datasetSchema.name.length : 0;

        // if (descriptionLength === 0 || titleLength === 0) isConform = false;
        return (isConform) ? [{
          type: 'application/ld+json',
          json: this.datasetSchema,
        }] : [];
      },
      getSchemaOfSpatialCoverage(spatialObject) {
        let spatialCoverage = [];
        const spatial = spatialObject ? (spatialObject.length ? spatialObject[0] : spatialObject) : null;

        if (!spatial) return [];

        if (spatial.type === 'Polygon') {
          const places = [];
          const polygons = spatial.coordinates;
          polygons.forEach((polygon) => {
            let poly = '';
            poly = polygon.map(coordinate => coordinate.join(',')).join(' ');
            const geoShape = {
              '@type': 'GeoShape',
              polygon: poly,
            };
            places.push({
              '@type': 'Place',
              geo: geoShape,
            });
          });

          spatialCoverage = places;
        } else if (spatial.type === 'Point') {
          spatialCoverage = {
            '@type': 'Place',
            geo: {
              '@type': 'GeoCoordinates',
              latitude: spatial.coordinates[0],
              longitude: spatial.coordinates[1],
            },
          };
        }

        return spatialCoverage;
      },
      // Returns a schema.org license object by providing dcat-ap license
      // See https://schema.org/license
      // See https://confluencesrv.fokus.fraunhofer.de/pages/viewpage.action?spaceKey=PIV&title=DCAT-AP+Guide
      getSchemaOfLicense(license) {
        if (!isNil(license) && !isEmpty(license)) {
          const {
            id, description, resource, la_url: laUrl,
          } = license;

          if (!id && !description && !resource && !laUrl) return null;

          const licenseObject = {
            '@type': 'CreativeWork',
            ...id && { '@id': id },
            ...description && { description },
            ...(resource || laUrl) && { url: (resource || laUrl) },

          };

          return licenseObject;
        }

        return null;
      },
      // Returns a json-ld object of the license of the first distribution where a license exists in this dataset
      // or null, if first distribution or license does not exist
      getSchemaOfFirstAvailableLicense() {
        let license = null;
        const licenses = this.getLicences;

        if (licenses && licenses.length > 0) {
          const distributionLicense = licenses.find(l => l && (l.title || l.description || l.id || l.resource));

          if (distributionLicense) {
            license = this.getSchemaOfLicense(distributionLicense);
          }
        }
        return license;
      },
      getSchemaOrg() {
        // PAYLOAD
        const payload = {
          '@context': 'http://schema.org',
          '@type': 'Dataset',
          name: '', // https://schema.org/Dataset
          description: '', // https://schema.org/Dataset
          license: {}, // https://schema.org/Dataset
          spatialCoverage: {}, // https://schema.org/Dataset
          keywords: [], // https://schema.org/Dataset
          catalog: {}, // https://schema.org/DataCatalog
          distribution: [], // https://schema.org/DataDownload
          creator: [], // https://schema.org/Organization
          contactPoint: [], // https://schema.org/ContactPoint
        };

        // https://schema.org/Dataset
        payload.name = this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages);
        payload.name = payload.name ? payload.name.substring(0, 4999) : payload.name;
        payload.description = this.getTranslationFor(this.getDescription, this.$route.query.locale, this.getLanguages);
        payload.description = payload.description ? payload.description.substring(0, 4999) : payload.description;
        payload.license = this.getSchemaOfFirstAvailableLicense();
        payload.spatialCoverage = this.getSchemaOfSpatialCoverage(this.getSpatial);
        payload.identifier = this.getOtherIdentifiers;
        if (this.showObjectArray(this.getKeywords)) {
          this.getKeywords.forEach((keyword) => {
            if (this.showKeyword(keyword)) {
              payload.keywords.push(keyword.title);
            }
          });
        }
        // https://schema.org/DataCatalog
        payload.catalog = {
          '@type': 'DataCatalog',
          name: this.getTranslationFor(this.getCatalog.title, this.$route.query.locale, this.getLanguages)?.substring(0, 4999),
          description: this.getTranslationFor(this.getCatalog.description, this.$route.query.locale, this.getLanguages)?.substring(0, 4999),
          publisher: this.getCatalog.publisher,
          url: this.getCatalog.homepage,
          inLanguage: isArray(this.getCatalog.language) ? this.getCatalog.language[0] : this.getCatalog.language,
          license: this.getSchemaOfLicense(this.getCatalog.license),
          dateModified: this.getCatalog.modificationDate,
          spatialCoverage: this.getSchemaOfSpatialCoverage(this.getCatalog.getSpatial),
        };

        // https://schema.org/DataDownload
        this.getDistributions.forEach((distro) => {
          const distroResult = {
            '@type': 'DataDownload',
            name: this.getDistributionTitle(distro),
            encodingFormat: this.getDistributionFormat(distro),
            license: this.getSchemaOfLicense(distro.licence),
            contentSize: distro.byteSize,
            datePublished: distro.releaseDate,
            dateModified: distro.modificationDate,
          };
          if (this.showAccessUrls(distro)) {
            distroResult.contentUrl = distro.accessUrl[0];
          }
          payload.distribution.push(distroResult);
        });

        // https://schema.org/Organization
        if (isObject(this.getPublisher) && has(this.getPublisher, 'name') && !isNil(this.getPublisher.name)) {
          payload.creator.push({
            '@type': 'Organization',
            name: this.getPublisher.name,
          });
        }

        // https://schema.org/ContactPoint
        this.getContactPoints.forEach((contactPoint) => {
          const hasName = has(contactPoint, 'name') && !isNil(contactPoint.name);
          const hasEmail = has(contactPoint, 'email') && !isNil(contactPoint.email);
          const hasAddress = has(contactPoint, 'address') && !isNil(contactPoint.address);
          const hasTelephone = has(contactPoint, 'telephone') && !isNil(contactPoint.telephone);
          if (isObject(contactPoint) && (hasName || hasEmail || hasAddress || hasTelephone)) {
            const c = { '@type': 'ContactPoint' };

            if (hasName) c.name = contactPoint.name;
            if (hasEmail) c.email = contactPoint.email;
            if (hasAddress) c.address = contactPoint.address;
            if (hasTelephone) c.telephone = contactPoint.telephone;

            payload.contactPoint.push(c);
          }
        });
        return payload;
      },
      filterDateFormatEU(date) {
        return dateFilters.formatEU(date);
      },
      /* ABSTRACT SHOW FUNCTIONS */
      showString(string) {
        return !isNil(string) && isString(string);
      },
      showNumber(number) {
        return !isNil(number) && isNumber(number);
      },
      showObject(object) {
        return !isNil(object) && isObject(object) && !Object.values(object).reduce((keyUndefined, currentValue) => keyUndefined && currentValue === undefined, true);
      },
      showArray(array) {
        return !isNil(array) && isArray(array) && array.length > 0;
      },
      showObjectArray(objectArray) {
        return this.showArray(objectArray) && !objectArray.reduce((objectUndefined, currentObject) => objectUndefined && Object.values(currentObject).reduce((keyUndefined, currentValue) => keyUndefined && currentValue === undefined, true), true);
      },
      /* SPECIFIC SHOW FUNCTIONS */
      showLicence(licence) {
        return has(licence, 'id')
          && has(licence, 'label')
          && has(licence, 'resource')
          && !isNil(licence.id)
          && !isNil(licence.label)
          && !isNil(licence.resource);
      },
      showLicensingAssistant(distribution) {
        return has(distribution, 'licence.la_url') && this.showString(distribution.licence.la_url);
      },
      showOptionsDropdown(distribution) {
        return this.showVisualisationLink(distribution) || this.showGeoLink(distribution);
      },
      showVisualisationLink(distribution) {
        if (!has(distribution, 'format.label') || isNil(distribution?.format?.label)
          || (isNil(distribution?.downloadUrls[0]) && isNil(distribution?.accessUrl[0]))) return false;
        const f = distribution?.format?.id?.toLowerCase();
        return f && this.visualisationLinkFormats.includes(f);
      },
      showGeoLink(distribution) {
        if (!has(distribution, 'format.label') || isNil(distribution.format.label) || !has(distribution, 'id') || isNil(distribution.id)) return false;
        const f = distribution.format.label.toLowerCase();
        return Object.keys(this.geoLinkFormats).includes(f);
      },
      showDownloadDropdown(distribution) {
        return this.showAccessUrls(distribution) || this.showDownloadUrls(distribution);
      },
      isOnlyOneUrl(distribution) {
        return (this.showAccessUrls(distribution) && !this.showDownloadUrls(distribution))
      || (!this.showAccessUrls(distribution) && this.showDownloadUrls(distribution) && distribution.downloadUrls.length === 1);
      },
      getDownloadUrl(distribution) {
        let url;
        if (this.showAccessUrls(distribution) && !this.showDownloadUrls(distribution)) {
          url = distribution.accessUrl[0];
        }
        if (!this.showAccessUrls(distribution) && this.showDownloadUrls(distribution) && distribution.downloadUrls.length === 1) {
          url = distribution.downloadUrls[0];
        }
        return url;
      },
      showAccessUrls(distribution) {
        return has(distribution, 'accessUrl') && this.showArray(distribution.accessUrl);
      },
      showDownloadUrls(distribution) {
        return has(distribution, 'downloadUrls') && this.showArray(distribution.downloadUrls);
      },
      showKeyword(keyword) {
        return has(keyword, 'id')
          && has(keyword, 'title')
          && !isNil(keyword.id)
          && !isNil(keyword.title);
      },
      distributionCanShowMore(distribution) {
        return (has(distribution, 'releaseDate') && !isNil(distribution.releaseDate))
            || (has(distribution, 'availability') && !isNil(distribution.availability))
            || (has(distribution, 'status') && !isNil(distribution.status))
            || (has(distribution, 'rights') && this.showObject(distribution.rights))
            || (has(distribution, 'mediaType') && !isNil(distribution.mediaType))
            || (has(distribution, 'byteSize') && !isNil(distribution.byteSize))
            || (has(distribution, 'checksum') && !isNil(distribution.checksum) && has(distribution.checksum, 'algorithm') && !isNil(distribution.checksum.algorithm) && has(distribution.checksum, 'checksum_value') && !isNil(distribution.checksum.checksum_value))
            || (has(distribution, 'pages') && this.showArray(distribution.pages))
            || (has(distribution, 'languages') && this.showArray(distribution.languages))
            || (has(distribution, 'conformsTo') && this.showArray(distribution.conformsTo))
            || (has(distribution, 'compressFormat') && !isNil(distribution.compressFormat))
            || (has(distribution, 'packageFormat') && !isNil(distribution.packageFormat))
            || (has(distribution, 'hasPolicy') && !isNil(distribution.hasPolicy))
            || (has(distribution, 'conformsTo') && this.showObjectArray(distribution.conformsTo))
            || (has(distribution, 'spatialResolutionInMeters') && this.showArray(distribution.spatialResolutionInMeters))
            || (has(distribution, 'temporalResolution') && this.showArray(distribution.temporalResolution));
      },
      /* GETTER / SETTER FUNCTIONS */

      setDatasetOriginalLanguage(originalLanguage) {
        this.$i18n.locale = originalLanguage;
      },
      distributionIsExpanded(id) {
        setTimeout(() => {
          $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
          });
        }, 500);
        return this.expandedDistributions.includes(id);
      },
      distributionDescriptionIsExpanded(id) {
        return this.expandedDistributionDescriptions.includes(id);
      },
      distributionDescriptionIsExpandable(description) {
        return isNil(description) ? false : description.length > this.distributions.descriptionMaxChars;
      },
      getDistributionFormat(distribution) {
        return has(distribution, 'format.label') && !isNil(distribution.format.label) ? distribution.format.label : '';
      },
      distributionFormatTruncated(distribution) {
        return this.getDistributionFormat(distribution).length > 4;
      },
      getDistributionTitle(distribution) {
        return distribution.title ? getTranslationFor(distribution.title, this.$route.query.locale, this.getLanguages) : '-';
      },
      getDistributionDescription(distribution) {
        return (has(distribution, 'description') && !isNil(distribution.description)) ? getTranslationFor(distribution.description, this.$route.query.locale, this.getLanguages) : '-';
      },
      pageIsExpanded(id) {
        return this.expandedPages.includes(id);
      },
      pageDescriptionIsExpanded(id) {
        return this.expandedPageDescriptions.includes(id);
      },
      pageDescriptionIsExpandable(description) {
        return isNil(description) ? false : description.length > this.pages.descriptionMaxChars;
      },
      getPageFormat(page) {
        return has(page, 'format.label') && !isNil(page.format.label) ? page.format.label : 'UNKNOWN';
      },
      pageFormatTruncated(page) {
        return this.getPageFormat(page).length > 4;
      },
      getPageTitle(page) {
        return page.title ? getTranslationFor(page.title, this.$route.query.locale, this.getLanguages) : truncate(page.resource, 50);
      },
      getPageDescription(page) {
        return (has(page, 'description') && !isNil(page.description)) ? getTranslationFor(page.description, this.$route.query.locale, this.getLanguages) : this.$t('message.catalogsAndDatasets.noDescriptionAvailable');
      },
      visualisationIsExpanded(id) {
        return this.expandedVisualisations.includes(id);
      },
      visualisationDescriptionIsExpanded(id) {
        return this.expandedVisualisationDescriptions.includes(id);
      },
      visualisationDescriptionIsExpandable(description) {
        return isNil(description) ? false : description.length > this.visualisations.descriptionMaxChars;
      },
      getVisualisationFormat(visualisation) {
        return has(visualisation, 'format.label') && !isNil(visualisation.format.label) ? visualisation.format.label : 'UNKNOWN';
      },
      visualisationFormatTruncated(visualisation) {
        return this.getVisualisationFormat(visualisation).length > 4;
      },
      getVisualisationTitle(visualisation) {
        return visualisation.title ? getTranslationFor(visualisation.title, this.$route.query.locale, this.getLanguages) : truncate(visualisation.resource, 50);
      },
      getVisualisationDescription(visualisation) {
        return (has(visualisation, 'description') && !isNil(visualisation.description)) ? getTranslationFor(visualisation.description, this.$route.query.locale, this.getLanguages) : this.$t('message.catalogsAndDatasets.noDescriptionAvailable');
      },
      getVisualisationLink(distribution) {
        // Return Visualisation Link
        const accessUrl = distribution.downloadUrls && distribution.downloadUrls.length ? distribution.downloadUrls[0] : distribution.accessUrl[0];
        return `/data/visualisation/?file=${encodeURIComponent(accessUrl)}`;
      },
      dataServiceIsExpanded(id) {
        return this.expandedDataServices.includes(id);
      },
      dataServiceDescriptionIsExpanded(id) {
        return this.expandedDataServicesDescriptions.includes(id);
      },
      dataServiceDescriptionIsExpandable(description) {
        return isNil(description) ? false : description.length > this.dataServices.descriptionMaxChars;
      },
      getDataServiceTitle(dataService) {
        return dataService.title ? getTranslationFor(dataService.title, this.$route.query.locale, this.getLanguages) : truncate(dataService.endpoint_url[0], 50);
      },
      getDataServiceDescription(dataService) {
        return (has(dataService, 'description') && !isNil(dataService.description)) ? getTranslationFor(dataService.description, this.$route.query.locale, this.getLanguages) : this.$t('message.catalogsAndDatasets.noDescriptionAvailable');
      },
      getGeoLink(format, distributionID) {
        let f = format.toLowerCase();
        // Use correct Case Sensitive strings
        f = this.geoLinkFormats[f];
        // Return Geo Visualisation Link
        return `/geo-viewer/?dataset=${distributionID}&type=${f}&lang=${this.$route.query.locale}`;
      },
      // getSubjectLink(subject) {
      //   return { path: `/datasets?subject=${subject.id}`, query: Object.assign({}, { locale: this.$route.query.locale }) };
      // },
      toggleDistribution(id) {
        const index = this.expandedDistributions.indexOf(id);
        if (index > -1) this.expandedDistributions.splice(index, 1);
        else this.expandedDistributions.push(id);
      },
      toggleDistributionDescription(id) {
        const index = this.expandedDistributionDescriptions.indexOf(id);
        if (index > -1) this.expandedDistributionDescriptions.splice(index, 1);
        else this.expandedDistributionDescriptions.push(id);
      },
      togglePageDescription(id) {
        const index = this.expandedPageDescriptions.indexOf(id);
        if (index > -1) this.expandedPageDescriptions.splice(index, 1);
        else this.expandedPageDescriptions.push(id);
      },
      togglePage() {
        this.pages.isVisible = !this.pages.isVisible;
        $('[data-toggle="tooltip"]').tooltip({
          container: 'body',
        });
      },
      toggleVisualisation() {
        this.visualisations.isVisible = !this.visualisations.isVisible;
      },
      toggleVisualisationDescription(id) {
        const index = this.expandedVisualisationDescriptions.indexOf(id);
        if (index > -1) this.expandedVisualisationDescriptions.splice(index, 1);
        else this.expandedVisualisationDescriptions.push(id);
      },
      toggleDataServiceDescription(id) {
        const index = this.expandedDataServicesDescriptions.indexOf(id);
        if (index > -1) this.expandedDataServicesDescriptions.splice(index, 1);
        else this.expandedDataServicesDescriptions.push(id);
      },
      toggleDataServices() {
        this.dataServices.isVisible = !this.dataServices.isVisible;
      },
      toggleIsUsedBy() {
        this.isUsedBy.isVisible = !this.isUsedBy.isVisible;
      },
      setTranslationBanners() {
        if (!this.$i18n) return;
        const translationMetaData = this.getTranslationMetaData;
        // Check if translation of dataset is available in selected language
        if (!isNil(translationMetaData.details) && has(translationMetaData.details, this.$route.query.locale)) {
          // Check if dataset if machine translated
          this.machineTranslated = translationMetaData.details[this.$route.query.locale].machine_translated;
        } else {
          // No translation of this dataset available for the selected language
          this.translationNotAvailable = true;
        }
      },
      // Emit a Matomo event when user clicks on 'go to resource' element
      trackGoto() {
        const paq = window._paq || []; // eslint-disable-line
        // paq.push(['trackEvent', 'GoToResource', 'Clicked']);
        this.$piwik.trackGotoResource();
      },
      clamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
      },
      // Increases the current number of distributions displayed
      // and clamps the result so that it never exceeds the number of all distributions.
      increaseNumDisplayedDistributions(increment) {
        const clampedSum = this.clamp(this.distributions.displayCount + increment, 0, this.getDistributions.length);
        this.distributions.displayCount = clampedSum;
      },
      nonOverflowingIncrementsForDistributions(incrementStep) {
        return this.distributions.displayCount + incrementStep <= this.getDistributions.length;
      },
      // Increases the current number of distributions displayed
      // and clamps the result so that it never exceeds the number of all distributions.
      increaseNumDisplayedPages(increment) {
        const clampedSum = this.clamp(this.pages.displayCount + increment, 0, this.getPages.length);
        this.pages.displayCount = clampedSum;
      },
      nonOverflowingIncrementsForPages(incrementStep) {
        return this.pages.displayCount + incrementStep <= this.getPages.length;
      },
      // Increases the current number of distributions displayed
      // and clamps the result so that it never exceeds the number of all distributions.
      increaseNumDisplayedVisualisations(increment) {
        const clampedSum = this.clamp(this.visualisations.displayCount + increment, 0, this.getVisualisations.length);
        this.visualisations.displayCount = clampedSum;
      },
      nonOverflowingIncrementsForVisualisations(incrementStep) {
        return this.visualisations.displayCount + incrementStep <= this.getVisualisations.length;
      },
      piwikMetaPush() {
        this.$piwik.trackDatasetDetailsPageView(null, null, {
          dataset_AccessRights: this.getAccessRights,
          dataset_AccrualPeriodicity: this.getAccrualPeriodicity,
          dataset_Catalog: this.getCatalog,
          // dataset_Categories: this.getCategories,
          // dataset_ConformsTo: this.getConformsTo,
          // dataset_ContactPoints: this.getContactPoints,
          // dataset_Country: this.getCountry,
          // dataset_Creator: this.getCreator,
          // dataset_Description: this.getDescription,
          // dataset_Distributions: this.getDistributions,
          // dataset_DistributionFormats: this.getDistributionFormats,
          // dataset_Documentations: this.getDocumentations,
          // dataset_Frequency: this.getFrequency,
          // dataset_HasVersion: this.getHasVersion,
          dataset_ID: this.getID,
          // dataset_Identifiers: this.getIdentifiers,
          // dataset_IdName: this.getIdName,
          // dataset_IsVersionOf: this.getIsVersionOf,
          // datest_Keywords: this.getKeywords,
          // dataset_LandingPages: this.getLandingPagesResource,
          // dataset_Languages: this.getLanguages,
          // dataset_Licences: this.getLicences,
          // dataset_Loading: this.getLoading,
          // dataset_ModificationDate: this.getModificationDate,
          // dataset_OriginalLanguage: this.getOriginalLanguage,
          // dataset_OtherIdentifiers: this.getOtherIdentifiers,
          // dataset_Pages: this.getPages,
          // dataset_Provenances: this.getProvenances,
          dataset_Publisher: this.getPublisher,
          // dataset_RelatedResources: this.getRelatedResources,
          // dataset_ReleaseDate: this.getReleaseDate,
          // dataset_Sources: this.getSources,
          // dataset_Spatial: this.getSpatial,
          // dataset_SpatialResource: this.getSpatialResource,
          // dataset_Temporal: this.getTemporal,
          dataset_Title: this.getTitle,
          // dataset_TranslationMetaData: this.getTranslationMetaData,
          // dataset_VersionInfo: this.getVersionInfo,
          // dataset_VersionNotes: this.getVersionNotes,
        });
      },
      isUrlInvalid(url) {
        if (url) {
          try {
            /* eslint-disable no-useless-escape */
            return !(new RegExp("^((https?:\/\/(www\.)?)([-a-zA-Z0-9@:%._\+~#=]{1,256})([-a-zA-Z0-9()@:%_\+.~#?&//=]*))$", "i")).test(decodeURIComponent(url.split("=").pop()));
            /* eslint-enable no-useless-escape */
        } catch (e) {
            console.error(e);
          }
        }
      },
      openIfValidUrl(isValid, previewLinkCallback, distribution, event) {
        if (isValid) {
          // for (let key in this.$children) {
          //   if(this.$children[key].$refs["externalResourceModal"]) {
          //     this.$children[key].$refs["externalResourceModal"].openModal(previewLinkCallback(distribution), false);
          //   }
          // }
          this.openModal(previewLinkCallback(distribution), false);
        } else {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      showTooltipVisualiseButton(invalidUrl) {
        if (invalidUrl) {
          return  this.$t('message.tooltip.invalidVisualise');
        }
        return ''
      },
    },
    mounted() {
      this.useService(this.DatasetService);
      this.$Progress.start();
      this.loadingDatasetDetails = true;
      this.loadDatasetDetails(this.$route.params.ds_id)
        .then(() => {
          this.$Progress.finish();
          this.loadingDatasetDetails = false;
          this.datasetSchema = this.getSchemaOrg();
          this.piwikMetaPush();
          setTimeout(() => {
            if (typeof this.$piwik?.resume === "function") this.$piwik.resume();
          }, 500);
          this.$nextTick(() => {
          // Display/hide translation banners
            this.setTranslationBanners();
            $('[data-toggle="tooltip"]').tooltip({
              container: 'body',
            });
          });
        })
        .catch((err) => {
          console.warn(err); // eslint-disable-line
          this.$Progress.fail();
          if (typeof this.$piwik?.resume === "function") this.$piwik.resume();
          this.$router.replace({
            name: 'NotFound',
            query: { locale: this.$route.query.locale, dataset: this.$route.params.ds_id },
          });
        });
      this.loadQualityData(this.$route.params.ds_id)
        .then(() => {
          this.$Progress.finish();
        })
        .catch(() => {
          this.$Progress.fail();
        });
      this.loadQualityDistributionData(this.$route.params.ds_id)
        .then(() => {
          this.$Progress.finish();
        })
        .catch(() => {
          this.$Progress.fail();
        });
      this.$root.$on('date-incorrect', () => {
        this.dateIncorrect = true;
      });

      const distributionsConf = this.$env.datasetDetails && this.$env.datasetDetails.distributions;
      if (distributionsConf) {
        this.distributions.displayAll = distributionsConf.displayAll || this.distributions.displayAll;
        this.distributions.displayCount = parseInt(distributionsConf.displayCount, 10) || this.distributions.displayCount;

        if (typeof distributionsConf.incrementSteps === 'string') {
          // Need to parse as json array since env variables are string only
          distributionsConf.incrementSteps = JSON.parse(distributionsConf.incrementSteps);
        }
        this.distributions.incrementSteps = distributionsConf.incrementSteps || this.distributions.incrementSteps;
      }

      if (this.distributions.displayAll) this.distributions.displayCount = this.getDistributions.length;

      const pagesConf = this.$env.datasetDetails && this.$env.datasetDetails.pages;
      if (pagesConf) {
        this.pages.displayAll = pagesConf.displayAll || this.pages.displayAll;
        this.pages.displayCount = parseInt(pagesConf.displayCount, 10) || this.pages.displayCount;

        if (typeof pagesConf.incrementSteps === 'string') {
          // Need to parse as json array since env variables are string only
          pagesConf.incrementSteps = JSON.parse(pagesConf.incrementSteps);
        }
        this.pages.incrementSteps = pagesConf.incrementSteps || this.pages.incrementSteps;
      }

      if (this.pages.displayAll) this.pages.displayCount = this.getPages.length;

      const dataServicesConf = this.$env.datasetDetails && this.$env.datasetDetails.dataServices;
      if (dataServicesConf) {
        this.dataServices.displayAll = dataServicesConf.displayAll || this.dataServices.displayAll;
        this.dataServices.displayCount = parseInt(dataServicesConf.displayCount, 10) || this.dataServices.displayCount;

        if (typeof dataServicesConf.incrementSteps === 'string') {
          // Need to parse as json array since env variables are string only
          dataServicesConf.incrementSteps = JSON.parse(dataServicesConf.incrementSteps);
        }
        this.dataServices.incrementSteps = dataServicesConf.incrementSteps || this.dataServices.incrementSteps;
      }

      if (this.dataServices.displayAll) this.dataServices.displayCount = this.getDataServices.length;
    },
    beforeDestroy() {
      $('.tooltip').remove();
    },
    destroyed() {
      this.$root.$off('date-incorrect');
    },
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

  .d-inline-table {
    display: inline-table;
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
