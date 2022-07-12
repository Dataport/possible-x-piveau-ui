<template>
<div v-if="useDatasetFacetsMap && !showCatalogDetails">
  <div class="row">
    <div class="input-group suggestion-input-group mb-3">
      <input type="text" class="form-control suggestion-input"
        :aria-label="$t('message.datasets.findLocation')"
        :placeholder="$t('message.datasets.findLocation')"
        :title="$t('message.tooltip.locationFilter')"
        data-toggle="tooltip"
        data-placement="right"
        v-model="gazetteer.searchbarText"
        @focus="gazetteer.selected = false; gazetteer.searchbarText = ''"
        @input="getAutocompleteSuggestions(gazetteer.searchbarText)"
        @keyup.enter="getAutocompleteSuggestions(gazetteer.searchbarText)">
      <div class="input-group-append">
        <button class="btn btn-primary rounded-right search-button" :title="$t('message.tooltip.locationFilter')">
          <i class="material-icons align-bottom">search</i>
        </button>
      </div>
      <div class="suggestion-list-group">
        <ul class="list-group suggestion-list">
          <button class="list-group-item list-group-item-action"
            v-for="(suggestion, i) in gazetteer.suggestions"
            :key="i"
            v-if="i <= 9 && !gazetteer.selected"
            @click="handleSuggestionSelection(suggestion)">
            {{suggestion.name}}
          </button>
        </ul>
      </div>
    </div>
  </div>
  <div class="row position-relative mb-3">
    <map-bounds-receiver class="border-secondary map focus-border"
           :start-bounds="map.receiver.startBounds"
           :height="map.receiver.height"
           :width="map.receiver.width"
           :map-container-id="map.receiver.mapContainerId"
           :bounds-id="map.geoBoundsId"
           :title="$t('message.tooltip.locationFilter')"
            data-toggle="tooltip"
            data-placement="top"
           ref="mapReceiver"></map-bounds-receiver>
    <button class="btn btn-highlight reset-bounds-button" v-if="getGeoBoundsById(map.geoBoundsId)" @click="resetBoundsFor(map.geoBoundsId)">
      Reset Bounds
    </button>
    <button class="btn btn-sm btn-secondary map-modal-button" data-toggle="modal" data-target=".map-modal" @click="triggerResize()">
      <i class="material-icons">fullscreen</i>
    </button>
    <!-- Modal Map Start -->
    <div id="modal-map-wrapper" class="modal fade map-modal pr-md-4 pl-md-4 pr-0 pl-0" tabindex="-1" role="dialog" aria-labelledby="Large map view" aria-hidden="true">
      <div class="modal-dialog mt-md-4 mb-md-4 m-0">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">{{ $t('message.mapModal.drawRectangleMsg') }}</h2>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body d-flex flex-row flex-wrap p-md-3 p-0">
            <map-bounds-sender :start-bounds="map.sender.startBounds"
                         :height="map.sender.height"
                         :width="map.sender.width"
                         :map-container-id="map.sender.mapContainerId"
                         :bounds-id="map.geoBoundsId"
                         ref="mapSender"></map-bounds-sender>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">{{ $t('message.mapModal.close') }}</button>
            <button type="button" class="btn btn-highlight" data-dismiss="modal" @click="resetBoundsFor(map.geoBoundsId)">{{ $t('message.mapModal.reset') }}</button>
            <button type="button" class="btn btn-primary" @click="applyHoldedBounds()" data-dismiss="modal">{{ $t('message.mapModal.findDatasets') }}</button>
          </div>
        </div>
      </div>
    </div>
  <!-- Modal Map End -->
  </div>
</div>
</template>

<script>
import MapBoundsSender from '../../map/MapBoundsSender.vue';
import MapBoundsReceiver from '../../map/MapBoundsReceiver.vue';
import {isNil} from "lodash";
import {mapActions, mapGetters} from "vuex";
export default {
  name: "DatasetFacetMap",
  dependencies: ['GazetteerService'],
  components: {
    MapBoundsReceiver,
    MapBoundsSender
  },
  props: [
    "showCatalogDetails"
  ],
  data() {
    return {
      useDatasetFacetsMap: this.$env.datasets.facets.useDatasetFacetsMap,
      gazetteer: {
        searchbarText: '',
        suggestions: [],
        selected: false,
        bounds: [],
      },
      map: {
        sender: {
          startBounds: this.$env.maps.sender.startBounds,
          height: this.$env.maps.sender.height,
          width: this.$env.maps.sender.width,
          mapContainerId: this.$env.maps.sender.mapContainerId,
        },
        receiver: {
          startBounds: this.$env.maps.receiver.startBounds,
          height: this.$env.maps.receiver.height,
          width: this.$env.maps.receiver.width,
          mapContainerId: this.$env.maps.receiver.mapContainerId,
        },
        geoBoundsId: this.$env.maps.geoBoundsId,
      },
      browser: {
        /* eslint-disable-next-line */
        isIE: /*@cc_on!@*/false || !!document.documentMode,
      }
    }
  },
  computed: {
    ...mapGetters('gazetteer', [
      'getSuggestions',
    ]),
    ...mapGetters('geo', [
      'getGeoBoundsById',
      'getHoldedGeoBoundsById',
    ])
  },
  methods: {
    ...mapActions('gazetteer', [
      'autocomplete',
      'useService',
    ]),
    ...mapActions('geo', [
      'setGeoBoundsForId',
      'resetGeoBoundsForId',
      'resetHoldedGeoBoundsForId',
    ]),
    ...mapActions('datasets', [
      'setDatasetGeoBounds'
    ]),
    applyHoldedBounds() {
      const holdedBounds = this.getHoldedGeoBoundsById(this.map.geoBoundsId);
      this.setGeoBoundsForId({
        bounds: holdedBounds,
        boundsId: this.map.geoBoundsId,
      });
    },
    resetBoundsFor(boundsId) {
      this.$refs.mapSender.resetBounds();
      this.$refs.mapReceiver.resetBounds();
      this.resetGeoBoundsForId(boundsId);
      this.resetHoldedGeoBoundsForId(boundsId);
    },
    getAutocompleteSuggestions(query) {
      if (!query || isNil(query)) this.clearAutocompleteSuggestions();
      else {
        this.autocomplete(query).then(() => {
          this.$nextTick(() => {
            this.gazetteer.suggestions = this.getSuggestions;
          });
        });
      }
    },
    clearAutocompleteSuggestions() {
      this.gazetteer.suggestions = [];
    },
    handleSuggestionSelection(suggestion) {
      this.gazetteer.searchbarText = suggestion.name;
      this.gazetteer.selected = true;
      const location = suggestion.geometry.split(',');
      this.gazetteer.bounds = [[location[1], location[0]], [location[3], location[2]]]
        .map(point => point.map(coord => parseFloat(coord)));
      this.setGeoBoundsForId({
        bounds: this.gazetteer.bounds,
        boundsId: this.map.geoBoundsId,
      });
    },
    triggerResize() {
      if (this.browser.isIE) {
        // Note: Trigger resize after 500ms (IE11 needs longer than modern browsers) in IE11 when Modal element is visible to properly display the map component
        setTimeout(() => {
          const evt = document.createEvent('UIEvents');
          evt.initUIEvent('resize', true, false, window, 0);
          window.dispatchEvent(evt);
        }, 500);
      } else {
        // Note: Trigger resize after 200ms when Modal element is visible to properly display the map component
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 200);
      }
    },
    // geoStateBoundsWatcher() {
    //   return this.getGeoBoundsById(this.map.geoBoundsId);
    // }
  },
  watch: {
    geoStateBoundsWatcher: {
      deep: true,
      handler(bounds) {
        this.setDatasetGeoBounds(bounds);
      },
    }
  },
  created() {
    this.useService(this.GazetteerService);
  }
}
</script>

<style lang="scss" scoped>

.search-button {
  &:hover {
    background-color: #196fd2;
    border-color: #196fd2
  }
}

.map {
  z-index: 0;
}
.suggestion-input-group {
  position: relative;
}
.suggestion-input {
  // Position absolute is causing the input box to be invisible
  // position: absolute;
  position: relative;
  top: 0;
  height: 100%;
}
.suggestion-list-group {
  position: relative;
  width: 100%;
}
.suggestion-list {
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 100;
}

.map-modal-button {
  position: absolute;
  bottom: 0;
  right: 0;
}

#modal-map-wrapper .modal-dialog {
  max-width: 100%;
}

.modal-content {
  //min-height: 100%;
  min-height: 100vh;
}

#modalMap {
  display: flex;
  flex: 1 1;
}

.reset-bounds-button {
  position: absolute;
  bottom: 0;
  left: 0;
}

.focus-border {
  transition: box-shadow 200ms ease;

  &:focus {
    box-shadow: 0px 0px 7px #202020;
  }
}

@media (min-width: 768px) {
  .modal-content {
    min-height: auto!important;
  }
  #modalMap {
    height: 500px;
  }
}

/*** MATERIAL ICONS ***/
.material-icons.small-icon {
  font-size: 20px;
}
</style>
