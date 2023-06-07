<!-- Basic MAP component -->

<template>
  <div :id="mapContainerId" ref="mapref" style="z-index:0"></div>
</template>

<script>
  import { mapActions } from 'vuex';
  import Leaflet from 'leaflet';

  // Fix Leaflet Marker Bug (https://github.com/Leaflet/Leaflet/issues/4968#issuecomment-264311098)
  import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
  import iconUrl from 'leaflet/dist/images/marker-icon.png';
  import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

  Leaflet.Marker.prototype.options.icon = Leaflet.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });

  export default {
    name: 'MapBasic',
    data() {
      return {
        map: {},
        mapStyle: this.$env.content.maps.mapStyle,
        urlTemplate: this.$env.content.maps.urlTemplate,
        options: this.$env.content.maps.options,
      };
    },
    props: {
      location: {
        type: Array,
      },
      spatialType: {
        type: String,
      },
      height: {
        type: String,
      },
      width: {
        type: String,
      },
      mapContainerId: {
        type: String,
      },
    },
    computed: {
      type() { return this.spatialType.substring(0, 1).toUpperCase() + this.spatialType.substring(1); },
    },
    methods: {
      ...mapActions('datasets', [
      ]),
      initMap() {
        // Init Map
        const map = Leaflet.map(this.mapContainerId, { editable: true });

        // Get Tiles
        Leaflet.tileLayer(this.urlTemplate, this.options).addTo(map);

        // Use GeoJSON object
        const geoJsonLayer = Leaflet.geoJSON({
          type: 'Feature',
          properties: {},
          geometry: {
            type: this.type,
            coordinates: this.location,
          },
        }, {
          style: this.mapStyle,
          pointToLayer: (feature, latLng) => Leaflet.circleMarker(latLng, this.mapStyle),
        }).addTo(map);

        this.$refs.mapref.style.height = this.height;
        this.$refs.mapref.style.width = this.width;
        map.invalidateSize();
        map.setZoom(map.getBoundsZoom(geoJsonLayer.getBounds()));
        map.fitBounds(geoJsonLayer.getBounds());
        return map;
      },
    },
    filters: {},
    watch: {
      height: {
        handler(height) {
          this.$refs.mapref.style.height = height;
          this.map.invalidateSize();
        },
      },
      width: {
        handler(width) {
          this.$refs.mapref.style.width = width;
          this.map.invalidateSize();
        },
      },
    },
    mounted() {
      this.map = this.initMap();
      this.map.on('resize', () => {
        this.map.invalidateSize();
      });
    },
  };
</script>

<style lang="scss">
  .leaflet-zoom-anim .leaflet-zoom-animated {
    will-change: unset !important;
  }
</style>
