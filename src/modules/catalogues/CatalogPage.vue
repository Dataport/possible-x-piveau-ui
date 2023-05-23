<template>
    <div class="catalog-page-container">
        <div class="catalog-box">
            <div>
                <h1 @click="testLogger(getCatalog)">Hi {{ getTranslationFor(getCatalog.title, $route.query.locale, getCatalog.languages) }}</h1>
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
            getCatalog(catalog) {
            this.catalog = catalog;
            },
        },

    }
</script>