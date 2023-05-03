<template>
  <div :class="`formulate-input-element formulate-input-element--${context.type}`" :data-type="context.type" v-on="$listeners">
    <input type="text" v-model="context.model" @blur="context.blurHandler" hidden/>
    <div class="file-div position-relative">
      <input type="file" @change="uploadFile($event.target.files[0])">
      <div class="upload-feedback position-absolute d-flex" style="right: 0">
        <div v-if="isLoading" class="lds-ring"><div></div><div></div><div></div><div></div></div>
        <div v-if="success"><i class="material-icons d-flex check-icon">check_circle</i></div>
        <div v-if="fail"><i class="material-icons d-flex close-icon">error</i></div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable consistent-return, no-unused-vars */
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      success: false,
      fail: false,
    };
  },
  computed: {
    ...mapGetters('auth', [
      'getUserData',
    ]),
    ...mapGetters('dpiStore', [
      'getData',
    ]),
    getCatalogue() {
      const catalog = this.getData('datasets')['dct:catalog'];
      return catalog;
    },
  },
  methods: {
    ...mapActions('dpiStore', [
      'saveLocalstorageValues',
    ]),
    async uploadFile(file) {
      this.isLoading = true;

      const form = new FormData();
      form.append('file', file);

      const catalog = this.getCatalogue;
      const token = this.getUserData.rtpToken;

      const requestOptions = {
        method: 'POST',
        url: `${this.$env.api.fileUploadUrl}data?catalog=${catalog}`,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        data: form,
      };

      try {
        const result = await axios.request(requestOptions);
        const path = result.data.result.location.substring(result.data.result.location.indexOf('/') + 1);
        this.context.model = `${this.$env.api.fileUploadUrl}${path}`;
        this.isLoading = false;
        this.success = true;
        this.context.rootEmit('change');
      } catch (err) {
        this.isLoading = false;
        this.fail = true;
        console.error(err); // eslint-disable-line
      }
    },
  },
  mounted() {
    this.saveLocalstorageValues('datasets');
  }
};
</script>

<style lang="scss" scoped>
// @import '../../../styles/bootstrap_theme';
// @import '../../../styles/utils/css-animations';

.file-div {
  display: flex;
  align-items: center;
}

.upload-feedback {
  padding: 10px;
}

  /*** MATERIAL ICONS ***/
  %modal-icon {
    font-size: 20px;
    cursor: default;
  }

  .check-icon {
    @extend %modal-icon;
    color: #28a745;
  }

  .close-icon {
    @extend %modal-icon;
    color: red;
  }
  .lds-ring {
  display: inline-block;
  position: relative;
  width: 30px;
  height: 30px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  right: 0;
  width: 30px;
  height: 30px;
  border: 8px solid lightgray;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: lightgray transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
