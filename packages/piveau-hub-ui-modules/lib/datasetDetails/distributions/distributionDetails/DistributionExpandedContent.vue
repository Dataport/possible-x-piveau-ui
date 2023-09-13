<template>
  <DistributionContent
    v-show="distributionIsExpanded(distribution.id)"
    class="distribution-expanded-content"
    :contentList="contentList"
    :distribution="distribution"
    :distributionIsExpanded="distributionIsExpanded"
    :showLicensingAssistant="showLicensingAssistant"
    :showLicence="showLicence"
    :filterDateFormatEU="filterDateFormatEU"
    :showArray="showArray"
    :showNumber="showNumber"
    :showObject="showObject"
    :showObjectArray="showObjectArray"
    :appendCurrentLocaleToURL="appendCurrentLocaleToURL"
  />
</template>

<script>
import {
  has,
  isNil
} from 'lodash';
import {mapGetters} from "vuex";
import { truncate, formatDatetime, getTranslationFor } from '../../../utils/helpers';
import AppLink from "../../../widgets/AppLink.vue";
import Tooltip from "../../../widgets/Tooltip.vue";
import DistributionContent from './DistributionContent.vue';
export default {
  name: "DistributionExpandedContent",
  components: { Tooltip, AppLink, DistributionContent },
  props: [
    'contentList',
    'distribution',
    'distributionIsExpanded',
    'showLicensingAssistant',
    'showLicence',
    'filterDateFormatEU',
    'showArray',
    'showNumber',
    'showObject',
    'showObjectArray',
    'appendCurrentLocaleToURL',
  ],
  computed: {
    ...mapGetters('datasetDetails', [
      'getID'
    ]),
  },
  methods: {
    has,
    isNil,
    truncate,
    formatDatetime,
    getTranslationFor
  },
}
</script>

<style scoped>

</style>
