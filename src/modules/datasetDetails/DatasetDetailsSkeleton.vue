<template>
    <div class="container">
      <div class="row">
        <div class="col-12 px-0 mb-3">
            <div class="row">
                <div class="col-12 mb-1">
                    <skeleton-loader type="rect" :width="300" :height="50" animation="fade"></skeleton-loader>
                </div>
                <div class="col-12 mb-1">
                    <skeleton-loader type="rect" :width="500" :height="50" animation="fade"></skeleton-loader>
                </div>
            </div>
        </div>
        <div class="col-8 px-0">
            <div class="row">
                <div class="col-12 mb-1">
                    <skeleton-loader type="rect" rounded :width="400" :height="20" animation="fade"></skeleton-loader>
                </div>
                <div class="col-12 mb-1" v-for="number in 20" :key="number">
                    <skeleton-loader type="rect" rounded :width="400" :height="10" animation="fade"></skeleton-loader>
                </div>
            </div>
        </div>
        <div class="col-4 px-0">
            <div class="col-6 mb-1">
                <skeleton-loader type="rect" :width="200" :height="300" animation="fade"></skeleton-loader>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
import VueSkeletonLoader from 'skeleton-loader-vue';

export default {
  name: 'datasetDetailsSkeleton',
  components: {
    SkeletonLoader: VueSkeletonLoader,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
