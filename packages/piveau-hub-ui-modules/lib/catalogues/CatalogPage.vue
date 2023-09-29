<template>
  <div class="catalog-page-container">
    <div v-if="showArray(getCatalog.catalogueBackground)" class="catalog-page-background" ref="catBackground">
      <img class="catalog-page-background-image" :src="getCatalog.catalogueBackground" alt="">
    </div>
    <div v-else class="catalog-page-background-default"></div>
    <div class="catalog-box">

      <slot name="header">
        <div class="catalog-header-container mx-auto d-flex justify-content-between align-items-center" ref="catHeader">
          <div class="catalog-header-info d-flex">
            <img v-if="showArray(getCatalog.catalogueFavIcon)" class="catalog-header-title-icon"
                 :src="getCatalog.catalogueFavIcon" alt="">
            <div class="catalog-header-title-text">
              <h1 class="catalog-header-title-title" aria-label="Katalogtitel">
                {{ getTranslationFor(getCatalog.title, $route.query.locale, getCatalog.languages) }}
              </h1>
              <h5 class="catalog-header-title-subtitle" aria-label="Homepage">
                <app-link :to="getCatalog.homepage">
                  {{ getCatalog.homepage }}
                </app-link>
              </h5>
            </div>
          </div>
          <img v-if="showArray(getCatalog.catalogueLogo)" class="catalog-header-logo d-none d-sm-block"
               :src="getCatalog.catalogueLogo" alt="" aria-label="logo">
        </div>
      </slot>

      <div class="catalog-card card">
        <div class="card-header" role="navigation">
          <!-- CARD NAV -->
          <ul class="nav nav-tabs card-header-tabs" role="tablist" aria-label="Navigationsleiste">
            <li v-for="tab in cardNavTabs" :key="tab.id" role="tab" :aria-controls="tab.id"
                :aria-selected="activeTabName === tab.id" :aria-label="tab.displayName">
              <a @click.prevent="setActiveTabName(tab.id)" class="catalog-nav-link nav-link"
                 :class="{active: tab.id === activeTabName}" :href="`#${tab.id}`" role="tab">
                {{ tab.displayName }}
              </a>
            </li>
          </ul>
        </div>
        <!-- CARD CONTENT -->
        <div class="card-body my-5">

          <!-- "ÜBER DIESEN KATALOG" -->
          <div v-if="activeTabName === 'about'"
               class="tab-pane active catalog-about-tab d-flex align-items-start justify-content-between" id="about"
               role="tabpanel">
            <div>
              <div class="tab-content d-flex">
                <app-markdown-content class="card-text" tag="div"
                                      :text="getTranslationFor(catalog.description, $route.query.locale, catalog.languages)"/>
              </div>
            </div>
            <img v-if="showArray(getCatalog.catalogueProfile)" class="catalog-hero-pic img-fluid"
                 :src="getCatalog.catalogueProfile" alt="">
          </div>

          <!-- "INTERESSANTE DATENSÄTZE" -->
          <div v-show="activeTabName === 'dataset-selections'" class="tab-pane active" id="dataset-selections"
               role="tabpanel" aria-labelledby="dataset-selections-tab">
            <div v-if="showArray(getDatasets)" class="tab-content d-flex flex-column align-items-center mt-3">
              <div class="d-flex flex-wrap justify-content-center mb-5">

                <DatasetCard
                    v-for="dataset in (interestingDatasets.length > 0) ? interestingDatasets.slice(0, 3) : getDatasets.slice(0, 3)"
                    :key="dataset.id"
                    :to="`/datasets/${dataset.id}`"
                    :datasetTitle="getTranslationFor(dataset.title, $route.query.locale, dataset.languages) || dataset.id"
                    :datasetDescription="getTranslationFor(dataset.description, $route.query.locale, dataset.languages)"
                    :datasetCatalog="getTranslationFor(dataset.catalog.title, $route.query.locale, [])"
                    :descriptionMaxLength="175"
                    :data-cy="`dataset@${dataset.id}`"
                    class="mt-3"
                />
              </div>

              <button @click.prevent="setActiveTabName('dataset-page')" class="primary-button" role="button">
                Mehr Daten entdecken
              </button>
            </div>

            <span v-else>
              Es sind keine Datensätze verfügbar.
            </span>
          </div>

          <!-- "ALLE DATENSÄTZE" -->
          <div v-show="activeTabName === 'dataset-page'" class="tab-pane active" id="dataset-page" role="tabpanel"
               aria-labelledby="dataset-page-tab">
            <slot name="card-datasets">
              <div class="tab-content mt-3">
                <Datasets/>
              </div>
            </slot>
          </div>

          <!-- "KONTAKT" -->
          <div v-show="activeTabName === 'contact'" class="tab-pane active" id="contact" role="tabpanel"
               aria-labelledby="contact-tab">
            <div class="tab-content">
              <dl v-if="has(getCatalog, 'publisher') && showObject(getCatalog.publisher) && (showString(getCatalog.publisher.email) || showString(getCatalog.publisher.homepage) || showObject(getCatalog.publisher.address))">
                <h4 class="catalog-contact-header">Fragen zu dieser Open Data Präsenz?</h4>
                <!-- publisher name -->
                <dt v-if="has(getCatalog, 'publisher.name')  && showString(getCatalog.publisher.name)">
                  {{ getCatalog.publisher.name }}
                </dt>
                <!-- address -->
                <dd v-if="has(getCatalog, 'publisher.address') && showObject(getCatalog.publisher.address)">
                  <!-- E-Mail:  -->
                  <span
                      v-if="has(getCatalog, 'publisher.address.street') && showString(getCatalog.publisher.address.street)">{{
                      getCatalog.publisher.address.street
                    }}</span>
                </dd>
                <dd v-if="has(getCatalog, 'publisher.address') && showObject(getCatalog.publisher.address)">
                  <!-- E-Mail:  -->
                  <span
                      v-if="has(getCatalog, 'publisher.address.postalCode') && showString(getCatalog.publisher.address.locality) && has(getCatalog, 'publisher.address.locality') && showString(getCatalog.publisher.address.postalCode)">{{
                      getCatalog.publisher.address.postalCode
                    }} {{ getCatalog.publisher.address.locality }}</span>
                </dd>
                <!-- email -->
                <dd>
                  <!-- E-Mail:  -->
                  <app-link v-if="has(getCatalog, 'publisher.email') && showString(getCatalog.publisher.email)"
                            :to="getCatalog.publisher.email">
                    {{
                      getCatalog.publisher.email.startsWith("mailto:") ? getCatalog.publisher.email.slice(7) : getCatalog.publisher.email
                    }}
                  </app-link>
                </dd>
                <!-- homepage -->
                <dd>
                  <!-- Website:  -->
                  <app-link v-if="has(getCatalog, 'publisher.homepage') && showString(getCatalog.publisher.homepage)"
                            :to="getCatalog.publisher.homepage">
                    {{ getCatalog.publisher.homepage }}
                  </app-link>
                </dd>
              </dl>
              <span v-else>
                Es sind keine Kontaktinformationen verfügbar.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datasets from "../datasets/Datasets.vue"
import {mapGetters, mapActions} from 'vuex';
import AppLink from "../widgets/AppLink";
import DatasetCard from "./CatalogPageDatasetCard.vue"
import AppMarkdownContent from "../datasetDetails/AppMarkdownContent.vue"
import {
  has,
  isArray,
  isNil,
  isObject,
  isString
} from 'lodash-es';
import {getTranslationFor, truncate} from '../utils/helpers';

export default {
  name: "CatalogPage",
  components: {
    Datasets,
    DatasetCard,
    AppLink,
    AppMarkdownContent,
  },
  data() {
    return {
      interestingDatasets: [],
      activeTabName: 'about',
      cardNavTabs: [
        {
          id: 'about',
          displayName: 'Über diese Seite',
        },
        {
          id: 'dataset-selections',
          displayName: 'Interessante Datensätze',
        },
        {
          id: 'dataset-page',
          displayName: 'Alle Datensätze',
        },
        {
          id: 'contact',
          displayName: 'Kontakt',
        },
      ],
    };
  },
  computed: {
    ...mapGetters('catalogDetails', [
      'getCatalog',
    ]),
    ...mapGetters('datasets', [
      'getDatasets',
      'getDatasetsCount',
      'getLoading',
      'getOffset',
    ]),
    catalog() {
      return this.getCatalog;
    },
  },
  methods: {
    isNil,
    // The imported Lodash has function. Must be defined in Methods so we can use it in template
    has,
    isArray,
    truncate,
    getTranslationFor,
    ...mapActions('catalogDetails', [
      'loadCatalog',
    ]),
    ...mapActions('datasets', [
      'loadDatasets',
      'loadSingleDataset',
    ]),
    setActiveTabName(name) {
      this.activeTabName = name;
    },
    showObject(object) {
      return !isNil(object) && isObject(object) && !Object.values(object).reduce((keyUndefined, currentValue) => keyUndefined && currentValue === undefined, true);
    },
    showArrayOfStrings(stringArray) {
      return this.showArray(stringArray) && stringArray.every(currentString => this.showString(currentString));
    },
    showString(string) {
      return !isNil(string) && isString(string);
    },
    showArray(array) {
      return !isNil(array) && isArray(array) && array.length > 0;
    },
    showObjectArray(objectArray) {
      return this.showArray(objectArray) && !objectArray.reduce((objectUndefined, currentObject) => objectUndefined && Object.values(currentObject).reduce((keyUndefined, currentValue) => keyUndefined && currentValue === undefined, true), true);
    },
    loadCatalogInterestingDatasets(catalog) {
      for (let id of this.catalog.catalogueInterestingDatasets) {
        this.loadSingleDataset(id)
          .then(response => {
            this.interestingDatasets.push(response);
          })
          .catch(error => {
            console.log('error: ', error)
          });
      }
    }
  },
  mounted() {
    if (sessionStorage.activeTabName) {
      this.activeTabName = sessionStorage.activeTabName;
    }
  },
  watch: {
    activeTabName(activeTab) {
      sessionStorage.activeTabName = activeTab;
    },
  },
  created() {
    this.$Progress.start()

    let catalogId = this.$route.params.ctlg_id;
    if (catalogId === undefined || catalogId === null) {
      const host = window.location.host;
      const parts = host.split('.');
      if (parts.length > 1) {
        catalogId = parts[0];
      }
    }


    Promise.all([
      this.loadCatalog(catalogId)
          .then(result => {
            this.loadCatalogInterestingDatasets(result)
          }),
      this.loadDatasets({locale: this.$route.query.locale})
    ]).then(results => {
      this.$Progress.finish()
    }).catch(error => {
      console.error(error)
      this.$Progress.fail()
    })
  }

}
</script>

<style lang="scss" scoped>
.catalog-page-container {
  margin-top: 0 !important;
  padding: 0 !important;
}

.catalog-page-background-image,
.catalog-page-background-default {
  position: absolute;
  height: 360px;
  width: 100%;
}

.catalog-page-background-default {
  background-color: #F4F8FA;
}

.catalog-page-background-image {
  overflow: hidden;
  object-fit: cover;
}

.catalog-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 95px;
}

.flag-img {
  width: 150px;
  height: auto;
}

.catalog-header-container {
  flex: 1 1 100%;
  width: 100%;
  max-width: 1040px;
  min-height: 180px;
  padding-left: 32px;
  padding-right: 32px;
  z-index: 1;
}

.catalog-header-title-subtitle {
  font-size: 14px;
}

.catalog-header-title-icon {
  height: 48px;
  width: 48px;
  padding: 5px;
  margin-right: 16px;
  border: 1px solid transparent;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0px 0px 6px 0px #0000001F;
  object-fit: contain;
}

.catalog-header-logo {
  max-height: 80px;
  max-width: 192px;
  height: auto;
  width: auto;
}

.catalog-card {
  flex: 1 1 100%;
  padding: 32px;
  width: 100%;
  max-width: 1040px;
  border: none;
}

.catalog-about-tab {
  flex-direction: column;
  flex-wrap: wrap;
}

.card-header {
  background-color: transparent;
  padding: 0;
}

.card-header-tabs {
  margin-right: 0;
  margin-left: 0;
  margin-bottom: 0;
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.card-header-tabs li {
  padding-right: 48px;
}

.card-header-tabs li:last-child {
  padding-right: 0;
}

.card-body {
  padding: 0;
}

.catalog-nav-link.nav-link {
  color: rgba(0, 0, 0, 0.7);
  padding-left: 0;
  padding-right: 0;
  margin-bottom: 0;
  background-color: transparent;
  border: 0;
  border-left: 0;
  border-right: 0;
  border-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom: 2px solid transparent !important;

  &:hover,
  &.active {
    color: #175baf !important;
  }

  &.active {
    border-bottom: 2px solid #175baf !important;
  }
}

.catalog-hero-pic {
  max-width: 250px !important;
  width: 100%;
  height: auto;
  margin-top: calc(48px - 1rem);
}

.catalog-contact-header {
  font-size: 18px;
  margin-bottom: 34px;
}

.tab-content dt {
  margin-bottom: 8px;
}

.tab-content dd {
  margin-bottom: 0;
}

@media screen and (min-width: 768px) {
  .catalog-header-container {
    padding-left: 0;
    padding-right: 0;
  }

  .catalog-box {
    padding-left: 32px;
    padding-right: 32px;
  }

  .catalog-card {
    border: none;
    box-shadow: 0px 2px 12px 0px #00000012;
    margin-left: auto;
    margin-right: auto;
    padding-left: 48px;
    padding-right: 48px;
  }

  .catalog-about-tab {
    flex-wrap: nowrap;
    flex-direction: row;
  }

  .catalog-hero-pic {
    margin-top: 0;
    margin-left: 1.5rem;
  }
}
</style>