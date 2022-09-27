<template>
    <div>
        <div class="metadata-quality">
            <div class="header">
                <h2>{{ $t('message.header.navigation.data.metadataquality') }}</h2>
                <div class="markdown-content">
                    <p v-html="$t('message.datasetDetails.intro.metadataQuality', { locale: $route.query.locale })"></p>
                </div>
            </div>
            <div class="content">
                <div class="box" v-for="(el, index) in metadataQualityProperties" :key="index">
                    <div class="box-header">
                        <h3>{{ el }}</h3>
                    </div>
                    <div class="box-content">
                        <span>Time based search ..... 100%</span>
                        <span>Geo search ..... 100%</span>
                        <span>Keyword usage ..... 100%</span>
                        <span>Categories ..... 100%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="distribution-quality">
            <div class="header mt-5">
                <h2>{{ $t('message.datasetDetails.quality.distributionQuality') }}</h2>
                <div class="markdown-content">
                    <p v-html="$t('message.datasetDetails.intro.distribution', { locale: $route.query.locale })" />
                </div>
            </div>
            <div class="content">
                <div class="box" v-for="(distribution, index) in distributions" :key="index">
                    <div class="box-header" @click="toggleDistribution(index)">
                        <span>{{ distribution.collapsed ? '+' : '-'}}</span>
                        <h3>{{ distribution.title }}</h3>
                    </div>
                    <div class="box-content" v-if="!distribution.collapsed">
                        <div class="distribution-quality-property" v-for="(el, index) in distriubtionQualityProperties" :key="index">
                            <h4>{{ el }}</h4>
                            <span>Time based search ..... 100%</span>
                            <span>Geo search ..... 100%</span>
                            <span>Keyword usage ..... 100%</span>
                            <span>Categories ..... 100%</span>
                        </div>
                        <div class="distribution-quality-csv">
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
import { mapActions, mapGetters } from 'vuex';
import { has } from 'lodash';
import { getTranslationFor } from "../utils/helpers";

export default {
    name: 'datasetDetailsQuality',
    dependencies: 'DatasetService',
    data() {
        return {
            distributions: [
                {
                    title: 'Test Distribution 1',
                    collapsed: true,
                },
                {
                    title: 'Test Distribution 2',
                    collapsed: true,
                },
                {
                    title: 'Test Distribution 3',
                    collapsed: true,
                }
            ],
            metadataQualityProperties: [
                'Findability',
                'Accessibility',
                'Interoperability',
                'Reusability',
                'Contextuality',
            ],
            distriubtionQualityProperties: [
                'Accessibility',
                'Reusability',
                'Contextuality',
                'Interoperability',
            ]
        };
    },
    metaInfo() {
        return {
            title: this.$t('message.datasetDetails.subnav.quality'),
            meta: [
                {
                    name: 'description',
                    vmid: 'description',
                    content: (`${this.$t('message.datasetDetails.subnav.quality')} - ${this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages)} - data.europa.eu`)?.substring(0, 4999),
                },
            ],
        };
    },
    computed: {
        ...mapGetters('datasetDetails', [
            'getQualityData',
            'getQualityDistributionData',
            'getDistributions',
        ]),
        qualityDataResults() {
            if (!this.getQualityData.result) return;

            let data = this.getQualityData.result.results[0];

            console.log(data);

            let properties = Object.keys(data).filter(prop => prop !== 'info');
            
            console.log(properties);

            return properties.map(prop => {

                let propData = data[prop];
                let propDataItems = propData.map(pdi => {

                    let propDataKeys = Object.keys(pdi);
                    let propDataKeysItems = propDataKeys.map(pdki => pdi[pdki]);

                    return {
                        title: this.$t(`message.datasetDetails.quality.${prop}`),
                        items: propDataKeysItems,
                    }
                });

                return {
                    title: this.$t(`message.datasetDetails.quality.${prop}`),
                    items: propDataItems,
                };
            });
        }
    },
    methods: {
        ...mapActions('datasetDetails', [
            'useService',
            'loadDatasetDetails',
            'loadQualityData',
            'loadQualityDistributionData',
        ]),
        has,
        getTranslationFor,
        toggleDistribution(index) {
            this.distributions[index].collapsed = !this.distributions[index].collapsed;
        },
    },
    created() {
        this.useService(this.DatasetService);
        this.$nextTick(() => {
            this.$Progress.start();
            this.isLoadingQualityData = true;
            this.isLoadingQualityDistributionData = true;
            
            this.loadDatasetDetails(this.$route.params.ds_id)
            .then(() => {
                this.$Progress.finish();
            })
            .catch(() => {
                this.$Progress.fail();
                this.$router.replace({
                name: 'NotFound',
                query: { locale: this.$route.query.locale, dataset: this.$route.params.ds_id },
                });
            });

            this.loadQualityData(this.$route.params.ds_id)
            .then(() => {
                this.$Progress.finish();
                this.isLoadingQualityData = false;
            })
            .catch(() => {
                this.$Progress.fail();
                this.isLoadingQualityData = false;
            });

            this.loadQualityDistributionData(this.$route.params.ds_id)
            .then(() => {
                this.$Progress.finish();
                this.isLoadingQualityDistributionData = false;
            })
            .catch(() => {
                this.$Progress.fail();
                this.isLoadingQualityDistributionData = false;
            });
        });
    },
    mounted() {
        console.log(this.qualityDataResults);
    },
};
</script>

<style lang="scss" scoped>
.box {
    margin-top: 1%;
    padding: 2%;
    background-color: lightgrey;
    border: 1px solid grey;

    &-content {
        margin-top: 2%;
    }
}

.metadata-quality {
    .box {
        margin-top: 2%;
    }
}
.distribution-quality {
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
