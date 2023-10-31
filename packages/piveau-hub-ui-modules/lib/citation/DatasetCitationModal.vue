<template>
  <div class="modal fade" id="citationModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel"
    aria-hidden="true" data-cy="citation-modal">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title" id="deleteModalLabel">
            {{ $t('message.cite.title') }}
          </h2>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" data-cy="citation-modal-close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <dataset-citation-table
            v-if="citationStyle && !getLoading && getID"
            :modal-id="modalId"
            :citation-style="citationStyle"
            :available-citation-styles="availableCitationStyles"
          />
        </div>
        <!-- Export options -->
        <!-- Currently unused but might be useful in the future -->
        <!-- <div v-if="false" class="modal-footer">
          <button v-for="({name, args, postprocess, extension, disabled}, format) in exportFormats"
            :key="`format@${format}`" type="button" class="btn btn-link" :disabled="disabled || getLoading || !citation"
            @click="handleCitationExport({ args, postprocess, extension, filename: getID })">
            {{ name }}
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapGetters } from "vuex";

export default {
  components: {
    //  Lazy-load DatasetCitationTable
    DatasetCitationTable: defineAsyncComponent(() =>  import(/* webpackChunkName: "dataset-citation-table" */ "./DatasetCitationTable.vue")),
  },
  props: {
    modalId: {
      type: String,
      default: 'citationModal',
    },
    citationStyle: {
      type: String,
      default: '',
    },
    availableCitationStyles: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getLoading',
      'getID'
    ]),
  }
}
</script>
