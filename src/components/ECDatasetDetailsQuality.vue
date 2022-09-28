<template>
    <div class="dsd-quality">
        <metadata-quality></metadata-quality>
        <distribution-quality></distribution-quality>
    </div>
</template>
  
<script>
import { mapActions, mapGetters } from 'vuex';
import { has, isArray, isEmpty } from 'lodash';
import { getTranslationFor } from "@piveau/piveau-hub-ui-modules/utils/helpers";

import MetadataQuality from './ECDatasetDetailsMetadataQuality.vue';
import DistributionQuality from './ECDatasetDetailsDistributionQuality.vue';

export default {
    name: 'datasetDetailsQuality',
    dependencies: 'DatasetService',
    components: {
        MetadataQuality,
        DistributionQuality,
    },
    data() {
        return {};
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
            'getLanguages',
        ]),
    },
    methods: {
        ...mapActions('datasetDetails', [
            'useService',
            'loadDatasetDetails',
            'loadQualityData',
            'loadQualityDistributionData',
        ]),
        has,
        isArray,
        isEmpty,
        getTranslationFor,
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
    mounted() {},
};
</script>

<style lang="scss">
</style>
