<template>
  <div class="dsd-feature dsd-map">
    <dataset-details-feature-header
      :title="$t('message.datasetDetails.geoInfo')"
      :arrowDown="!mapVisible"
      tag="geo-info-toggle"
      :onClick="toggleMap"
    />
    <div class="mt-3 w-100 h-100">
      <div id="collapse-geo-info"
           ref="geocollapse"
           class="collapse"
           :class="{ 'show': mapVisible }"
           data-cy="geo-info">
        <div class="map">
          <map-basic
            :location="getCoordinates()"
            :spatial-type="getSpatialType()"
            :height="maps.height"
            :width="maps.width"
            :map-container-id="maps.mapContainerId"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue, { defineAsyncComponent } from "vue";
import {isArray, isNil, isString} from "lodash";
import {mapGetters} from "vuex";
import { Skeletor } from 'vue-skeletor';

const MapBasic = defineAsyncComponent({
  // Lazy-load mapbasic component
  loader: () => import("../../map/MapBasic"),
  loadingComponent: {
    // Load skeleton while the mapbasic component is loading
    components: { Skeletor },
    render: (h) => {
      return h('vue-skeletor',
      {
        props: {
        width: Vue.prototype.$env.content.maps.width,
        height: Vue.prototype.$env.content.maps.height,
        animation: 'fade',
        }
      })
    }
  },
});

export default {
  name: "DatasetDetailsMap",
  components: {
    // DatasetDetailsFeatureHeader,
    MapBasic},
  data() {
    return {
      mapVisible: this.$env.content.maps.mapVisible,
      maps: {
        location: this.$env.content.maps.location,
        spatialType: this.$env.content.maps.spatialType,
        height: this.$env.content.maps.height,
        width: this.$env.content.maps.width,
        mapContainerId: this.$env.content.maps.mapContainerId,
      }
    }
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getSpatial'
    ])
  },
  methods: {
    toggleMap() {
      this.$refs.geocollapse.classList.toggle('show');
      this.mapVisible = !this.mapVisible;
    },
    getCoordinates() {
      const coordinates = this.getSpatial[0].coordinates;
      return (!isNil(coordinates) && isArray(coordinates) && isArray(coordinates[0])) ? [coordinates[0], this.maps.location[1]] : this.maps.location;
    },
    getSpatialType() {
      const type = this.getSpatial[0].type;
      return (!isNil(type) && isString(type)) ? type : this.maps.spatialType;
    }
  },
  mounted(){
    this.mapVisible = !this.mapVisible;
  }
}
</script>

<style scoped lang="scss">
.heading {
  cursor: pointer;
}
</style>
