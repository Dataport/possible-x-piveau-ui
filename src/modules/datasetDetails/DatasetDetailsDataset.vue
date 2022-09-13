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
    <div class="mt-5" v-if="showArray(getRelations)">
      <div class="row">
        <div class="d-none d-lg-block col-1 my-auto pr-0 text-right"
              @click="toggleRelatedResources()">
          <span class="arrow text-dark"
                v-if="!relatedResources.isVisible">
            <i class="material-icons">keyboard_arrow_down</i>
          </span>
          <span class="arrow text-dark" v-else>
            <i class="material-icons">keyboard_arrow_up</i>
          </span>
        </div>
        <div class="col-11 py-2 bg-white">
          <h2 class="heading"
              data-cy="documentation-toggle"
              @click="toggleRelatedResources()">{{ $t('message.datasetDetails.relatedResources') }} ({{ getRelations ? getRelations.length.toLocaleString('fi') : 0 }})</h2>
        </div>
        <span v-if="relatedResources.isVisible" class="list list-unstyled col-12">
          <hr>
            <ul class="sectionList" v-if="getRelations.length != null || getRelations != undefined ">
                <li v-for="(link, i) in getRelations" :key="i">
                  <a :href="link" target="_blank">{{link}}</a>
                </li>
            </ul>
          <hr>
        </span>
      </div>
    </div>

    <!-- MAP -->
    <div class="mt-5"
          v-if="showObjectArray(getSpatial)">
      <div class="row">
        <div class="d-none d-lg-block col-1 my-auto pr-0 text-right"
              @click="toggleMap()">
          <span class="arrow text-dark"
                v-if="!mapVisible">
            <i class="material-icons">keyboard_arrow_down</i>
          </span>
          <span class="arrow text-dark" v-else>
            <i class="material-icons">keyboard_arrow_up</i>
          </span>
        </div>
        <div class="col-11 py-2 bg-white">
          <h2 class="heading"
              data-cy="geo-info-toggle"
              @click="toggleMap()">{{ $t('message.datasetDetails.geoInfo') }}</h2>
        </div>
        <div class="d-block d-lg-none col-1 my-auto pr-0 text-right"
              @click="toggleMap()">
          <span class="arrow text-dark"
                v-if="!mapVisible">
            <i class="material-icons">keyboard_arrow_down</i>
          </span>
          <span class="arrow text-dark" v-else>
            <i class="material-icons">keyboard_arrow_up</i>
          </span>
        </div>
        <div class="col-12 col-lg-11 offset-lg-1">
          <div id="collapse-geo-info"
               ref="geocollapse"
               class="collapse show"
               data-cy="geo-info">
            <div class="map">
              <map-basic :location="getCoordinates()"
                         :spatial-type="getSpatialType()"
                         :height="maps.height"
                         :width="maps.width"
                         :map-container-id="maps.mapContainerId"></map-basic>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- INFO -->
    <div class="mt-5">
      <div class="row">
        <div class="col-12 mb-2">
          <div class="row">
            <div class="d-none d-lg-block col-1 my-auto pr-0 text-right"
                  @click="toggleInfo()">
              <span class="arrow text-dark"
                    v-if="!infoVisible">
                <i class="material-icons">keyboard_arrow_down</i>
              </span>
              <span class="arrow text-dark" v-else>
                <i class="material-icons">keyboard_arrow_up</i>
              </span>
            </div>
            <div class="col-11 py-2 bg-white">
              <h2 class="heading"
                  data-cy="additional-information-toggle"
                  @click="toggleInfo()">{{ $t('message.datasetDetails.additionalInfo') }}</h2>
            </div>
            <div class="d-block d-lg-none col-1 my-auto pr-0 text-right"
                  @click="toggleInfo()">
              <span class="arrow text-dark"
                    v-if="!infoVisible">
                <i class="material-icons">keyboard_arrow_down</i>
              </span>
              <span class="arrow text-dark" v-else>
                <i class="material-icons">keyboard_arrow_up</i>
              </span>
            </div>
            <div class="col-12 col-lg-11 offset-lg-1 bg-light"
                  data-cy="additional-information"
                  v-show="infoVisible">
              <table class="table table-borderless table-responsive"  id="myTab" role="tablist">
                <tr v-if="showArray(getLandingPagesResource)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.landingPage')">
                         {{ $t('message.metadata.landingPage') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(landingPage, i) of getLandingPagesResource" :key="i">
                      <app-link v-if="!isNil(landingPage)" :to="landingPage">{{ truncate(landingPage, 75) }}</app-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getSources)">
                  <td class="w-25 font-weight-bold">{{ $t('message.metadata.sources') }}</td>
                  <td>
                    <div v-for="(source, i) of getSources" :key="i">
                      <app-link v-if="!isNil(source) && isString(source)" :to="source">{{ source }}</app-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="showString(getModificationDate)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.updated')">
                        {{ $t('message.metadata.updated') }}
                    </tooltip>
                  </td>
                  <td>{{ filterDateFormatEU(getModificationDate) }}</td>
                </tr>
                <tr v-if="showString(getReleaseDate)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.created')">
                       {{ $t('message.metadata.created') }}
                    </tooltip>
                  </td>
                  <td>{{ filterDateFormatEU(getReleaseDate) }}</td>
                </tr>
                <tr v-if="showArray(getLanguages)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.language')">
                      {{ $t('message.metadata.languages') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(language, i) of getLanguages" :key="i">
                      <app-link v-if="!isNil(language) && isString(language.label) && isString(language.resource)" :to="language.resource">{{ language.label }}</app-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="showObjectArray(getSpatial)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.spatial')">
                       {{ $t('message.metadata.spatial') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(spatial, i) of getSpatial" :key="i">
                      <div v-if="has(spatial, 'coordinates') && !isNil(spatial.coordinates)">
                        {{ $t('message.metadata.coordinates') }}:
                        {{ spatial.coordinates }}
                      </div>
                      <div v-if="has(spatial, 'type') && !isNil(spatial.type)">
                        {{ $t('message.metadata.type') }}:
                        {{ spatial.type }}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getSpatialResource)">
                  <td class="w-25 font-weight-bold">{{ $t('message.metadata.spatialResource') }}</td>
                  <td>
                    <div v-for="(spatialResource, i) of getSpatialResource.map(s => s.resource || '')" :key="i">
                      <app-link v-if="!isNil(spatialResource)" :to="spatialResource">{{ truncate(spatialResource, 75) }}</app-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="showObject(getPublisher)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.publisher')">
                       {{ $t('message.metadata.publisher') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-if="has(getPublisher, 'name') && !isNil(getPublisher.name)">
                      {{ $t('message.metadata.name') }}:
                      {{ getPublisher.name }}
                    </div>
                    <div v-if="has(getPublisher, 'email') && !isNil(getPublisher.email)">
                      {{ $t('message.metadata.email') }}:
                      <app-link :to="`mailto:${removeMailtoOrTel(getPublisher.email)}`">{{ removeMailtoOrTel(getPublisher.email) }}</app-link>
                    </div>
                    <div v-if="has(getPublisher, 'homepage') && !isNil(getPublisher.homepage)">
                      {{ $t('message.metadata.homepage') }}:
                      <a :href="getPublisher.homepage">{{ truncate(getPublisher.homepage, 75) }}</a>
                    </div>
                  </td>
                </tr>
                <tr v-if="showObjectArray(getContactPoints) && showContactPoint(getContactPoints)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.contactPoints')">
                       {{ $t('message.metadata.contactPoints') }}
                    </tooltip>
                    </td>
                  <td>
                    <div v-for="(contactPoint, i) in getContactPoints" :key="i">
                      <div v-if="has(contactPoint, 'name') && !isNil(contactPoint.name)">
                        {{ $t('message.datasetDetails.contactPoints.organizationName') }}:
                        {{contactPoint.name}}
                      </div>
                      <div v-if="has(contactPoint, 'email') && !isNil(contactPoint.email)">
                        {{ $t($t('message.metadata.email')) }}:
                        <app-link :to="`mailto:${removeMailtoOrTel(contactPoint.email)}`">{{ removeMailtoOrTel(contactPoint.email) }}</app-link>
                      </div>
                      <div v-if="has(contactPoint, 'telephone') && !isNil(contactPoint.telephone)">
                        {{ $t('message.metadata.telephone') }}:
                        <app-link :to="`tel:${removeMailtoOrTel(contactPoint.telephone)}`">{{ removeMailtoOrTel(contactPoint.telephone) }}</app-link>
                      </div>
                      <div v-if="has(contactPoint, 'address') && !isNil(contactPoint.address)">
                        {{ $t('message.metadata.address') }}:
                        {{contactPoint.address}}
                      </div>
                      <div v-if="has(contactPoint, 'url') && showArray(contactPoint.url)" class="d-flex">
                        URL:
                        <div class="ml-1">
                          <div v-for="(url, i) of contactPoint.url" :key="i">
                            <div v-if="showString(url)">
                              <app-link :to="url">{{ truncate(url, 75) }}</app-link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <br>
                    </div>
                  </td>
                </tr>
                <tr v-if="showObjectArray(getConformsTo)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.conformsTo')">
                      {{ $t('message.metadata.conformsTo') }}
                    </tooltip>
                  </td>
                  <td >
                    <div v-for="(conformTo, i) in getConformsTo" :key="i">
                      <div v-if="has(conformTo, 'title') && !isNil(conformTo.title)">
                        {{ $t('message.metadata.label') }}:
                        {{ conformTo.title}}
                      </div>
                      <div v-if="has(conformTo, 'resource') && !isNil(conformTo.resource)">
                        {{ $t('message.metadata.resource') }}:
                        <app-link :to="conformTo.resource"
                                  target="_blank"
                                  @click="$emit('track-link', conformTo.resource, 'link')">
                          {{ truncate(conformTo.resource, 75) }}
                        </app-link>
                      </div>
                      <br>
                    </div>
                  </td>
                </tr>
                <tr v-if="showObjectArray(getProvenances)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.provenance')">
                      {{ $t('message.metadata.provenances') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(provenance, i) in getProvenances" :key="i">
                      <div v-if="has(provenance, 'label') && !isNil(provenance.label)">
                        {{ $t('message.metadata.label') }}:
                        {{ provenance.label }}
                      </div>
                      <div v-if="has(provenance, 'resource') && !isNil(provenance.resource)">
                        {{ $t('message.metadata.resource') }}:
                        <app-link :to="provenance.resource">{{ truncate(provenance.resource, 75) }}</app-link>
                      </div>
                      <br>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getRelatedResources)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.relatedResource')">
                     {{ $t('message.metadata.relatedResources') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(resource, i) of getRelatedResources" :key="i">
                      <app-link v-if="!isNil(resource)" :to="resource">{{ truncate(resource, 75) }}</app-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getIdentifiers)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.identifier')" >
                      {{ $t('message.metadata.identifiers') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(identifier, i) of getIdentifiers" :key="i">
                      <app-link :to="appendCurrentLocaleToURL(identifier)" v-if="showString(identifier)">
                        {{ truncate(identifier, 75) }}
                      </app-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="showObjectArray(getOtherIdentifiers)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.otherIdentifier')" >
                      {{ $t('message.metadata.otherIdentifiers') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(otherIdentifier, i) of getOtherIdentifiers" :key="i">
                      <div  v-if="has(otherIdentifier, 'identifier') && !isNil(otherIdentifier.identifier)">
                        {{ $t('message.metadata.identifier') }}:
                        <app-link :to="otherIdentifier.resource || otherIdentifier.identifier">
                          {{ otherIdentifier.identifier }}
                        </app-link>
                      </div>
                      <div v-if="has(otherIdentifier, 'scheme') && !isNil(otherIdentifier.scheme)">
                        {{ $t('message.metadata.scheme') }}:
                        <app-link :to="otherIdentifier.scheme">
                          {{ otherIdentifier.scheme }}
                        </app-link>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getDocumentations)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.documentation')" >
                       {{ $t('message.metadata.documentations') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(documentation, i) of getDocumentations" :key="i">
                      <app-link v-if="!isNil(documentation)" :to="documentation">{{ truncate(documentation, 75) }}</app-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="showObject(getFrequency)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.frequency')" >
                       {{ $t('message.metadata.frequency') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-if="has(getFrequency, 'title') && !isNil(getFrequency.title)">
                      {{ getFrequency.title }}
                    </div>
                    <div v-if="has(getFrequency, 'resource') && !isNil(getFrequency.resource)">
                      <app-link :to="getFrequency.resource">{{ truncate(getFrequency.resource, 75) }}</app-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="showObject(getAccessRights)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.distributions.rights')" >
                       {{ $t('message.metadata.accessRights') }}
                    </tooltip>
                  </td>
                  <td v-if="has(getAccessRights, 'label') && !isNil(getAccessRights.label)">{{ getAccessRights.label }}</td>
                </tr>
                <tr v-if="showString(getAccrualPeriodicityLabel)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.frequency')" >
                       {{ $t('message.metadata.accrualPeriodicity') }}
                    </tooltip>
                  </td>
                  <td v-if="!isNil(getAccrualPeriodicityLabel)">{{ getAccrualPeriodicityLabel }}</td>
                </tr>
                <tr v-if="showObject(getCreator)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.creator')" >
                        {{ $t('message.metadata.creator') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-if="has(getCreator, 'name') && !isNil(getCreator.name)">
                      {{ $t('message.metadata.name') }}:
                      {{ getCreator.name }}
                    </div>
                    <div v-if="has(getCreator, 'email') && !isNil(getCreator.email)">
                      {{ $t('message.metadata.email') }}:
                      <app-link :to="`mailto:${removeMailtoOrTel(getCreator.email)}`">{{ truncate(removeMailtoOrTel(getCreator.email), 75) }}</app-link>
                    </div>
                    <div v-if="has(getCreator, 'homepage') && !isNil(getCreator.homepage)">
                      {{ $t('message.metadata.homepage') }}:
                      <app-link :to="getCreator.homepage">{{ truncate(getCreator.homepage, 75) }}</app-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getHasVersion)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.hasVersion')" >
                        {{ $t('message.metadata.hasVersion') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(hasVersion, i) of getHasVersion" :key="i">
                        <div v-if="!isNil(hasVersion) && isString(hasVersion)">
                          <app-link :to="hasVersion">{{ truncate(hasVersion, 75) }}</app-link>
                        </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getIsVersionOf)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.versionOf')" >
                        {{ $t('message.metadata.isVersionOf') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(isVersionOf, i) of getIsVersionOf" :key="i">
                      <div v-if="!isNil(isVersionOf) && isString(isVersionOf)">
                        <app-link :to="isVersionOf">{{ truncate(isVersionOf, 75) }}</app-link>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showObjectArray(getTemporal)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.distributions.temporalResolution')" >
                        {{ $t('message.metadata.temporal') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(temporal, i) of getTemporal" :key="i">
                        <div v-if="has(temporal, 'gte') && !isNil(temporal.gte) && has(temporal, 'lte') && !isNil(temporal.lte)">{{ filterDateFormatEU(temporal.gte) }} - {{ filterDateFormatEU(temporal.lte) }}</div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showString(getVersionInfo)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.versionInfo')" >
                        {{ $t('message.metadata.versionInfo') }}
                    </tooltip>
                  </td>
                  <td v-if="!isNil(getVersionInfo)">{{ getVersionInfo }}</td>
                </tr>
                <tr v-if="showObject(getVersionNotes)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.versionNotes')" >
                         {{ $t('message.metadata.versionNotes') }}
                    </tooltip>
                  </td>
                  <td>{{ getTranslationFor(getVersionNotes) }}</td>
                </tr>

                <tr v-if="showObject(getCatalogRecord)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.catalogRecord')" >
                         {{ $t('message.metadata.catalogRecord') }}
                    </tooltip>
                    </td>
                  <td>
                    <div v-if="getCatalogRecord.issued" class="catalogue-label">{{ `${$t('message.metadata.addedToDataEuropaEU')}:\n${filterDateFormatEU(getCatalogRecord.issued)}` }}</div>
                    <div v-if="getCatalogRecord.modified" class="catalogue-label" :class="{'mt-1': getCatalogRecord.issued}">{{ `${$t('message.metadata.updatedOnDataEuropaEU')}:\n${filterDateFormatEU(getCatalogRecord.modified)}` }}</div>
                  </td>
                </tr>
                <tr v-if="showArray(getAttributes)">
                  <td class="w-25 font-weight-bold">{{ $t('message.metadata.attributes') }}</td>
                  <td>
                    <div v-for="(attribute, i) of getAttributes" :key="i">
                      <div v-if="showString(attribute)">
                        <app-link :to="attribute">{{ truncate(attribute, 75) }}</app-link>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getDimensions)">
                  <td class="w-25 font-weight-bold">{{ $t('message.metadata.dimensions') }}</td>
                  <td>
                    <div v-for="(dimension, i) of getDimensions" :key="i">
                      <div v-if="showString(dimension)">
                        <app-link :to="dimension">{{ truncate(dimension, 75) }}</app-link>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showNumber(getNumSeries)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.numSeries')" >
                         {{ $t('message.metadata.numSeries') }}
                    </tooltip>
                  </td>
                  <td>
                    {{ getNumSeries }}
                  </td>
                </tr>
                <tr v-if="showArray(getHasQualityAnnotations)">
                  <td class="w-25 font-weight-bold">{{ $t('message.metadata.qualityAnnotations') }}</td>
                  <td>
                    <div v-for="(hasQualityAnnotation, i) of getHasQualityAnnotations" :key="i">
                      <div v-if="showString(hasQualityAnnotation)">
                        <app-link :to="hasQualityAnnotation">{{ truncate(hasQualityAnnotation, 75) }}</app-link>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getStatUnitMeasures)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.unitsOfMeasurement')" >
                          {{ $t('message.metadata.unitsOfMeasurement') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(statUnitMeasure, i) of getStatUnitMeasures" :key="i">
                      <div v-if="showString(statUnitMeasure)">
                        <app-link :to="statUnitMeasure">{{ truncate(statUnitMeasure, 75) }}</app-link>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showString(getResource)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.uriRef')">
                      URIref
                    </tooltip>
                  </td>
                  <td>
                    <a :href="appendCurrentLocaleToURL(getResource)">{{ truncate(getResource, 75) }}</a>
                  </td>
                </tr>
                <tr v-if="showArray(getIsReferencedBy)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.isReferencedBy')">
                      {{ $t('message.metadata.isReferencedBy') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(reference, i) of getIsReferencedBy" :key="i">
                      <div v-if="showString(reference)">
                        <a :href="appendCurrentLocaleToURL(reference)">{{ truncate(reference, 75) }}</a>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getQualifiedAttributions)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.qualifiedAttribution')">
                      {{ $t('message.metadata.qualifiedAttribution') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(qualifiedAttribution, i) of getQualifiedAttributions" :key="i">
                      <div v-if="showString(qualifiedAttribution)">
                        <a :href="appendCurrentLocaleToURL(qualifiedAttribution)">{{ truncate(qualifiedAttribution, 75) }}</a>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getWasGeneratedBy)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.wasGeneratedBy')">
                      {{ $t('message.metadata.wasGeneratedBy') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(wasGeneratedBy, i) of getWasGeneratedBy" :key="i">
                      <div v-if="showString(wasGeneratedBy)">
                        <a :href="appendCurrentLocaleToURL(wasGeneratedBy)">{{ truncate(wasGeneratedBy, 75) }}</a>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showObjectArray(getQualifiedRelations)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.qualifiedRelation')" >
                        {{ $t('message.metadata.qualifiedRelation') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(qualifiedRelation, i) of getQualifiedRelations" :key="i">
                      <div v-if="has(qualifiedRelation, 'relation') && !isNil(qualifiedRelation.relation)">
                        {{ $t('message.metadata.relation') }}:
                        <div v-for="(relation, i) of qualifiedRelation.relation" :key="i" class="d-inline-table">
                          <div v-if="showString(relation)">
                            <a :href="appendCurrentLocaleToURL(relation)">{{ truncate(relation, 75) }}</a>
                          </div>
                        </div>
                      </div>
                      <div v-if="has(qualifiedRelation, 'had_role') && !isNil(qualifiedRelation.had_role)">
                        {{ $t('message.metadata.role') }}:
                        <div v-for="(role, i) of qualifiedRelation.had_role" :key="i" class="d-inline-table">
                          <div v-if="showString(role)">
                            <a :href="appendCurrentLocaleToURL(role)">{{ truncate(role, 75) }}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getSample)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.sample')">
                      {{ $t('message.metadata.sample') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(sample, i) of getSample" :key="i">
                      <div v-if="showString(sample)">
                        <a :href="appendCurrentLocaleToURL(sample)">{{ truncate(sample, 75) }}</a>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getSpatialResolutionInMeters)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.spatialResolutionInMeters')">
                      {{ $t('message.metadata.spatialResolutionInMeters.label') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-if="showNumber(getSpatialResolutionInMeters[0])">
                      {{ $t('message.metadata.spatialResolutionInMeters.value', {number: getSpatialResolutionInMeters[0]}) }}
                    </div>
                  </td>
                </tr>
                <tr v-if="showObject(getType)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.type')">
                       {{ $t('message.metadata.type') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-if="has(getType, 'label') && !isNil(getType.label)">
                      {{ $t('message.metadata.label') }}:
                      {{ getType.label }}
                    </div>
                    <div v-if="has(getType, 'resource') && !isNil(getType.resource)">
                      {{ $t('message.metadata.resource') }}:
                      <a :href="appendCurrentLocaleToURL(getType.resource)">{{ truncate(getType.resource, 75) }}</a>
                    </div>
                  </td>
                </tr>
                <tr v-if="showArray(getTemporalResolution)">
                  <td class="w-25 font-weight-bold">
                    <tooltip :title="$t('message.tooltip.datasetDetails.temporalResolution')">
                      {{ $t('message.metadata.temporalResolution') }}
                    </tooltip>
                  </td>
                  <td>
                    <div v-for="(temporalResolution, i) of getTemporalResolution" :key="i">
                      {{ temporalResolution }}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  import MapBasic from '../map/MapBasic.vue';
  import AppLink from '../widgets/AppLink.vue';
  import Tooltip from '../widgets/Tooltip.vue';
  import Distributions from './distributions/Distributions.vue';
  import dateFilters from '../filters/dateFilters';
  import {
    getTranslationFor, getCountryFlagImg, truncate, removeMailtoOrTel, replaceHttp, appendCurrentLocaleToURL
  } from '../utils/helpers';
  import ResourceAccessPopup from '../widgets/ResourceAccessPopup.vue';
  import DatasetDetailsBanners from "@/modules/datasetDetails/DatasetDetailsBanners.vue";
  import DatasetDetailsDescription from "@/modules/datasetDetails/DatasetDetailsDescription.vue";
  import DatasetDetailsKeywords from "@/modules/datasetDetails/DatasetDetailsKeywords.vue";
  import DatasetDetailsSubject from "@/modules/datasetDetails/DatasetDetailsSubject.vue";

  export default {
    name: 'datasetDetailsDataset',
    dependencies: 'DatasetService',
    components: {
      DatasetDetailsSubject,
      DatasetDetailsKeywords,
      DatasetDetailsDescription,
      DatasetDetailsBanners,
      AppLink,
      MapBasic,
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
        mapVisible: true,
        infoVisible: true,
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
        },
        relatedResources: {
          isVisible: this.$env.datasetDetails.relatedResources.isVisible,
        },
        maps: {
          location: this.$env.maps.location,
          spatialType: this.$env.maps.spatialType,
          height: this.$env.maps.height,
          width: this.$env.maps.width,
          mapContainerId: this.$env.maps.mapContainerId,
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
      'getOriginalLanguage',
      'getAccrualPeriodicity',
      'getAttributes',
      'getCatalog',
      'getCatalogRecord',
      'getCategories',
      'getConformsTo',
      'getContactPoints',
      'getCountry',
      'getCreator',
      'getDescription',
      'getDimensions',
      'getDistributions',
      'getDistributionFormats',
      'getDocumentations',
      'getExtendedMetadata',
      'getFrequency',
      'getHasQualityAnnotations',
      'getHasVersion',
      'getID',
      'getIdentifiers',
      'getIdName',
      'getIsReferencedBy',
      'getIsVersionOf',
      'getSubject',
      'getLandingPages',
      'getLanguages',
      'getLicences',
      'getLoading',
      'getModificationDate',
      'getNumSeries',
      'getOtherIdentifiers',
      'getPages',
      'getProvenances',
      'getPublisher',
      'getRelations',
      'getRelatedResources',
      'getReleaseDate',
      'getResource',
      'getSample',
      'getSources',
      'getSpatial',
      'getSpatialResolutionInMeters',
      'getSpatialResource',
      'getStatUnitMeasures',
      'getTemporal',
      'getTemporalResolution',
      'getTranslationMetaData',
      'getTitle',
      'getType',
      'getVersionInfo',
      'getVersionNotes',
      'getVisualisations',
      'getQualifiedAttributions',
      'getQualifiedRelations',
      'getQualityDistributionData',
      'getWasGeneratedBy',
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
      // Provides resource data only of landing pages
      // Example: [{ format: 'bar', resource: 'foo' }, ...] -> ['foo']
      getLandingPagesResource() {
        return isArray(this.getLandingPages) && this.getLandingPages.map(value => value && value.resource);
      },
      // Returns the label property of accrual periodicity
      getAccrualPeriodicityLabel() {
        return (this.getAccrualPeriodicity && this.getAccrualPeriodicity.label)
          || this.getAccrualPeriodicity;
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
      removeMailtoOrTel,
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
      showContactPoint(contactPoints) {
        return Object.keys(contactPoints[0]).filter(contactPoint => contactPoint !== 'resource' && contactPoint !== 'type').length > 0;
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
      getCoordinates() {
        const coordinates = this.getSpatial[0].coordinates;
        return (!isNil(coordinates) && isArray(coordinates) && isArray(coordinates[0])) ? [coordinates[0], this.maps.location[1]] : this.maps.location;
      },
      getSpatialType() {
        const type = this.getSpatial[0].type;
        return (!isNil(type) && isString(type)) ? type : this.maps.spatialType;
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
      toggleRelatedResources() {
        this.relatedResources.isVisible = !this.relatedResources.isVisible;
      },
      toggleMap() {
        this.$refs.geocollapse.classList.toggle('show');
        this.mapVisible = !this.mapVisible;
      },
      toggleInfo() {
        this.infoVisible = !this.infoVisible;
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
