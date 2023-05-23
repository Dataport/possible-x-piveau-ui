<template>
  <table class="col-12 table table-borderless table-responsive small pl-0 mt-1 mb-0 distribution-details-table"
         v-show="!distributionIsExpanded(distribution.id)">
    <tr>
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.licence')">
          {{ $t('message.metadata.license') }}
        </tooltip>
      </td>
      <td  v-if="showObject(distribution.licence) && showLicence(distribution.licence)">
          <app-link :to="distribution.licence.resource"
                    target="_blank"
                    @click="$emit('track-link', distribution.licence.resource, 'link')">
            {{ distribution.licence.label ? distribution.licence.label : distribution.licence.resource}}
          </app-link>
          <app-link :to="distribution.licence.resource"
                    target="_blank"
                    data-toggle="tooltip"
                    data-placement="top"
                    :title="distribution.licence.description"
                    @click="$emit('track-link', distribution.licence.resource, 'link')">
            <i class="material-icons small-icon align-bottom text-dark" >info</i>
          </app-link>
          <app-link :to="distribution.licence.la_url"
                    target="_blank"
                    @click="$emit('track-link', distribution.licence.la_url, 'link')"
                    v-if="showLicensingAssistant(distribution)">
            {{ $t('message.distributionLicense.licensingAssistant') }}
          </app-link>
          <app-link :to="distribution.licence.la_url"
                    target="_blank"
                    @click="$emit('track-link', distribution.licence.la_url, 'link')"
                    v-if="showLicensingAssistant(distribution)">
            <i class="material-icons small-icon align-bottom text-dark">open_in_new</i>
          </app-link>
      </td>
      <td v-else>
        {{ $t('message.distributionLicense.notProvided') }}
      </td>
    </tr>
    <tr v-if="has(distribution, 'modificationDate') && !isNil(distribution.modificationDate)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.updated')">
          {{ $t('message.metadata.updated') }}
        </tooltip>
      </td>
      <td>{{ filterDateFormatEU(distribution.modificationDate) }}</td>
    </tr>
    <tr v-if="has(distribution, 'licenseAttributionByText') && (!isNil(distribution.licenseAttributionByText) && !isNil(getTranslationFor(distribution.licenseAttributionByText)))">
      <td class="w-25 font-weight-bold">
        <!-- <tooltip :title="$t('message.tooltip.datasetDetails.distributions.updated')"> -->
          <!-- {{ $t('message.metadata.updated') }} -->
          {{ $t('message.dataupload.distributions.licenseAttributionByText.label') }}
        <!-- </tooltip> -->
      </td>
      <td>{{ getTranslationFor(distribution.licenseAttributionByText) }}</td>
    </tr>
  </table>
</template>

<script>
import {
  has,
  isNil
} from 'lodash';
import Tooltip from "@/modules/widgets/Tooltip";
import AppLink from "@/modules/widgets/AppLink";
import { getTranslationFor } from '../../../utils/helpers';

export default {
  name: "DistributionVisibleContent",
  components: {
    AppLink,
    Tooltip
  },
  props: [
    'distribution',
    'distributionIsExpanded',
    'showObject',
    'showLicence',
    'showLicensingAssistant',
    'filterDateFormatEU'
  ],
  methods: {
    has,
    isNil,
    getTranslationFor
  }
}
</script>

<style scoped>

</style>
