<template>
    <div class="catalog-page-container">
        <div class="catalog-box">
            <div>
                <h1 @click="testLogger(getCatalog)">testLogger {{ getTranslationFor(getCatalog.title, $route.query.locale, getCatalog.languages) }}</h1>

                <div class="row">
                    <div class="catalog-header-container col-10 mx-auto d-flex justify-content-between align-items-end">
                        <div class="catalog-header-info d-flex flex-column">
                            <!-- TODO: call catalog.titel -->
                            <h2 class="catalog-header-titel" aria-label="Catalog name">
                                *icon* Geoportal Bayern
                            </h2>
                            <!-- TODO: call catalog.homepage -->
                            <h5 class="catalog-header-homepage" aria-label="Homepage">
                                https://geoportal.bayern.de/geoportalbayern/
                            </h5>
                        </div>
                        <!-- TODO: call the right logo -->
                        <img class="catalog-header-logo" src="../../assets/img/geoportal.png" alt="">
                    </div>
                    <div class="col-10 mx-auto">
                        <div class="catalog-card card" >
                            <div class="card-header">
                                <ul class="nav nav-tabs card-header-tabs" role="tablist">
                                    <li v-for="tab in cardNavTabs" :key="tab.id">
                                        <a @click.prevent="setActiveTabName(tab.id)" :class="displayContent(tab.id) ? 'nav-link active' : 'nav-link'" :href="`#${tab.id}`" role="tab" :aria-controls="tab.id" :aria-selected="displayContent(tab.id)">{{ tab.displayName }}</a>
                                    </li>
                                </ul>
                            </div>
                            <!-- <h5 class="card-header">Header</h5> -->
                            <!-- <img class="flag-img card-img" src="@/assets/img/flags/eu.png" id="about" alt="Card image cap"> -->
                            <div class="card-body">
                                <div v-if="displayContent('about')" class="tab-pane active" id="about" role="tabpanel">
                                    <h5 class="card-title">Über diesen Katalog</h5>
                                    <!-- <h6 class="card-subtitle mb-2">card subtitle</h6> -->
                                    <div class="tab-content mt-3">
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    </div>
                                </div>
                                    <div v-if="displayContent('dataset-selections')" class="tab-pane active" id="dataset-selections" role="tabpanel" aria-labelledby="dataset-selections-tab">
                                        <h5 class="card-title">Interessante Datensätze</h5>
                                        <!-- <h6 class="card-subtitle mb-2">card subtitle</h6> -->
                                        <div class="tab-content mt-3">
                                            <p class="card-text">body for Interessante Datensätze.</p>
                                        </div>
                                    </div>
                                    <div v-if="displayContent('dataset-page')" class="tab-pane active" id="dataset-page" role="tabpanel" aria-labelledby="dataset-page-tab">
                                        <h5 class="card-title">Alle Datensätze</h5>
                                        <!-- <h6 class="card-subtitle mb-2">card subtitle</h6> -->
                                        <div class="tab-content mt-3">
                                            <p class="card-text">body for Interessante Alle Datensätze.</p>
                                        </div>
                                        <!-- <Datasets /> -->
                                    </div>
                                    <div v-if="displayContent('contact')" class="tab-pane active" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                                        <h5 class="card-title">Kontakt</h5>
                                        <!-- <h6 class="card-subtitle mb-2">card subtitle</h6> -->
                                        <div class="tab-content mt-3">
                                        <p class="card-text">body for Interessante Kontakt.</p>
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
import {
    debounce,
    has,
    groupBy,
    uniqBy,
    toPairs,
    isArray,
    isNil,
  } from 'lodash-es';
  import { getTranslationFor, truncate, getImg } from '../utils/helpers';
    export default {
        name: "CatalogPage",
        components: {
            Datasets,
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
            getCatalogImage(catalog) {
                return this.$env.content.catalogs.useCatalogCountries
                ? `${this.$env.content.catalogs.defaultCatalogImagePath}/${has(catalog, 'country.id') ? catalog.country.id : this.$env.content.catalogs.defaultCatalogCountryID}`
                : `${this.$env.content.catalogs.defaultCatalogImagePath}/${has(catalog, 'id') ? catalog.id : this.$env.content.catalogs.defaultCatalogID}`;
            },
            setActiveTabName(name) {
                this.activeTabName = name;
            },
            displayContent(name) {
                return this.activeTabName === name;
            },
            testLogger(something) {
                console.log(something);
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
        },

    }
</script>

<style lang="scss" scoped>
    .flag-img {
        width: 150px;
        height: auto;
    }

    .catalog-header-container {
        padding: 40px 50px;
    }

    .catalog-header-homepage {
        font-size: 14px;
        text-align: end;
    }
    .catalog-header-logo {
        height: 75px;
        width: auto;
        // margin: 40px 50px;
    }


</style>
