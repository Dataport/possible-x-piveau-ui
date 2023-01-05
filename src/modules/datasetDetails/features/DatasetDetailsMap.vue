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
import MapBasic from "@/modules/map/MapBasic";
import {isArray, isNil, isString} from "lodash";
import {mapGetters} from "vuex";
import DatasetDetailsFeatureHeader
  from "@/modules/datasetDetails/features/DatasetDetailsFeatureHeader";
export default {
  name: "DatasetDetailsMap",
  components: {DatasetDetailsFeatureHeader, MapBasic},
  data() {
    return {
      mapVisible: this.$env.maps.mapVisible,
      maps: {
        location: this.$env.maps.location,
        spatialType: this.$env.maps.spatialType,
        height: this.$env.maps.height,
        width: this.$env.maps.width,
        mapContainerId: this.$env.maps.mapContainerId,
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
