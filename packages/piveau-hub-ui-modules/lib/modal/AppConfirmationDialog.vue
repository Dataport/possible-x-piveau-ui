<template>
  <!-- Modals -->
  <div class="modal fade modalWrapper" tabindex="-1" role="dialog" aria-labelledby="confirmationDialogLabel"
    data-backdrop="false" data-cy="create-doi-modal">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title" id="confirmationDialogLabel">
            Confirmation
          </h2>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <slot>
            Are you sure? This process can not be reverted.
          </slot>
        </div>
        <!-- Export options -->
        <!-- Currently unused but might be useful in the future -->
        <div class="modal-footer">
          <!-- <div class="alert alert-danger mr-auto" v-if="modal.error">
            {{ modal.error.message || "An unexpected network error occured." }}
          </div> -->
          <button class="btn btn-link" @click="$emit('confirm')" :disabled="loading">
            <span v-show="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            {{ confirm }}
          </button>
          <button class="btn btn-secondary" data-dismiss="modal" @click="handleHeader" :disabled="loading">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import $ from 'jquery';

export default defineComponent({
  name: 'ConfirmationDialog',
  inheritAttrs: false,
  props: {
    confirm: {
      type: String,
      default: 'confirm',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods:{
    handleHeader(){
      $('#navbar-toggle').css("z-index", "99")
    }
  }
});
</script>

<style>
/* If the display:block is active, the modal will appear in the bavaria hub-ui and makes it unusable. But it's actually not needed here.*/
.modalWrapper {
  backdrop-filter: brightness(0.5);
  /* display: block; */
  align-items: center;
  z-index: 100;
}
</style>