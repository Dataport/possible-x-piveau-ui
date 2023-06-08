<template>
    <div>
        <template v-if="isDatasetDetailsPage">
            <div class="row">
                <div class="col-12 px-0 mb-3">
                    <div class="row">
                        <div class="col-12 px-0 mb-1">
                            <skeleton-loader type="rect" :width="300" :height="50" animation="fade"></skeleton-loader>
                        </div>
                        <div class="col-12 px-0 mb-1">
                            <skeleton-loader type="rect" :width="500" :height="50" animation="fade"></skeleton-loader>
                        </div>
                    </div>
                </div>
                <div class="col-7 px-0">
                    <div class="row">
                        <div class="col-12 px-0 mb-1">
                            <skeleton-loader type="rect" rounded :width="400" :height="20" animation="fade"></skeleton-loader>
                        </div>
                        <div class="col-12 px-0 mb-1" v-for="number in 20" :key="number">
                            <skeleton-loader type="rect" rounded :width="400" :height="10" animation="fade"></skeleton-loader>
                        </div>
                    </div>
                </div>
                <div class="col-5 px-0">
                    <div class="col-6 px-0 mb-1">
                        <skeleton-loader type="rect" :width="450" :height="500" animation="fade"></skeleton-loader>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="isDatasetsPage">
            <div class="col-12 mb-1" v-for="number in 20" :key="number">
                <skeleton-loader type="rect" :width="700" :height="200" animation="fade"></skeleton-loader>
            </div>
        </template>
        <template v-if="isCataloguesPage">
            <div class="col-12 mb-1" v-for="number in 20" :key="number">
                <skeleton-loader type="rect" :width="700" :height="100" animation="fade"></skeleton-loader>
            </div>
        </template>
    </div>
</template>

<script>
import VueSkeletonLoader from 'skeleton-loader-vue';

export default {
  name: 'datasetDetailsSkeleton',
  components: {
    SkeletonLoader: VueSkeletonLoader,
  },
  props: ['type'],
  data() {
    return {};
  },
  computed: {
    isDatasetDetailsPage() {
        return this.type === 'DatasetDetails';
    },
    isDatasetsPage() {
        return this.type === 'Datasets';
    },
    isCataloguesPage() {
        return this.type === 'Catalogues';
    },
  },
  methods: {}
};
</script>
