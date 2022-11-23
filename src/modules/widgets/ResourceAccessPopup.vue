<template>
  <div id="externalAccess" tabindex="-1" role="dialog" class="modal fade show" aria-hidden="true" aria-modal="true" style="padding-left: 0px;">
    <div role="document" class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <span style="font-size: 3em; color: #001D85;">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
          <h3 class="modal-title">{{ title }}</h3>
          <button @click="closeModal()" type="button" data-dismiss="modal" aria-label="Close" class="close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ text }}</p>
          <input v-model="checked" type="checkbox" id="" name="decision" value="false">
          <label class="mx-2" for="decision"> {{ checkboxText }}</label><br>
        </div>
        <div class="modal-footer">
          <button @click="closeModal()" type="button" data-dismiss="modal" class="btn btn-secondary">Cancel</button>
          <button @click="proceed" type="button" class="btn btn-success">Proceed</button>
        </div>
    </div>
  </div>
</div>
</template>
<script>
import $ from 'jquery/dist/jquery.slim.min.js';

export default {
  name: 'ResourceAccessPopup',
  data() {
    return {
      checked: false,
      toggleDownloadPopup: false,
      title: 'Loading content from external services',
      text: 'If you continue, you are loading content from external services. These external services are not maintained by the European Commission and therefore we have no influence on their availability/stability/security.',
      checkboxText: 'Store the given choice in cookie.',
      callback: '',
      expires: { expires: 1 }, // 1 Day
    };
  },
  methods: {
    openModal(callbackFunction, toggleDownloadPopup) {
      const cookie = this.$cookie.get('externalContent');
      this.callback = '';
      this.callback = callbackFunction;
      this.toggleDownloadPopup = toggleDownloadPopup;
      if (cookie === 'false') {
        $('#externalAccess').modal('show');
      } else {
        this.callback();
      }
    },
    closeModal() {
      $('#externalAccess').modal('hide');
    },
    proceed() {
      $('#externalAccess').modal('hide');
      if (this.toggleDownloadPopup) {
        $('#downloadAllModal').modal('show');
      }
      this.callback();
    },
  },
  watch: {
    checked() {
      if (this.checked) {
        this.$cookie.set('externalContent', this.checked, this.expires);
      } else if (!this.checked) {
        if (this.$cookie.get('externalContent')) {
          this.$cookie.set('externalContent', this.checked, this.expires);
        }
      }
    },
  },
  created() {
    if (this.$cookie.get('externalContent') == null) {
      this.$cookie.set('externalContent', false, this.expires);
    }
  },
};
</script>
<style scoped>
.modal-title {
  padding-left: 20px;
  line-height: 1.19;
}
</style>
