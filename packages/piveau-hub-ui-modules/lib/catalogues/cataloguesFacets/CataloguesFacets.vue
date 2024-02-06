<template>
  <div class="container catalog-facets">
    <div class="row mx-3 mr-md-0">
      <div class="col">
        <catalog-details-facet
            class="catalog-details"
            :catalog="superCatalog"
            :catalogLanguageIds="catalogLanguageIds"
        />
        <span v-if="showFacetsTitle" class="row h5 font-weight-bold mt-4 mb-3">Filter by</span>
        <settings-facet
          v-if="!showCatalogDetails"
          class="row facet-field mb-3"
        />
        <div class="row facet-field mb-3"
             v-for="(field, index) in getSortedFacets"
             :key="`facet@${index}`"
             :class="{'mt-3': (index > 0)}"
        >
          <radio-facet
              v-if="field.id === 'superCatalog'"
              :title="erpd.title"
              :property="erpd.property"
              :toolTipTitle="erpd.toolTipTitle"
              :optionIds="['true', 'false']"
              :optionLabels="[erpd.yes, erpd.no]"
              :initialOption="isErpd()"
              :change="changeErpd"
          />
          <select-facet
              v-if="field.id !== 'superCatalog'"
            :fieldId="field.id"
            :header="facetTitle(field.id)"
            :items="sortByCount(field.items, field.id)"
            :getFacetTranslationWrapper="getFacetTranslation"
            :facetIsSelected="facetIsSelected"
            :facetClicked="facetClicked"
            :multiSelect="field.id !== 'scoring'"
            class="col pr-0"
          />
        </div>
        <pv-show-more
          v-if="showMoreFacetsShown"
          :label="cutoff >= 0? $t('message.datasetFacets.moreFilters') : $t('message.datasetFacets.lessFilters')"
          :upArrow="cutoff === -1"
          :action="toggleCutoff"
          class="p-0 row facets-show-more"
        />
        <pv-button
          v-if="showClearButton"
          label="Clear filters"
          class="row mt-5 facets-clear"
          :action="clearFacets"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import {
    isEmpty,
    isBoolean,
    has,
    isNil,
    isArray
  } from 'lodash';
  import DatasetsFacetsItem from '../../datasets/datasetsFacets/DatasetsFacetsItem.vue';
  import { getTranslationFor, getCountryFlagImg, getFacetTranslation } from '../../utils/helpers';
  import SettingsFacet from "../../datasets/datasetsFacets/SettingsFacet";
  import CatalogDetailsFacet from '../../facets/CatalogDetailsFacet.vue'
  import Vue from "vue";

  export default {
    name: 'catalogueFacets',
    components: {
      SettingsFacet,
      DatasetsFacetsItem,
      CatalogDetailsFacet
    },
    dependencies: ['catalogService'],
    data() {
      return {
        cutoff: this.$env.content.catalogs.facets.cutoff,
        showClearButton: this.$env.content.catalogs.facets.showClearButton,
        showFacetsTitle: this.$env.content.catalogs.facets.showFacetsTitle,
        showCatalogDetails: false,
        superCatalog: {},
        browser: {
          /* eslint-disable-next-line */
          isIE: /*@cc_on!@*/false || !!document.documentMode,
        },
        defaultFacetOrder: this.$env.content.catalogs.facets.defaultFacetOrder,
        MIN_FACET_LIMIT: this.$env.content.catalogs.facets.MIN_FACET_LIMIT,
        MAX_FACET_LIMIT: this.$env.content.catalogs.facets.MAX_FACET_LIMIT,
        FACET_OPERATORS: this.$env.content.catalogs.facets.FACET_OPERATORS,
        FACET_GROUP_OPERATORS: this.$env.content.catalogs.facets.FACET_GROUP_OPERATORS,
        erpd: {
          yes: Vue.i18n.t('message.metadata.yes'),
          no: Vue.i18n.t('message.metadata.no'),
          property: Vue.i18n.t('message.datasetFacets.facets.erpdOnly'),
          title: Vue.i18n.t('message.datasetFacets.facets.erpd'),
          // toolTipTitle: "TOOLTIP",//Vue.i18n.t('message.helpIcon.dataServices'),
        }
      };
    },
    computed: {
      ...mapGetters('catalogDetails', [
        'getCatalog',
      ]),
      ...mapGetters('catalogs', [
        'getAvailableFacets',
        'getCatalogsCount',
        'getFacetOperator',
        'getFacetGroupOperator',
        'getLimit',
        'getPage',
        'getFacets',
      ]),
      facetOperatorWatcher() {
        return this.getFacetOperator;
      },
      facetGroupOperatorWatcher() {
        return this.getFacetGroupOperator;
      },
      showMoreFacetsShown() {
        return this.$env.content.catalogs.facets.cutoff > 0 && this.$env.content.catalogs.facets.cutoff < this.getAvailableFacets.length;
      },
      getSortedFacets() {
        const availableFacets = this.getAvailableFacets;
        const sortedFacets = [];

        this.defaultFacetOrder.forEach((facet) => {
          availableFacets.forEach((field) => {
            if (facet === field.id && field.items.length > 0) sortedFacets.push(field);
          });
        });

        return sortedFacets;
      },
      // Returns the current catalog's available language ids
      // example: ['en', 'de', 'sv']
      catalogLanguageIds() {
        const languages = this.getCatalog && this.getCatalog.languages;
        if (!isArray(languages)) return [];
        return languages
            .map(lang => lang && lang.id)
            .filter(lang => lang);
      }
    },
    methods: {
      isEmpty,
      isBoolean,
      has,
      isNil,
      getFacetTranslation,
      getCountryFlagImg,
      getTranslationFor,
      ...mapActions('catalogDetails', [
        'loadCatalog',
        'useCatalogService',
      ]),
      ...mapActions('catalogs', [
        'toggleFacet',
        'addFacet',
        'removeFacet',
        'setFacetOperator',
        'setFacetGroupOperator',
        'setPage',
        'setPageCount',
      ]),
      /**
       * @description Sorts an array of facets by their count.
       * @param {Array<Object>} facets - The facets to sort
       * @param {Number} facet.count - The amount of catalogs having this facet assigned
       * @param {String} facet.name - The name of this facet
       * @returns {Array<Object>}
       */
      toggleCutoff() {
        this.cutoff = this.cutoff >= 0 ? -1 : this.$env.content.datasets.facets.cutoff;
      },
      sortByCount(facets, fieldId) {
        if (fieldId === 'scoring') return facets;
        return facets.slice().sort((a, b) => {
          const n = b.count - a.count;
          if (n !== 0) return b.count - a.count;
          if (a.name < b.name) return -1;
          return 1;
        });
      },
      facetTitle(fieldId) {
        return fieldId === 'scoring' ?
          Vue.i18n.t('message.header.navigation.data.metadataquality')
          : Vue.i18n.t(`message.datasetFacets.facets.${fieldId.toLowerCase()}`);
      },
      /**
       * @description Returns whether a facet is selected or not.
       * @param field - The field of the facet to check.
       * @param facet - The facet to check.
       * @returns {boolean}
       */
      facetIsSelected(field, item) {
        const facet = item.id;
        if (!Object.prototype.hasOwnProperty.call(this.$route.query, field)) {
          return false;
        }
        let qField = this.$route.query[field];
        if (!Array.isArray(qField)) qField = [qField];
        return qField.indexOf(facet) > -1;
      },
      /**
       * @description Wrapping callback-function for a click on a facet.
       * @param field - The field of the clicked facet
       * @param facet - The clicked facet
       */
      facetClicked(field, item) {
        const facet = item.id;
        this.toggleFacet(field, facet);
        // this.resetPage();
      },
      clearFacets() {
        if (Object.keys(this.$route.query).some(key => (key !== 'locale' && key !== 'page') && this.$route.query[key].length)) {
          this.$router.push({ query: { locale: this.$i18n.locale, page: "1" } })
            .catch(error => { console.error(error); });
        }
      },
      /**
       * @description Add/Remove a facet from the routers query parameters.
       * @param field - The field of the facet
       * @param facet - The given facet
       */
      toggleFacet(field, facet) {
        if (!Object.prototype.hasOwnProperty.call(this.$route.query, [field])) {
          this.$router.push({ query: Object.assign({}, this.$route.query, { [field]: [] }) });
        }
        let facets = this.$route.query[field].slice();
        if (!Array.isArray(facets)) facets = [facets];
        const index = facets.indexOf(facet);
        if (index > -1) {
          facets.splice(index, 1);
        } else {
          facets.push(facet);
        }
        this.$router.push({ query: Object.assign({}, this.$route.query, { [field]: facets, page: 1 }) });
      },
      changeFacetOperator(op) {
        this.setFacetOperator(op);
        this.setFacetGroupOperator(op);
      },
      isErpd() {
        const superCatalogs = this.$route.query['superCatalog'];
        const superCatalog = superCatalogs.constructor === Array ? superCatalogs[0] : superCatalogs;
        return superCatalog === 'erpd' ?  'true' : 'false';
        // return superCatalog === 'http://data.europa.eu/88u/catalogue/erpd' ?  'true' : 'false';
      },
      changeErpd(erpd) {
        //https://piveau-hub-search-piveau.apps.osc.fokus.fraunhofer.de/search?filter=catalogue&facets={%22superCatalog%22:[%22http://data.europa.eu/88u/catalogue/erpd%22]}
        const erdpCatalog = 'erpd';
        // const erdpCatalog = 'http://data.europa.eu/88u/catalogue/erpd';
        const superCatalogs = this.$route.query['superCatalog'];
        const superCatalog = superCatalogs.constructor === Array ? superCatalogs[0] : superCatalogs;
        if ((erpd === 'false' && superCatalog === erdpCatalog) || (erpd === 'true' && superCatalog !== erdpCatalog)) {
          if (superCatalog === erdpCatalog) {
            delete this.$route.query.showsubcatalogs;
          }
          this.toggleFacet('superCatalog', erdpCatalog);
        }
      },
      /**
       * @description Toggles the facetoperator between 'or'/'and'.
       */
      toggleFacetGroupOperator() {
        let op = this.getFacetGroupOperator;
        op = op === this.FACET_GROUP_OPERATORS.and ? this.FACET_GROUP_OPERATORS.or : this.FACET_GROUP_OPERATORS.and;
        this.setFacetGroupOperator(op);
      },
      resetPage() {
        this.$router.replace({ query: Object.assign({}, this.$route.query, { page: 1 }) });
      },
      triggerResize() {
        // Note: Trigger resize after 200ms when Modal element is visible to properly display the map component
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 200);
      },
      getFacetCount(field, facet) {
        if (field.id === 'scoring') return '';
        return facet.count;
      }
    },
    watch: {
      facetOperatorWatcher: {
        handler(facetOperator) {
          this.$router.replace({ query: Object.assign({}, this.$route.query, { facetOperator }) });
        },
      },
      facetGroupOperatorWatcher: {
        handler(facetGroupOperator) {
          this.$router.replace({ query: Object.assign({}, this.$route.query, { facetGroupOperator }) });
        },
      },
      getCatalog(catalog) {
        this.superCatalog = catalog;
      }
    },
    created() {
      if (this.$route.query.showsubcatalogs) {
        this.useCatalogService(this.catalogService);
        const superCatalogUrl = this.$route.query.superCatalog;
        if (typeof superCatalogUrl === 'string') {
          const catalogId = superCatalogUrl.substring(superCatalogUrl.lastIndexOf('/') + 1);
          this.loadCatalog(catalogId)
              .then(result => {
                    // console.log("HELLLLO", result)
                  }
              )
        }
      }
    }
  };
</script>

<style lang="scss" scoped>

  .facet:hover {
    cursor: pointer;
  }

  .custom-control {
    padding-left: 1.5rem;
    margin-right: 1rem;
  }
  .custom-control-label {
    &::before {
      left: -1.5rem !important;
    }
    &::after {
      left: -1.5rem !important;
    }
  }
  .custom-control-input:checked ~ .custom-control-label::before {
    border-color: var(--primary);
    background-color: var(--primary);
  }
  .map {
    z-index: 0;
  }
  .suggestion-input-group {
    position: relative;
  }
  .suggestion-input {
    position: absolute;
    top: 0;
  }
  .suggestion-list-group {
    position: relative;
    width: 100%;
  }
  .suggestion-list {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 100;
  }

  .map-modal-button {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .reset-bounds-button {
    position: absolute;
    bottom: 0;
    left: 0;
  }

  #modal-map-wrapper {
    padding-right: 1.5rem !important;
    padding-left: 1.5rem !important;
  }

</style>
