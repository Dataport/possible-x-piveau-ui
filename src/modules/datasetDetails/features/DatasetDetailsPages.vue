<template>
  <div class="dsd-feature">
    <dataset-details-feature-header
      :title="`${$t('message.metadata.documentations')} (${getPages ? getPages.length.toLocaleString('fi') : 0})`"
      :arrowDown="!pages.isVisible"
      tag="documentation-toggle"
      :onClick="togglePage"
    />
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
</template>

<script>
import $ from "jquery";
import {getTranslationFor, truncate} from "@/modules/utils/helpers";
import {has, isNil} from "lodash";
import AppLink from "@/modules/widgets/AppLink";
import {mapGetters} from "vuex";
// DatasetDetailsFeatureHeader is imported globally
// import DatasetDetailsFeatureHeader
//   from "@/modules/datasetDetails/features/DatasetDetailsFeatureHeader";

export default {
  name: "DatasetDetailsPages",
  components: {
    // DatasetDetailsFeatureHeader,
    AppLink},
  props: {
    pages: Object,
    increaseNumDisplayedPages: Function,
    nonOverflowingIncrementsForPages: Function,
    trackGoto: Function
  },
  data() {
    return {
      expandedPageDescriptions: [],
      expandedPages: []
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getPages'
    ]),
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
    }
  },
  methods: {
    truncate,
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
    pageDescriptionIsExpanded(id) {
      return this.expandedPageDescriptions.includes(id);
    },
    pageDescriptionIsExpandable(description) {
      return isNil(description) ? false : description.length > this.pages.descriptionMaxChars;
    },
    pageIsExpanded(id) {
      return this.expandedPages.includes(id);
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
    }
  }
}
</script>

<style scoped>
.heading, .arrow {
  cursor: pointer;
}
</style>
