<template>
    <div class="catalog-page-container">
        <div class="catalog-box">
            <div>
                <h1 @click="testLogger(getCatalog)">Hi {{ getTranslationFor(getCatalog.title, $route.query.locale, getCatalog.languages) }}</h1>

                <div class="row">
                    <div class="col-10 mx-auto">
                        <div class="card" >
                            <div class="card-header">
                                <ul class="nav nav-tabs card-header-tabs">
                                    <li class="nav-item">
                                        <a class="nav-link active" href="#">Active</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="#">Link</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link disabled" href="#">Disabled</a>
                                    </li>
                                </ul>
                            </div>
                            <!-- <h5 class="card-header">Header</h5> -->
                            <img class="flag-img card-img" src="@/assets/img/flags/eu.png" alt="Card image cap">
                            <div class="card-body">
                                <h5 class="card-title">Card title</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
                            </div>
                            <div class="card-footer text-muted">
                                Footer
                            </div>
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
            
        },
        props: {

        },
        data() {
            return {
                catalog: {},
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
            ...mapActions('catalogDetails', [
            'loadCatalog',
            'useCatalogService',
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
            getCatalogImage(catalog) {
                return this.$env.content.catalogs.useCatalogCountries
                ? `${this.$env.content.catalogs.defaultCatalogImagePath}/${has(catalog, 'country.id') ? catalog.country.id : this.$env.content.catalogs.defaultCatalogCountryID}`
                : `${this.$env.content.catalogs.defaultCatalogImagePath}/${has(catalog, 'id') ? catalog.id : this.$env.content.catalogs.defaultCatalogID}`;
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
            // getCatalog(catalog) {
            // this.catalog = catalog;
            // },
        },

    }
</script>

<style lang="scss" scoped>
    .flag-img {
        width: 150px;
        height: auto;
    }
</style>