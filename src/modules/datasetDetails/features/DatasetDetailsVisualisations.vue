<template>
  <div class="dsd-feature">
    <dataset-details-feature-header
      :title="`${$t('message.metadata.visualisations')} (${getVisualisations ? getVisualisations.length.toLocaleString('fi') : 0})`"
      :arrowDown="!visualisations.isVisible"
      :onClick="toggleVisualisation"
    />
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
</template>

<script>
import {has, isNil} from "lodash";
import {getTranslationFor, truncate} from "@/modules/utils/helpers";
import {mapGetters} from "vuex";
import AppLink from "@/modules/widgets/AppLink";
import DatasetDetailsFeatureHeader
  from "@/modules/datasetDetails/features/DatasetDetailsFeatureHeader";

export default {
  name: "DatasetDetailsVisualisations",
  components: {DatasetDetailsFeatureHeader, AppLink},
  props: {
    trackGoto: Function
  },
  data() {
    return {
      expandedVisualisationDescriptions: [],
      expandedVisualisations: [],
      visualisations: {
        isVisible: this.$env.datasetDetails.visualisations.isVisible,
        displayAll: this.$env.datasetDetails.visualisations.displayAll,
        displayCount: this.$env.datasetDetails.visualisations.displayCount,
        incrementSteps: this.$env.datasetDetails.visualisations.incrementSteps,
        descriptionMaxLines: this.$env.datasetDetails.visualisations.descriptionMaxLines,
        descriptionMaxChars: this.$env.datasetDetails.visualisations.descriptionMaxChars,
      }
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getLanguages',
      'getVisualisations'
    ]),
    isVisualisationsAllDisplayed() {
      return this.visualisations.displayCount === this.getVisualisations.length;
    },
    remainingVisualisations() {
      return this.getVisualisations.length - this.visualisations.displayCount;
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
    }
  },
  methods: {
    truncate,
    toggleVisualisation() {
      this.visualisations.isVisible = !this.visualisations.isVisible;
    },
    toggleVisualisationDescription(id) {
      const index = this.expandedVisualisationDescriptions.indexOf(id);
      if (index > -1) this.expandedVisualisationDescriptions.splice(index, 1);
      else this.expandedVisualisationDescriptions.push(id);
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
    // Increases the current number of distributions displayed
    // and clamps the result so that it never exceeds the number of all distributions.
    increaseNumDisplayedVisualisations(increment) {
      const clampedSum = this.clamp(this.visualisations.displayCount + increment, 0, this.getVisualisations.length);
      this.visualisations.displayCount = clampedSum;
    },
    nonOverflowingIncrementsForVisualisations(incrementStep) {
      return this.visualisations.displayCount + incrementStep <= this.getVisualisations.length;
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
    clamp(n, min, max) {
      return Math.min(Math.max(n, min), max);
    }
  }
}
</script>

<style scoped lang="scss">
.heading, .arrow {
  cursor: pointer;
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

</style>
