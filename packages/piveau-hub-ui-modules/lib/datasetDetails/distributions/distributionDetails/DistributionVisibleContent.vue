<template>
  <DistributionContent
    v-show="!distributionIsExpanded(distribution.id)"
    class="distribution-visible-content"
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
import Tooltip from "../../../widgets/Tooltip.vue";
import AppLink from "../../../widgets/AppLink.vue";
import DistributionContent from './DistributionContent.vue';
import { getTranslationFor } from '../../../utils/helpers';

export default {
  name: "DistributionVisibleContent",
  components: {
    AppLink,
    Tooltip,
    DistributionContent
  },
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
  methods: {
    has,
    isNil,
    getTranslationFor
  }
}
</script>

<style scoped>

</style>
