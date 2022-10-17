<template>
    <div class="dsd-distribution-quality container">
        <div class="mt-5">
            <h2>{{ $t('message.datasetDetails.quality.distributionQuality') }}</h2>
            <div class="markdown-content">
                <p v-html="$t('message.datasetDetails.intro.distribution', { locale: $route.query.locale })" />
            </div>
        </div>
        <div class="row">
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
                                <span class="ecl-accordion__toggle-indicator align-center">
                                    <svg class="ecl-icon ecl-icon--fluid ecl-button__icon ecl-button__icon--after" 
                                        :ref="`distPlus${index}`"
                                        focusable="false" 
                                        aria-hidden="true" 
                                        data-ecl-icon="">
                                        <use xlink:href="@/assets/img/ecl/icons.svg#plus"></use>
                                    </svg>
                                    <svg class="collapsed ecl-icon ecl-icon--fluid ecl-button__icon ecl-button__icon--after" 
                                        :ref="`distMinus${index}`"
                                        focusable="false" 
                                        aria-hidden="true" 
                                        data-ecl-icon="">
                                        <use xlink:href="@/assets/img/ecl/icons.svg#minus"></use>
                                    </svg>
                                </span>
                                <span class="ecl-accordion__toggle-title">
                                    {{ distribution.title }}
                                </span>
                                <span class="align-center">
                                    <PvBadge 
                                        class="format-badge" 
                                        :value="distribution.format"
                                        :type="distribution.format.id"></PvBadge>
                                </span>
                            </span>
                        </button>
                    </h3>
                    <div class="collapsed px-5 ecl-accordion__content ecl-u-border-top ecl-u-border-color-grey-25" :ref="`dist${index}`">
                        <div class="row dsd-distribution-quality-property" v-for="(qualityElement, index) in qualityDistributionData" :key="index">
                            <h4 class="col-12 mt-5 font-weight-bold">{{ $t(`message.datasetDetails.quality.${qualityElement.title}`) }}</h4>
                            <div class="col-4 mt-3" v-for="(el, index) in qualityElement.items" :key="index">
                                <span class="row" v-for="(property, index) in printObject(el)" :key="index">
                                    <span class="col-8 text-truncate" :title="property.key">{{ property.key }}</span>
                                    <span class="col-4">{{ property.value }}</span>
                                </span>
                            </div>
                        </div>
                        <!-- CSV Linter -->
                        <CSVLinter></CSVLinter>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { mapGetters } from 'vuex';
import { helpers, PvBadge, CSVLinter } from '@piveau/piveau-hub-ui-modules';

const { getTranslationFor } = helpers;

export default {
    name: 'datasetDetailsDistributionQuality',
    dependencies: 'DatasetService',
    components: {
        PvBadge,
        CSVLinter,
    },
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
            this.$refs[`distPlus${index}`][0].classList.toggle('collapsed');
            this.$refs[`distMinus${index}`][0].classList.toggle('collapsed');
        },
        printObject(object) {
            return Object.keys(object).map(o => {
                return { key: this.$t(`message.datasetDetails.quality.${o}`), value: this.convertValue(JSON.stringify(object[o])) }
            });
        },
        convertValue(value) {
            return value === 'true' ? 'yes'
                : value === 'false' ? 'no'
                : value === '{}' ? 'n/a'
                : value;
        },
    },
    created() {},
    mounted() {},
};
</script>

<style lang="scss" scoped>
.dsd-distribution-quality {
    .collapsed {
        display: none;
    }

    .align-center {
        align-self: center;
    }
}
</style>
