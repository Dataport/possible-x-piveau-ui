<template>
  <distribution-dropdown-download
       :distribution="distribution"
       :title="$t('message.tooltip.datasetDetails.distributions.download')"
       :message="$t('message.datasetDetails.download')"
       :isOnlyOneUrl="isOnlyOneUrl(distribution)"
       :getDownloadUrl="getDownloadUrl"
       @trackGoto="trackGoto"
       bgLight="true"
  >
    <span class="dropdown-item px-3 d-flex justify-content-end align-items-center"
        v-if="showAccessUrls(distribution)">
      <app-link class="text-dark text-decoration-none"
                :to="replaceHttp(distribution.accessUrl[0])"
                target="_blank"
                rel="dcat:distribution noopener"
                matomo-track-download
                @after-click="$emit('trackGoto')">
        <small class="px-2" property="dcat:mediaType" :content="getDistributionFormat">accessURL</small>
        <i class="material-icons align-bottom">open_in_new</i>
      </app-link>
      <i class="copy-text material-icons float-right align-bottom" @click="setClipboard(distribution.accessUrl[0])">file_copy</i>
      <i class="material-icons help-icon ml-3" data-toggle="tooltip" data-placement="bottom" :title="$t('message.datasetDetails.accessURLTooltip')">help_outline</i>
    </span>
    <span class="dropdown-item d-block px-3 d-flex justify-content-end align-items-center"
      v-for="(downloadURL, i) in distribution.downloadUrls"
      :key="i">
        <app-link class="text-dark text-decoration-none"
                  :to="replaceHttp(downloadURL)"
                  target="_blank"
                  matomo-track-download
                  @after-click="$emit('trackGoto')">
          <small class="px-2" property="dcat:mediaType">downloadURL</small>
          <i class="material-icons align-bottom">open_in_new</i>
        </app-link>
        <i class="copy-text material-icons float-right align-bottom" @click="setClipboard(downloadURL)">file_copy</i>
        <i class="material-icons help-icon ml-3" data-toggle="tooltip" data-placement="bottom" :title="$t('message.datasetDetails.downloadURLTooltip')">help_outline</i>
    </span>
  </distribution-dropdown-download>
</template>

<script>
import DistributionDropdownDownload from "@/modules/datasetDetails/distributions/distributionActions/DistributionDropdownDownload";
import AppLink from "@/modules/widgets/AppLink";

export default {
  name: "DistributionDownload",
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

  .help-icon {
    @extend %modal-icon;
  }

  .copy-text {
    cursor: pointer;
  }
</style>
