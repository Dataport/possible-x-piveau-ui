<template>
  <distribution-dropdown-download :distribution="distribution"
    :title="$t('message.tooltip.datasetDetails.distributions.download')" :message="$t('message.datasetDetails.download')"
    :isOnlyOneUrl="isOnlyOneUrl(distribution)" :getDownloadUrl="getDownloadUrl" @trackGoto="trackGoto" bgLight="true">

    <span class="dropdown-item px-3 d-flex align-items-center d-block" v-if="showAccessUrls(distribution)">
      <app-link class="text-decoration-none d-flex justify-content-between access-uri-link"
        :to="replaceHttp(distribution.accessUrl[0])" target="_blank" rel="dcat:distribution noopener"
        :matomo-track-download="{ format: distribution?.format?.id }" @after-click="$emit('trackGoto')">
        <span>
          <i class="material-icons align-bottom">open_in_new</i>
          <!-- <i class=" copy-text material-icons align-bottom" @click="setClipboard(distribution.accessUrl[0])">file_copy</i> copy -->
        </span>
        <!-- <span>
          <small class="px-2" property="dcat:mediaType" :content="getDistributionFormat">Access URL</small>
        </span> -->
      </app-link>

      <span>
        <!-- <i class="material-icons align-bottom">open_in_new</i> down -->
        <i class="copy-text material-icons align-bottom" @click="setClipboard(distribution.accessUrl[0])">file_copy</i>
      </span>

      <app-link class="text-decoration-none d-flex justify-content-between access-uri-link"
        :to="replaceHttp(distribution.accessUrl[0])" target="_blank" rel="dcat:distribution noopener"
        :matomo-track-download="{ format: distribution?.format?.id }" @after-click="$emit('trackGoto')">
        <span>
          <small class="px-2" property="dcat:mediaType" :content="getDistributionFormat">{{
            $t('message.metadata.accessUrl') }}</small>
        </span>
      </app-link>
      <!-- <i class="material-icons help-icon ml-3" data-toggle="tooltip" data-placement="bottom" :title="$t('message.datasetDetails.accessURLTooltip')">help_outline</i> -->
    </span>

    <span :class="(showUrlCopiedPopup) ? 'display' : 'hide'" class="copy-url-popup">
       <i class="material-icons align-bottom">done_all</i> URL copied
    </span>

    <span class="dropdown-item d-block px-3 d-flex align-items-center"
      v-for="(downloadURL, i) in distribution.downloadUrls" :key="i">
      <app-link class="text-decoration-none d-flex justify-content-between" :to="replaceHttp(downloadURL)" target="_blank"
        :matomo-track-download="{ format: distribution?.format?.id }" @after-click="$emit('trackGoto')">
        <span>
          <i class="material-icons align-bottom">open_in_new</i>
          <!-- <i class=" copy-text material-icons align-bottom" @click="setClipboard(downloadURL)">file_copy</i> -->
        </span>
        <!-- <span>
            <small class="px-2" property="dcat:mediaType">Download URL</small>
          </span> -->
      </app-link>
      <span>
        <!-- <i class="material-icons align-bottom">open_in_new</i> -->
        <i class="copy-text material-icons align-bottom" @click="setClipboard(downloadURL)">file_copy</i>
      </span>
      <span>
        <small class="px-2" property="dcat:mediaType">{{ $t('message.metadata.downloadUrl') }}</small>
      </span>
      <!-- <i class="material-icons help-icon ml-3" data-toggle="tooltip" data-placement="bottom" :title="$t('message.datasetDetails.downloadURLTooltip')">help_outline</i> -->
    </span>

    <distribution-download-as v-if="this.$env.content.datasetDetails.downloadAs.enable" :distribution="distribution" />
  </distribution-dropdown-download>
</template>

<script>
import DistributionDropdownDownload from "../../../datasetDetails/distributions/distributionActions/DistributionDropdownDownload";
import DistributionDownloadAs from "../../../datasetDetails/distributions/distributionActions/DistributionDownloadAs";
import AppLink from "../../../widgets/AppLink";

export default {
  name: "DistributionDownload",
  data() {
    return {
      showUrlCopiedPopup: false
    }
  },
  props: [
    "getDownloadUrl",
    "showAccessUrls",
    "isOnlyOneUrl",
    "trackGoto",
    "replaceHttp",
    "getDistributionFormat",
    "distribution"
  ],
  components: {
    DistributionDropdownDownload,
    DistributionDownloadAs,
    AppLink
  },
  methods: {
    setClipboard(value) {
      const input = document.createElement('INPUT');
      // input.style = "position: absolute; left: -1000px; top: -1000px";
      input.value = value;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);

      this.popupCopyUrlAlert()
    },
    popupCopyUrlAlert() {
      this.showUrlCopiedPopup = true
      setTimeout(function () {
        this.showUrlCopiedPopup = false
      }.bind(this), 3500)
    }
  }
}
</script>

<style scoped lang="scss">
/*** MATERIAL ICONS ***/
%modal-icon {
  font-size: 18px;
  cursor: default;
}

.dropdown-item {
  .access-uri-link,
  .copy-text {
    color: #0e47cb;
  }
}

.help-icon {
  @extend %modal-icon;
}

.copy-text {
  cursor: pointer;
}

.copy-url-popup {
  position: fixed !important;
  bottom: 10vh;
  left: 50vw;
  background-color: #F3F6FC;
  padding: .5rem 1.5rem;
  border-radius: .25rem;
}

.copy-url-popup.display {
  display: block;
}

.copy-url-popup.hide {
  display: none;
}
</style>
