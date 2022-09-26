<template>
  <div class="row mt-5">
    <div class="row w-100 d-flex dsd-item">
      <div class="d-none d-lg-block my-auto pr-0 text-right"
           @click="toggleMap()">
          <span class="arrow text-dark"
                v-if="!mapVisible">
            <i class="material-icons">keyboard_arrow_down</i>
          </span>
        <span class="arrow text-dark" v-else>
            <i class="material-icons">keyboard_arrow_up</i>
          </span>
      </div>
      <div class="col-11 py-2 bg-white">
        <h2 class="heading"
            data-cy="geo-info-toggle"
            @click="toggleMap()">{{ $t('message.datasetDetails.geoInfo') }}</h2>
      </div>
      <div class="d-block d-lg-none col-1 my-auto pr-0 text-right"
           @click="toggleMap()">
          <span class="arrow text-dark"
                v-if="!mapVisible">
            <i class="material-icons">keyboard_arrow_down</i>
          </span>
        <span class="arrow text-dark" v-else>
            <i class="material-icons">keyboard_arrow_up</i>
          </span>
      </div>
    </div>
    <div class="dsd-item">
      <div id="collapse-geo-info"
           ref="geocollapse"
           class="collapse show"
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
export default {
  name: "DatasetDetailsMap",
  components: {MapBasic},
  data() {
    return {
      mapVisible: true,
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
  }
}
</script>

<style scoped lang="scss">
.heading {
  cursor: pointer;
}
</style>
