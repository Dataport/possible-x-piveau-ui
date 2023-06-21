<template>
    <div class="catalog-page-container" :style="{ backgroundImage: 'url(' + getCatalog.catalogueBackground + ')' }">
        <div class="catalog-box">
            <div>
                <!-- <button @click="testLogger(getCatalog)">catalog logger</button> -->
                <!-- <button @click="testLogger(getDatasets)">datasets logger</button> -->
                <div class="row">
                    <div class="catalog-header-container col-10 mx-auto d-flex justify-content-between align-items-center">
                        <div class="catalog-header-info d-flex flex-column justify-content-center">
                            <h2 class="catalog-header-titel" aria-label="Catalog name">
                                <!-- TODO: favicon -->
                                <img class="catalog-header-icon" :src="getCatalog.catalogueFavIcon" alt=""> 
                                <span>{{ getTranslationFor(getCatalog.title, $route.query.locale, getCatalog.languages) }}</span>
                            </h2>
                            <h5 class="catalog-header-homepage" aria-label="Homepage">
                                <app-link :to="getCatalog.homepage">
                                    {{ getCatalog.homepage }}
                                </app-link>
                            </h5>
                        </div>
                        <!-- TODO: call the right logo -->
                        <img class="catalog-header-logo" :src="getCatalog.catalogueLogo" alt="">
                        <!-- <span>*logo*</span> -->
                    </div>
                    <div class="col-10 mx-auto">
                        <div class="catalog-card card" >
                            <div class="card-header">
                                <ul class="nav nav-tabs card-header-tabs" role="tablist">
                                    <li v-for="tab in cardNavTabs" :key="tab.id" role="tab" :aria-controls="tab.id" :aria-selected="activeTabName === tab.id">
                                        <a @click.prevent="setActiveTabName(tab.id)" class="nav-link" :class="{active: tab.id === activeTabName}" :href="`#${tab.id}`" role="tab">
                                            {{ tab.displayName }}
                                        </a>
                                        <!-- <router-link @click="setActiveTabName(tab.id)" 
                                        class="nav-link" 
                                        :class="{active: tab.id === activeTabName}" 
                                        :to="`#${tab.id}`" role="presentation" 
                                        >
                                            {{ tab.displayName }}
                                        </router-link> -->
                                    </li>
                                </ul>
                            </div>
                            <!-- <h5 class="card-header">Header</h5> -->
                            <!-- <img class="flag-img card-img" src="@/assets/img/flags/eu.png" id="about" alt="Card image cap"> -->
                            <div class="card-body mx-4 my-5">
                                <div v-if="activeTabName === 'about'" class="tab-pane active d-flex align-items-start" id="about" role="tabpanel">
                                    <div>
                                        <!-- <h5 class="card-title"></h5> -->
                                        <div class="tab-content d-flex">
                                            <div class="card-text">
                                                {{ getTranslationFor(catalog.description, $route.query.locale, catalog.languages) }}
                                            </div>
                                        </div>
                                    </div>
                                    <!-- TODO call the right -->
                                    <img class="ml-4" :src="getCatalog.catalogueProfile" alt="">
                                </div>
                                    <div v-if="activeTabName === 'dataset-selections'" class="tab-pane active" id="dataset-selections" role="tabpanel" aria-labelledby="dataset-selections-tab">
                                        <!-- <h5 class="card-title">Interessante Datensätze</h5> -->
                                        <!-- <h6 class="card-subtitle mb-2">card subtitle</h6> -->
                                        <div class="tab-content mt-3">
                                            <!-- <p class="card-text">*Work in progress..*</p> -->
                                            <pv-data-info-box
                                            v-for="dataset in getDatasets.slice(0, 3)"
                                            :key="dataset.id"
                                            :to="`/datasets/${dataset.id}`"
                                            :src="getImg(getCatalogImage(dataset.catalog))"
                                            :dataset="{
                                                title: getTranslationFor(dataset.title, $route.query.locale, dataset.languages) || dataset.id,
                                                description:
                                                getTranslationFor(dataset.description, $route.query.locale, dataset.languages),
                                                catalog: getTranslationFor(dataset.catalog.title, $route.query.locale, []),
                                                createdDate: dataset.releaseDate,
                                                updatedDate: dataset.modificationDate,
                                                formats: removeDuplicatesOf(dataset.distributionFormats).filter((format) => format.id || format.label),
                                            }"
                                            :description-max-length="1000"
                                            :data-cy="`dataset@${dataset.id}`"
                                            class="mt-3"
                                            />
                                        </div>
                                    </div>
                                    <div v-if="activeTabName === 'dataset-page'" class="tab-pane active" id="dataset-page" role="tabpanel" aria-labelledby="dataset-page-tab">
                                        <!-- <h6 class="card-subtitle mb-2">card subtitle</h6> -->
                                        <div class="tab-content mt-3">
                                            <Datasets />
                                        </div>
                                        <!-- <Datasets /> -->
                                    </div>
                                    <div v-if="activeTabName === 'contact'" class="tab-pane active" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                                        <!-- <h6 class="card-subtitle mb-2">card subtitle</h6> -->
                                        <div class="tab-content">
                                            <!-- PUBLISHER -->
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
                                                Keine Kontaktinformationen verfügbar.
                                            </span>
                                        <!-- <p class="card-text">body for Interessante Kontakt.</p> -->
                                        </div>
                                    </div>
                                </div>
                                <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
                            <!-- <div class="card-footer text-muted">
                                Footer
                            </div> -->
                        </div>
                    </div>
                </div>
                <!-- <dl v-if="has(catalog, 'title') && showObject(catalog.title)">
                    <dt>
                            <span :title="$t('message.tooltip.catalogDetails.title')"
                                    data-toggle="tooltip"
                                    data-placement="right">
                                    {{ $t('message.metadata.title') }}
                            </span>
                    </dt>
                    <dd>{{ getTranslationFor(catalog.title, $route.query.locale, catalog.languages) }}</dd>
                    <dd>
                        <app-link :to="catalog.homepage">
                        {{ catalog.homepage }}
                        </app-link>
                    </dd>
                </dl> -->
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';
import Datasets from "../datasets/Datasets.vue"
import { mapGetters, mapActions } from 'vuex';
import AppLink from "../widgets/AppLink";
import {
    debounce,
    has,
    groupBy,
    uniqBy,
    toPairs,
    isArray,
    isNil,
    isObject, 
    isString
  } from 'lodash-es';
  import { getTranslationFor, truncate, getImg } from '../utils/helpers';
    export default {
        name: "CatalogPage",
        dependencies: ['catalogService', 'DatasetService'],
        components: {
            Datasets,
            AppLink,
        },
        data() {
            return {
                catalog: {},
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
                'getFacets',
                'getLimit',
                'getLoading',
                'getOffset',
                'getPage',
                'getPageCount',
                'getAvailableFacets',
                'getAllAvailableFacets',
                'getMinScoring',
            ]),
        },
        methods: {
            isNil,
            // The imported Lodash has function. Must be defined in Methods so we can use it in template
            has,
            isArray,
            truncate,
            getTranslationFor,
            getImg,
            ...mapActions('catalogDetails', [
            'loadCatalog',
            'useCatalogService',
            ]),
            ...mapActions('datasets', [
                'loadDatasets',
                'useService',
            ]),
            getCatalogImage(catalog) {
                return this.$env.content.catalogs.useCatalogCountries
                ? `${this.$env.content.catalogs.defaultCatalogImagePath}/${has(catalog, 'country.id') ? catalog.country.id : this.$env.content.catalogs.defaultCatalogCountryID}`
                : `${this.$env.content.catalogs.defaultCatalogImagePath}/${has(catalog, 'id') ? catalog.id : this.$env.content.catalogs.defaultCatalogID}`;
            },
            initShowCatalogDetails() {
                const showCatalogDetails = !isNil(this.$route.params.ctlg_id);
                if (showCatalogDetails === true) {
                    this.showCatalogDetails = true;
                    this.loadCatalog(this.$route.params.ctlg_id);
                } else this.showCatalogDetails = false;
            },
            initDatasets() {
                this.$nextTick(() => {
                this.$nextTick(() => {
                    this.$Progress.start();
                    this.loadDatasets({ locale: this.$route.query.locale })
                    .then(() => {
                        this.setPageCount(Math.ceil(this.getDatasetsCount / this.getLimit));
                        this.$Progress.finish();
                        $('[data-toggle="tooltip"]').tooltip({
                        container: 'body',
                        });
                    })
                    .catch(() => {
                        this.$Progress.fail();
                    })
                    .finally(() => this.$root.$emit('contentLoaded'));
                });
                });
            },
            getBadgeFormat(label) {
                return this.truncate(label, 8, true);
            },
            removeDuplicatesOf(array) {
                const correctedFormatArray = array.map(format => (
                {
                    ...format,
                    id: this.getBadgeFormat(format.id),
                    label: this.getBadgeFormat(format.label),
                }
                ));
                // sorts after # of occurences (highest occurence first)
                // possibility #1
                const sortedArray = toPairs(groupBy(correctedFormatArray, 'id')).sort((a, b) => b[1].length - a[1].length);
                const onlyFormatObjectsArray = sortedArray.map(arr => arr[1][0]);
                // lodash uniqBy funtion removes duplicate id´s from array of objects
                const uniqById = uniqBy(onlyFormatObjectsArray, 'id');
                const uniqByIdAndLabel = uniqBy(uniqById, 'label');
                return uniqByIdAndLabel;
            },
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
            testLogger(something) {
                console.log(something);
            }
        },
        mounted() {
            if (sessionStorage.activeTabName) {
            this.activeTabName = sessionStorage.activeTabName;
            }
        },
        watch: {
            facetGroupOperatorWatcher: {
            handler(facetGroupOperator) {
                this.setRouteQuery({ facetGroupOperator }, "replace");
            },
            },
            '$route.params.ctlg_id'(showCatalogDetails) {
            this.showCatalogDetails = showCatalogDetails;
            },
            getDatasetGeoBounds(bounds) {
            this.bounds = bounds
            },
            getCatalog(catalog) {
            this.catalog = catalog;
            },
            activeTabName(activeTab) {
            sessionStorage.activeTabName = activeTab;
            },
        },
        created() {
            this.useService(this.DatasetService);
            this.useCatalogService(this.catalogService);
            this.initShowCatalogDetails();
            this.initDatasets();
        }

    }
</script>

<style lang="scss" scoped>
    .catalog-page-container {
        // background-image: url("../assets/img/bg_geo.png");
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
        // margin: 40px 50px;
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

</style>