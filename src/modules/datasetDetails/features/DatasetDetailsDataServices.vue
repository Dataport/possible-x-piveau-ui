<template>
  <div class="dsd-feature">
    <dataset-details-feature-header
      :title="`${$t('message.metadata.dataServices')} (${getDataServices ? getDataServices.length.toLocaleString('fi') : 0})`"
      :arrowDown="!dataServices.isVisible"
      tag="documentation-toggle"
      :onClick="toggleDataServices"
    />
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
</template>

<script>
import {getTranslationFor, truncate} from "@/modules/utils/helpers";
import {has, isNil} from "lodash";
import AppLink from "@/modules/widgets/AppLink";
import {mapGetters} from "vuex";
import DatasetDetailsFeatureHeader
  from "@/modules/datasetDetails/features/DatasetDetailsFeatureHeader";

export default {
  name: "DatasetDetailsDataServices",
  components: {DatasetDetailsFeatureHeader, AppLink},
  props: {
    getDataServices: Array,
    nonOverflowingIncrementsForPages: Function,
    increaseNumDisplayedPages: Function,
    trackGoto: Function
  },
  data() {
    return {
      dataServices: {
        isVisible: this.$env.content.datasetDetails.dataServices.isVisible,
        displayAll: this.$env.content.datasetDetails.dataServices.displayAll,
        displayCount: this.$env.content.datasetDetails.dataServices.displayCount,
        incrementSteps: this.$env.content.datasetDetails.dataServices.incrementSteps,
        descriptionMaxLines: this.$env.content.datasetDetails.dataServices.descriptionMaxLines,
        descriptionMaxChars: this.$env.content.datasetDetails.dataServices.descriptionMaxChars,
      },
      expandedDataServicesDescriptions: [],
      expandedDataServices: [],
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getLanguages'
    ]),
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
    truncate,
    toggleDataServiceDescription(id) {
      const index = this.expandedDataServicesDescriptions.indexOf(id);
      if (index > -1) this.expandedDataServicesDescriptions.splice(index, 1);
      else this.expandedDataServicesDescriptions.push(id);
    },
    toggleDataServices() {
      this.dataServices.isVisible = !this.dataServices.isVisible;
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
    }
  },
  mounted() {
    const dataServicesConf = this.$env.content.datasetDetails && this.$env.content.datasetDetails.dataServices;
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
  }
}
</script>
