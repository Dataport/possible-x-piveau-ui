<template>
    <div>
        <template v-if="isDatasetDetailsPage">
            <div class="row">
                <div class="col-12 px-0 mb-3">
                    <div class="row">
                        <div class="col-12 px-0 mb-1">
                            <skeletor type="rect" :width="300" :height="50" animation="fade"></skeletor>
                        </div>
                        <div class="col-12 px-0 mb-1">
                            <skeletor type="rect" :width="500" :height="50" animation="fade"></skeletor>
                        </div>
                    </div>
                </div>
                <div class="col-7 px-0">
                    <div class="row">
                        <div class="col-12 px-0 mb-1">
                            <skeletor type="rect" rounded :width="400" :height="20" animation="fade"></skeletor>
                        </div>
                        <div class="col-12 px-0 mb-1" v-for="number in 20" :key="number">
                            <skeletor type="rect" rounded :width="400" :height="10" animation="fade"></skeletor>
                        </div>
                    </div>
                </div>
                <div class="col-5 px-0">
                    <div class="col-6 px-0 mb-1">
                        <skeletor type="rect" :width="450" :height="500" animation="fade"></skeletor>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="isDatasetsPage">
            <div class="col-12 mb-1" v-for="number in 20" :key="number">
                <skeletor type="rect" :width="700" :height="200" animation="fade"></skeletor>
            </div>
        </template>
        <template v-if="isCataloguesPage">
            <div class="col-12 mb-1" v-for="number in 20" :key="number">
                <skeletor type="rect" :width="700" :height="100" animation="fade"></skeletor>
            </div>
        </template>
    </div>
</template>

<script>
export default {
  name: 'datasetDetailsSkeleton',
  components: {},
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
