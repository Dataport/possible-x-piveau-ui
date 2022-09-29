<template>
    <div class="dsd-distribution-quality">
        <div class="header mt-5">
            <h2>{{ $t('message.datasetDetails.quality.distributionQuality') }}</h2>
            <div class="markdown-content">
                <p v-html="$t('message.datasetDetails.intro.distribution', { locale: $route.query.locale })" />
            </div>
        </div>
        <div class="content">
            <div class="ecl-accordion" data-ecl-auto-init="Accordion" data-ecl-accordion="">
                <div class="ecl-accordion__item" v-for="(distribution, index) in qualityDistributions" :key="index">
                    <h3 class="ecl-accordion__title">
                        <button 
                            type="button" 
                            class="ecl-accordion__toggle" 
                            data-ecl-accordion-toggle="" 
                            data-ecl-label-expanded="Close" 
                            data-ecl-label-collapsed="Open" 
                            aria-controls="accordion-example-content">
                            <span class="ecl-accordion__toggle-flex">
                                <span class="ecl-accordion__toggle-indicator">
                                    <span class="ecl-accordion__toggle-label">
                                        Open
                                    </span>
                                    <svg class="ecl-icon ecl-icon--m ecl-accordion__toggle-icon" focusable="false" aria-hidden="true" data-ecl-accordion-icon="">
                                        <use xlink:href="/icons.svg#plus"></use>
                                    </svg>
                                </span>
                                <span class="ecl-accordion__toggle-title">
                                    {{ distribution.title }}
                                </span>
                            </span>
                        </button>
                    </h3>
                    <div class="ecl-accordion__content" hidden="" id="accordion-example-content" role="region">
                        <div class="dsd-distribution-quality-property" v-for="(el, index) in qualityDistributionData" :key="index">
                            <h4>{{ el }}</h4>
                            <span>Time based search ..... 100%</span>
                            <span>Geo search ..... 100%</span>
                            <span>Keyword usage ..... 100%</span>
                            <span>Categories ..... 100%</span>
                        </div>
                        <div class="dsd-distribution-quality-csv">
                            <h4>CSV Validation Results</h4>
                            <div class="csv-result-box">
                                <h5>Valid CSV</h5>
                            </div>
                            <div class="csv-result-info">
                                <div class="errors">0 ERRORS</div>
                                <div class="warnings">1 WARNINGS</div>
                                <div class="messages">2 MESSAGES</div>
                            </div>
                            <br>
                            <span>Total Rows Processed: 4049</span>
                            <br>
                            <br>
                            <div class="csv-result-details">
                                <div class="badge warning">Warning</div>
                                <h5>Incorrect Encoding</h5>
                                <p>Your CSV ...</p>
                            </div>
                            <div class="csv-result-details">
                                <div class="badge message">Message</div>
                                <h5>Assumed Header</h5>
                                <p>Your CSV ...</p>
                            </div>
                            <div class="csv-result-details">
                                <div class="badge message">Message</div>
                                <h5>Non-standard Line Breaks on row 1</h5>
                                <p>Your CSV ...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { mapGetters } from 'vuex';
import { getTranslationFor } from "@piveau/piveau-hub-ui-modules/utils/helpers";

export default {
    name: 'datasetDetailsDistributionQuality',
    dependencies: 'DatasetService',
    data() {
        return {};
    },
    computed: {
        ...mapGetters('datasetDetails', [
            'getLanguages',
            'getDistributions',
            'getQualityDistributionData',
        ]),
        qualityDistributions() {
            return this.getDistributions.map(dist => {
                let d = dist;
                d.collapsed = true;
                d.title = this.getTranslationFor(d.title, this.$route.query.locale, this.getLanguages);
                return d;
            });
        },
        qualityDistributionData() {
            if (!this.getQualityDistributionData.result) return;

            let data = this.getQualityDistributionData.result.results[0][0];

            let properties = Object.keys(data).filter(prop => prop !== 'info');

            return properties.map(prop => {
                return data[prop];
            });
        }
    },
    methods: {
        toggleDistribution(index) {},
        getTranslationFor,
    },
    created() {
        // var elt = document.querySelector('[data-ecl-accordion]');
        // var accordion = new ECL.Accordion(elt);
        // accordion.init();
    },
    mounted() {},
};
</script>

<style lang="scss" scoped>
.dsd-distribution-quality {
    &-property {
        margin-bottom: 5%;
    }

    .box {
        &-header {
            cursor: pointer;
            border-bottom: 1px solid grey;

            span {
                font-size: 250%;
                font-weight: 300;
                margin-right: 2%;
            }

            h3 {
                display: inline-block;
            }
        }
    }

    .csv-result {

        &-box {
            display: inline-block;
            width: 60%;
            padding: 2%;
            background-color: white;
            border: 2px solid green;
        }

        &-info {
            display: inline;

            .errors, .warnings, .messages {
                display: inline;
            }
        }

        &-details {
            border-bottom: 1px solid grey;
            .badge {
                display: inline-block;
                margin: 2% 0;
                padding: 1% 3%;
                border-radius: 50%;

                &.error {
                    background-color: red;
                }

                &.warning {
                    background-color: orange;
                }

                &.message {
                    background-color: lightblue;
                }
            }
        }
    }
}
</style>
