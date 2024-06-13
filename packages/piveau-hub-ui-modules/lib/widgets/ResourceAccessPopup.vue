<template>
  <div id="externalAccess" tabindex="-1" role="dialog" class="modal fade show" aria-hidden="true" aria-modal="true" style="padding-left: 0px; background-color: rgba(0, 0, 0, 0.75);">
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
import $ from 'jquery';
import { useCookies } from "vue3-cookies";

export default {
  name: 'ResourceAccessPopup',
  data() {
    return {
      checked: false,
      toggleDownloadPopup: false,
      title: 'Loading content from external services',
      text: this.$t('message.datasetDetails.datasets.modal.downloadPopup'),
      checkboxText: 'Store the given choice in cookie.',
      callback: '',
      expires: { expires: 1 }, // 1 Day
    };
  },
  methods: {
    openModal(callbackFunction, toggleDownloadPopup) {
      const cookie = this.cookies.get('externalContent');
      this.callback = '';
      this.callback = callbackFunction;
      this.toggleDownloadPopup = toggleDownloadPopup;
      if (cookie === 'false') {
        $('#externalAccess').appendTo("body").modal('show');
        $('#myModal').appendTo("body").modal('show');
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
      if (this.checked) {
        this.$cookie.set('externalContent', this.checked, this.expires);
      } else if (!this.checked) {
        if (this.$cookie.get('externalContent')) {
          this.$cookie.set('externalContent', this.checked, this.expires);
        }
      }
      this.callback();
    },
    checked() {
      if (this.checked) {
        this.cookies.set('externalContent', this.checked, this.expires);
      } else if (!this.checked) {
        if (this.cookies.get('externalContent')) {
          this.cookies.set('externalContent', this.checked, this.expires);
        }
      }
    },
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  created() {
    if (this.cookies.get('externalContent') == null) {
      this.cookies.set('externalContent', false, this.expires);
    }
  },
};
</script>
<style scoped>
.modal-title {
  padding-left: 20px;
  line-height: 1.19;
}
.modal-backdrop {
  z-index: -1;
}
</style>
