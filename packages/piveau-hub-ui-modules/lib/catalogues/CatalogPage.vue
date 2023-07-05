<template>
    <div class="catalog-page-container" :style="{ backgroundImage: 'url(' + getCatalog.catalogueBackground + ')' }">
        <div class="catalog-box">
            <div>
                <div class="row">
                    <div class="catalog-header-container col-10 mx-auto d-flex justify-content-between align-items-center">
                        <div class="catalog-header-info d-flex flex-column justify-content-center">
                            <h2 class="catalog-header-titel" aria-label="Katalogtitel">
                                <!-- <img class="catalog-header-icon" src="../assets/img/favicon.png" alt="">  -->
                                <img v-if="showArray(getCatalog.catalogueFavIcon)" class="catalog-header-icon" :src="getCatalog.catalogueFavIcon" alt=""> 
                                <span>{{ getTranslationFor(getCatalog.title, $route.query.locale, getCatalog.languages) }}</span>
                            </h2>
                            <h5 class="catalog-header-homepage" aria-label="Homepage">
                                <app-link :to="getCatalog.homepage">
                                    {{ getCatalog.homepage }}
                                </app-link>
                            </h5>
                        </div>
                        <!-- <img class="catalog-header-logo" src="../assets/img/logo.png" alt=""> -->
                        <img class="catalog-header-logo" :src="getCatalog.catalogueLogo" alt="" aria-label="logo">
                    </div>
                    <div class="col-10 mx-auto">
                        <div class="catalog-card card" >
                            <div class="card-header">
                                <!-- CARD NAV -->
                                <ul class="nav nav-tabs card-header-tabs" role="tablist" aria-label="Navigationsleiste">
                                    <li v-for="tab in cardNavTabs" :key="tab.id" role="tab" :aria-controls="tab.id" :aria-selected="activeTabName === tab.id" :aria-label="tab.displayName">
                                        <a @click.prevent="setActiveTabName(tab.id)" class="nav-link" :class="{active: tab.id === activeTabName}" :href="`#${tab.id}`" role="tab">
                                            {{ tab.displayName }}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <!-- CARD CONTENT -->
                            <div class="card-body mx-4 my-5">

                                <!-- "ÜBER DIESEN KATALOG" -->
                                <div v-if="activeTabName === 'about'" class="tab-pane active catalog-about-tab d-flex align-items-start justify-content-between" id="about" role="tabpanel">
                                    <div>
                                        <div class="tab-content d-flex">
                                            <app-markdown-content class="card-text" tag="div" :text="getTranslationFor(catalog.description, $route.query.locale, catalog.languages)" />
                                        </div>
                                    </div>
                                    <img class="catalog-hero-pic ml-4 img-fluid" :src="getCatalog.catalogueProfile" alt="">
                                    <!-- <img class="ml-4" :src="testProfile" alt=""> -->
                                </div>

                                <!-- "INTERESSANTE DATENSÄTZE" -->
                                <div v-show="activeTabName === 'dataset-selections'" class="tab-pane active" id="dataset-selections" role="tabpanel" aria-labelledby="dataset-selections-tab">
                                    <div v-if="showArray(getDatasets)" class="tab-content d-flex flex-column align-items-center mt-3">
                                        <div class=" d-flex flex-wrap justify-content-center">
                                            <DatasetCard 
                                            v-for="(dataset, i) in getDatasets.slice(0, 3)"
                                            :key="dataset.id"
                                            :to="`/datasets/${dataset.id}`"
                                            :datasetTitle="getTranslationFor(dataset.title, $route.query.locale, dataset.languages) || dataset.id"
                                            :datasetDescription="getTranslationFor(dataset.description, $route.query.locale, dataset.languages)"
                                            :datasetCatalog="getTranslationFor(dataset.catalog.title, $route.query.locale, [])"
                                            :descriptionMaxLength="150"
                                            :data-cy="`dataset@${dataset.id}`"
                                            :card-icon="cardIcons[i]"
                                            class="mt-3"
                                            />
                                        </div>
                                        
                                        <button @click.prevent="setActiveTabName('dataset-page')" class="fol-button primary-button" role="button">Mehr Daten entdecken</button>
                                    </div>

                                    <span v-else>
                                        Es sind keine Datensätze verfügbar.
                                    </span>
                                </div>

                                <!-- "ALLE DATENSÄTZE" -->
                                <div v-show="activeTabName === 'dataset-page'" class="tab-pane active" id="dataset-page" role="tabpanel" aria-labelledby="dataset-page-tab">
                                    <div class="tab-content mt-3">
                                        <Datasets />
                                    </div>
                                </div>

                                <!-- "KONTAKT" -->
                                <div v-show="activeTabName === 'contact'" class="tab-pane active" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                                    <div class="tab-content">
                                        <dl v-if="has(getCatalog, 'publisher') && showObject(getCatalog.publisher)">
                                            <dt v-if="has(getCatalog, 'publisher.name')  && showString(getCatalog.publisher.name)">{{ getCatalog.publisher.name }}</dt>
                                            <dd>
                                                <app-link v-if="has(getCatalog, 'publisher.homepage') && showString(getCatalog.publisher.homepage)" :to="getCatalog.publisher.homepage">
                                                {{ getCatalog.publisher.homepage }}
                                                </app-link>
                                            </dd>
                                            <dd>
                                                <app-link v-if="has(getCatalog, 'publisher.email') && showString(getCatalog.publisher.email)" :to="getCatalog.publisher.email">
                                                {{ getCatalog.publisher.email }}
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
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import Datasets from "../datasets/Datasets.vue"
import { mapGetters, mapActions } from 'vuex';
import AppLink from "../widgets/AppLink";
import DatasetCard from "./CatalogPageDatasetCard.vue"
import AppMarkdownContent from "../datasetDetails/AppMarkdownContent.vue"
import {
    has,
    groupBy,
    uniqBy,
    toPairs,
    isArray,
    isNil,
    isObject, 
    isString
  } from 'lodash-es';
  import { getTranslationFor, truncate } from '../utils/helpers';
    export default {
        name: "CatalogPage",
        dependencies: ['catalogService', 'DatasetService'],
        components: {
            Datasets,
            DatasetCard,
            AppLink,
            AppMarkdownContent,
        },
        data() {
            return {
                // TODO: remove these after finishing
                // testBackground: ["https://open-data-bayern.apps.osc.fokus.fraunhofer.de/static/catalogs/geo_bayern/bg.png"],
                // testFavicon: ["https://open-data-bayern.apps.osc.fokus.fraunhofer.de/static/catalogs/geo_bayern/favicon.png"],
                // testLogo: ["https://open-data-bayern.apps.osc.fokus.fraunhofer.de/static/catalogs/geo_bayern/logo.png"],
                // testProfile: ["https://open-data-bayern.apps.osc.fokus.fraunhofer.de/static/catalogs/geo_bayern/profile.png"],
                // catalog: {},
                activeTabName: 'about',
                cardNavTabs: [
                    {
                        id: 'about',
                        displayName: 'Über diesen Katalog',
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
                // TODO: remove
                cardIcons: [
                    "icon-cartogram_64x64.png",
                    "icon-castle_64x64.png",
                    "icon-tap_64x64.png",
                ]
            };
        },
        computed: {
            ...mapGetters('catalogDetails', [
                'getCatalog',
            ]),
            ...mapGetters('datasets', [
                'getDatasets',
                'getDatasetsCount',
                // 'getFacets',
                // 'getLimit',
                'getLoading',
                'getOffset',
                // 'getPage',
                // 'getPageCount',
                // 'getAvailableFacets',
                // 'getAllAvailableFacets',
                // 'getMinScoring',
            ]),
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
            'useCatalogService',
            ]),
            ...mapActions('datasets', [
                'loadDatasets',
                // 'useService',
            ]),
            // initDatasets() {
            //     this.$nextTick(() => {
            //     this.$nextTick(() => {
            //         this.$Progress.start();
            //         this.loadDatasets({ locale: this.$route.query.locale })
            //         .then(() => {
            //             this.setPageCount(Math.ceil(this.getDatasetsCount / this.getLimit));
            //             this.$Progress.finish();
            //             $('[data-toggle="tooltip"]').tooltip({
            //             container: 'body',
            //             });
            //         })
            //         .catch(() => {
            //             this.$Progress.fail();
            //         })
            //         .finally(() => this.$root.$emit('contentLoaded'));
            //     });
            //     });
            // },
            // getBadgeFormat(label) {
            //     return this.truncate(label, 8, true);
            // },
            // removeDuplicatesOf(array) {
            //     const correctedFormatArray = array.map(format => (
            //     {
            //         ...format,
            //         id: this.getBadgeFormat(format.id),
            //         label: this.getBadgeFormat(format.label),
            //     }
            //     ));
            //     // sorts after # of occurences (highest occurence first)
            //     // possibility #1
            //     const sortedArray = toPairs(groupBy(correctedFormatArray, 'id')).sort((a, b) => b[1].length - a[1].length);
            //     const onlyFormatObjectsArray = sortedArray.map(arr => arr[1][0]);
            //     // lodash uniqBy funtion removes duplicate id´s from array of objects
            //     const uniqById = uniqBy(onlyFormatObjectsArray, 'id');
            //     const uniqByIdAndLabel = uniqBy(uniqById, 'label');
            //     return uniqByIdAndLabel;
            // },
            setActiveTabName(name) {
                this.activeTabName = name;
                // this.router.push(name);
            },
            // displayContent(name) {
            //     return this.activeTabName === name;
            // },
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
        },
        mounted() {
            if (sessionStorage.activeTabName) {
            this.activeTabName = sessionStorage.activeTabName;
            }
        },
        watch: {
            // facetGroupOperatorWatcher: {
            //     handler(facetGroupOperator) {
            //         this.setRouteQuery({ facetGroupOperator }, "replace");
            //     },
            // },
            // '$route.params.ctlg_id'(showCatalogDetails) {
            //     this.showCatalogDetails = showCatalogDetails;
            // },
            // getDatasetGeoBounds(bounds) {
            //     this.bounds = bounds
            // },
            getCatalog(catalog) {
                this.catalog = catalog;
            },
            activeTabName(activeTab) {
                sessionStorage.activeTabName = activeTab;
            },
        },
        created() {
            this.useCatalogService(this.catalogService);
            // this.useService(this.DatasetService);
            // this.initShowCatalogDetails();
            this.loadCatalog(this.$route.params.ctlg_id);
            // this.initDatasets();
        }

    }
</script>

<style lang="scss" scoped>
    .catalog-page-container {
        // background-image: url("../assets/img/bg.png");
        background-repeat: repeat-x;
        background-position-x: center;
        // background-size: contain;
    }
    .catalog-box {
        margin-bottom: 95px;
    }
    .flag-img {
        width: 150px;
        height: auto;
    }

    .catalog-header-container {
        padding: 40px 50px;
    }

    .catalog-header-homepage {
        font-size: 14px;
        margin-left: 50px
    }
    .catalog-header-icon {
        padding: 5px;
        border: 1px solid transparent;
        border-radius: 50px;
        box-shadow: 0 1px 1px rgb(0 0 0 / 25%), 0 2px 4px rgb(0 0 0 / 22%);
        background-color: white;
        height: 35px;
    }
    .catalog-header-logo {
        height: 75px;
        width: auto;
    }

    .catalog-card.card {
        border: none;
        box-shadow: 0 8px 16px rgb(0 0 0 / 25%), 0 2px 4px rgb(0 0 0 / 22%) !important;
    }
    .card-header {
        background-color: transparent;
    }
    .nav-link {
        color: rgba(0, 0, 0, 0.7);
        border: none;
        &:hover {
            color: #175baf;
            border: none;
        }
        &.active{
            color: #175baf !important;
            border: none !important;
            border-bottom: 2px solid #175baf !important;
        }
    }

    .catalog-hero-pic {
        max-width: 250px;
        width: 100%;
        height: auto;
        margin-bottom: 25px;
        
    }

    @media screen and (max-width: 991px) {
        .catalog-about-tab {
            flex-wrap: wrap;
            flex-direction: column-reverse;
            margin-left: 0 !important;
        }
        .ml-4.catalog-hero-pic {
            margin-left: 0 !important;
        }
    }
</style>