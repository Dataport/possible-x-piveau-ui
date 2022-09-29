<template>
    <div class="container dsd-distribution-quality">
        <div class="header mt-5">
            <h2>{{ $t('message.datasetDetails.quality.distributionQuality') }}</h2>
            <div class="markdown-content">
                <p v-html="$t('message.datasetDetails.intro.distribution', { locale: $route.query.locale })" />
            </div>
        </div>
        <div class="row content">
            <div class="col-12 ecl-accordion" data-ecl-auto-init="Accordion" data-ecl-accordion="">
                <div class="ecl-accordion__item" v-for="(distribution, index) in qualityDistributions" :key="index">
                    <!-- Distribution Quality -->
                    <h3 class="ecl-accordion__title" @click="toggleDistribution(index)">
                        <button 
                            type="button" 
                            class="ecl-accordion__toggle" 
                            data-ecl-accordion-toggle="" 
                            data-ecl-label-expanded="Close" 
                            data-ecl-label-collapsed="Open" 
                            aria-controls="accordion-example-content">
                            <span class="ecl-accordion__toggle-flex">
                                <span class="ecl-accordion__toggle-indicator">
                                    <div class="collapsed ecl-icon ecl-icon--m ecl-accordion__toggle-icon" :ref="`distDown${index}`" focusable="false">
                                        <i class="material-icons">keyboard_arrow_down</i>
                                    </div>
                                    <div class="ecl-icon ecl-icon--m ecl-accordion__toggle-icon" :ref="`distUp${index}`" focusable="false">
                                        <i class="material-icons">keyboard_arrow_up</i>
                                    </div>
                                </span>
                                <span class="ecl-accordion__toggle-title">
                                    {{ distribution.title }}
                                </span>
                            </span>
                        </button>
                    </h3>
                    <div class="collapsed ecl-accordion__content ecl-u-border-top ecl-u-border-color-grey-25" :ref="`dist${index}`">
                        <div class="dsd-distribution-quality-property" v-for="(qualityElement, index) in qualityDistributionData" :key="index">
                            <h4>{{ $t(`message.datasetDetails.quality.${qualityElement.title}`) }}</h4>
                            <div v-for="(el, index) in qualityElement.items" :key="index">
                                <span v-for="(property, index) in printObject(el)" :key="index">{{ property }}</span>
                            </div>
                        </div>
                        <!-- CSV Linter -->
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
                                <div class="badge ecl-u-type-color-white" :class="getBadgeStyle('error')">Error</div>
                                <h5>ERROR</h5>
                                <p>Your CSV ...</p>
                            </div>
                            <div class="csv-result-details">
                                <div class="badge ecl-u-type-color-white" :class="getBadgeStyle('warning')">Warning</div>
                                <h5>Incorrect Encoding</h5>
                                <p>Your CSV ...</p>
                            </div>
                            <div class="csv-result-details">
                                <div class="badge ecl-u-type-color-white" :class="getBadgeStyle('message')">Message</div>
                                <h5>Assumed Header</h5>
                                <p>Your CSV ...</p>
                            </div>
                            <div class="csv-result-details">
                                <div class="badge ecl-u-type-color-white" :class="getBadgeStyle('message')">Message</div>
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
                return {
                    title: prop,
                    items: data[prop],
                }
            });
        }
    },
    methods: {
        getTranslationFor,
        toggleDistribution(index) {
            this.$refs[`dist${index}`][0].classList.toggle('collapsed');
            this.$refs[`distDown${index}`][0].classList.toggle('collapsed');
            this.$refs[`distUp${index}`][0].classList.toggle('collapsed');
        },
        printObject(object) {
            return Object.keys(object).map(o => `${this.$t(`message.datasetDetails.quality.${o}`)}: ${JSON.stringify(object[o])}`);
        },
        getBadgeStyle(type) {
            return type === 'error' ? 'ecl-u-bg-red'
                : type === 'warning' ? 'ecl-u-bg-orange'
                : type === 'message' ? 'ecl-u-bg-blue-50'
                : 'ecl-u-bg-white';
        },
    },
    created() {},
    mounted() {},
};
</script>

<style lang="scss" scoped>
.dsd-distribution-quality {
    &-property {
        margin-bottom: 5%;
    }

    .collapsed {
        display: none;
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
