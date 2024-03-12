<template>
  <div class="position-relative w-100 p-3 ">
    <input type="text" class="selectInputField formkit-inner" @click="showTable = !showTable"
      placeholder="Choose between fileupload and providing a URL">
    <ul v-if="showTable" class="selectListUpload">
      <li @click="showTable = !showTable; uploadFileSwitch = true; if (uploadURL) { uploadURL = !uploadURL }"
        class="p-2 border-b border-gray-200 data-[selected=true]:bg-blue-100 choosableItemsAC">Upload a file</li>
      <li
        @click="showTable = !showTable; uploadURL = true; if (uploadFileSwitch) { uploadFileSwitch = !uploadFileSwitch }"
        class="p-2 border-b border-gray-200 data-[selected=true]:bg-blue-100 choosableItemsAC">Provide an URL</li>
    </ul>
  </div>
  <div class="w-100 p-3 position-relative" v-if="uploadURL">
    <label class=" formkit-label w-100" for="aUrlLink">Provide an URL</label>
      <input id="aUrlLink" v-model="URLValue" class="selectInputField formkit-inner" type="url" name="@id"
        @input="saveUrl">
    
  </div>
  <div v-if="uploadFileSwitch" ref="fileupload" class="p-3 w-100" :class="`formkit-input-element formkit-input-element--${context.type}`"
    :data-type="context.type" v-bind="$attrs">
    <input type="text" v-model="context.model" @blur="context.blurHandler" hidden />
    <div class="file-div position-relative">
      <label class="formkit-label" for="aUrlFL">Upload a file</label>
      <input class="mt-3" type="file" id="aUrlFL" name="fileUpload"
        @change="uploadOrReplaceFile({ file: $event.target.files[0] })">
      <div class="upload-feedback position-absolute d-flex" style="right: 0">
        <div v-if="isLoading" class="lds-ring">
        </div>
        <div v-if="success"><i class="material-icons d-flex check-icon">check_circle</i></div>
        <div v-if="fail"><i class="material-icons d-flex close-icon">error</i></div>
      </div>
    </div>
    <p class="dURLText">{{ $t('message.metadata.downloadUrl') }}: <a class="dURLText" :href="context.model">{{ context.model }}</a></p>
  </div>
</template>
<script>
/* eslint-disable consistent-return, no-unused-vars */
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import helper from '../utils/general-helper'

export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      URLValue: '',
      uploadURL: false,
      uploadFileSwitch: false,
      showTable: false,
      isLoading: false,
      success: false,
      fail: false,
    };
  },
  computed: {
    ...mapGetters('auth', [
      'getUserData',
      'getIsEditMode'
    ]),
    ...mapGetters('dpiStore', [
      'getData',
    ]),
    getCatalogue() {
      // Need to reanable the setting of the catalog after fixing the error
      // const catalog = this.$formkit.get("catalog").context.value;
      const catalog = "dpi";
      return catalog;
    },
  },
  methods: {
    ...mapActions('dpiStore', [
      'saveLocalstorageValues',
    ]),
    async saveUrl() {
      // console.log(this.context);
      await this.context.node.input({ '@id': this.URLValue })
    },
    // finds the parent input group of a given element.
    findParentInputGroupOfElement(element) {
      // Start with the given element.
      let currentElement = element;

      // Traverse the DOM tree upwards.
      while (currentElement) {
        // If the current element is an input group, return it.
        if (currentElement.classList.contains('formkit-input-group-repeatable')) {
          return currentElement;
        }
        // If not, move to the parent element.
        currentElement = currentElement.parentElement;
      }

      // If no input group was found, return null.
      return null;
    },
    // finds the index of the distribution access URL based on the root of this component.
    findDistributionAccessUrlIndex() {
      // todo: find a more stable way to find the index of the distribution access URL.
      // this way uses the DOM tree, which is not stable.

      // Start at the root of this component.
      const rootElement = this.$refs.fileupload;

      // Find the parent input group of the root element.
      const parentInputGroup = this.findParentInputGroupOfElement(rootElement);
      if (!parentInputGroup) return null;

      // Get the parent element of all input groups.
      const parentOfAllInputGroups = parentInputGroup.parentElement;
      const allInputGroupsNodeList = parentOfAllInputGroups.querySelectorAll('.formkit-input-group-repeatable');
      const allInputGroupsArray = Array.from(allInputGroupsNodeList);

      // Find the index of the parent input group within the array of all input groups.
      const indexOfParentInputGroup = allInputGroupsArray.indexOf(parentInputGroup);

      return indexOfParentInputGroup;
    },
    async uploadOrReplaceFile({ file }) {

      const replaceEnabled = this.$env?.content?.dataProviderInterface?.enableFileUploadReplace || false;
      const wantsToReplace = this.$route.query?.edit ?? false;

      if (replaceEnabled && wantsToReplace) {
        const distributionIndexToReplace = this.$route.query?.edit;
        const fileIndexToReplace = this.findDistributionAccessUrlIndex();

        const targetDistribution = this.getData('distributions')?.[distributionIndexToReplace];
        const targetFile = targetDistribution?.['dcat:accessURL']?.[fileIndexToReplace];
        const accessUrl = targetFile?.['@id'];
        if (accessUrl) {
          const fileUploadUrl = this.$env.api.fileUploadUrl;

          const fileId = helper.getFileIdByAccessUrl({ accessUrl, fileUploadUrl })

          return await this.uploadFile(file, {
            method: 'PUT',
            url: `${this.$env.api.fileUploadUrl}data/${fileId}?catalog=${this.getCatalogue}`,
          });
        }

      }
      
      return await this.uploadFile(file);
    },
    async uploadFile(file, options = {}) {

      this.isLoading = true;

      const form = new FormData();
      form.append('file', file);

      const catalog = this.getCatalogue;
      const token = this.getUserData.rtpToken;

      const resolvedOptions = {
        method: 'POST',
        url: `${this.$env.api.fileUploadUrl}data?catalog=${catalog}`,
        ...options,
      };

      const requestOptions = {
        method: resolvedOptions.method,
        url: resolvedOptions.url,
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
        await this.context.node.input({ '@id': `${this.$env.api.fileUploadUrl}${path}` })
        // this.context.rootEmit('change');

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
.dURLText {
  font-size: 12px;
}

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
