<template>
  <table class="col-12 table table-borderless table-responsive small pl-0 mt-2 mb-1" v-show="distributionIsExpanded(distribution.id)">
    <tr>
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.licence')">
          {{ $t('message.metadata.license') }}
        </tooltip>
      </td>
      <td v-if="showObject(distribution.licence) && showLicence(distribution.licence)">
        <app-link :to="distribution.licence.resource"
                  target="_blank"
                  @click="$emit('track-link', distribution.licence.resource, 'link')">
          {{ distribution.licence.label }}
        </app-link>
        <app-link :to="distribution.licence.resource"
                  target="_blank"
                  data-toggle="tooltip"
                  data-placement="top"
                  :title="distribution.licence.description"
                  @click="$emit('track-link', distribution.licence.resource, 'link')">
          <i class="material-icons small-icon align-bottom text-dark">info</i>
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
    <tr v-if="has(distribution, 'releaseDate') && !isNil(distribution.releaseDate)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.created')">
          {{ $t('message.metadata.created') }}
        </tooltip>
      </td>
      <td>
        {{ filterDateFormatEU(distribution.releaseDate) }}
      </td>
    </tr>
    <tr v-if="has(distribution, 'languages') && showArray(distribution.languages)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.language')">
          {{ $t('message.metadata.languages') }}
        </tooltip>
      <td>
        <div v-for="(language, i) of distribution.languages.map(lang => lang.label)" :key="i">
          <span>{{ language }}</span>
        </div>
      </td>
    </tr>
    <tr v-if="has(distribution, 'availability') && showObject(distribution.availability) && !isNil(distribution.availability.label)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.availability')">
          {{ $t('message.metadata.availability') }}
        </tooltip>
      </td>
      <td>{{ distribution.availability.label }}</td>
    </tr>
    <tr v-if="has(distribution, 'status') && showObject(distribution.status)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.status')">
          {{ $t('message.metadata.status') }}
        </tooltip>
      </td>
      <td>
        <div v-if="!isNil(distribution.status.label)">
          {{ distribution.status.label }}
        </div>
      </td>
    </tr>
    <tr v-if="has(distribution, 'rights') && showObject(distribution.rights)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.rights')">
          {{ $t('message.datasetDetails.quality.rightsAvailability') }}
        </tooltip>
      </td>
      <td>
        <!-- if wen want to show label AND resource!
        <div v-for="(right, i) in distribution.rights" :key="i">
          <span>{{ truncate(right, 75) }}</span>
        </div>
        -->
        <div>{{ distribution.rights.label }}</div>
      </td>
    </tr>
    <tr v-if="has(distribution, 'mediaType') && !isNil(distribution.mediaType)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.mediaType')">
          {{ $t('message.metadata.mediaType') }}
        </tooltip>
      </td>
      <td>{{ distribution.mediaType }}</td>
    </tr>
    <tr v-if="has(distribution, 'byteSize') && !isNil(distribution.byteSize)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.byteSize')">
          {{ $t('message.metadata.byteSize') }}
        </tooltip>
      </td>
      <td>{{ distribution.byteSize }}</td>
    </tr>
    <tr v-if="has(distribution, 'checksum') && !isNil(distribution.checksum) && has(distribution.checksum, 'algorithm') && !isNil(distribution.checksum.algorithm) && has(distribution.checksum, 'checksum_value') && !isNil(distribution.checksum.checksum_value)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.checksum')">
          {{ $t('message.metadata.checksum') }}
        </tooltip>
      </td>
      <td>
        <div>{{ distribution.checksum.algorithm }}</div>
        <div>{{ distribution.checksum.checksum_value }}</div>
      </td>
    </tr>
    <tr v-if="has(distribution, 'pages') && showObjectArray(distribution.pages)">
      <td class="w-25 font-weight-bold">{{ $t('message.metadata.pages') }}</td>
      <td>
        <div v-for="(page, i) of distribution.pages" :key="i">
          <app-link :to="page.resource">{{ truncate(page.resource, 75) }}</app-link>
        </div>
      </td>
    </tr>
    <tr v-if="has(distribution, 'type') && showObject(distribution.type)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.type')">
          {{ $t('message.metadata.type') }}
        </tooltip>
      </td>
      <td>
        <div v-if="!isNil(distribution.type.label)">
          {{ distribution.type.label }}
        </div>
      </td>
    </tr>
    <tr v-if="has(distribution, 'compressFormat') && !isNil(distribution.compressFormat)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.compressFormat')">
          {{ $t('message.metadata.compressFormat') }}
        </tooltip>
      </td>
      <td>
        <div>
          {{ distribution.compressFormat }}
        </div>
      </td>
    </tr>
    <tr v-if="has(distribution, 'packageFormat') && !isNil(distribution.packageFormat)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.packageFormat')">
          {{ $t('message.metadata.packageFormat') }}
        </tooltip>
      </td>
      <td>
        <div>
          {{ distribution.packageFormat }}
        </div>
      </td>
    </tr>
    <tr v-if="has(distribution, 'hasPolicy') && !isNil(distribution.hasPolicy)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.distributions.hasPolicy')">
          {{ $t('message.metadata.hasPolicy') }}
        </tooltip>
      </td>
      <td>
        <div>
          <a :href="appendCurrentLocaleToURL(distribution.hasPolicy)">{{ truncate(distribution.hasPolicy, 75) }}</a>
        </div>
      </td>
    </tr>
    <tr v-if="has(distribution, 'conformsTo') && showObjectArray(distribution.conformsTo)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.conformsTo')">
          {{ $t('message.metadata.conformsTo') }}
        </tooltip>
      </td>
      <td>
        <div v-for="(conformTo, i) in distribution.conformsTo" :key="i">
          <div v-if="has(conformTo, 'label') && !isNil(conformTo.label)">
            {{ $t('message.metadata.label') }}:
            {{ conformTo.label }}
          </div>
          <div v-if="has(conformTo, 'resource') && !isNil(conformTo.resource)">
            {{ $t('message.metadata.resource') }}:
            <app-link :to="conformTo.resource"
                      target="_blank"
                      @click="$emit('track-link', conformTo.resource, 'link')">
              {{ truncate(conformTo.resource, 75) }}
            </app-link>
          </div>
        </div>
      </td>
    </tr>
    <tr v-if="has(distribution, 'spatialResolutionInMeters') && showArray(distribution.spatialResolutionInMeters)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.spatialResolutionInMeters')">
          {{ $t('message.metadata.spatialResolutionInMeters.label') }}
        </tooltip>
      </td>
      <td>
        <div v-if="showNumber(distribution.spatialResolutionInMeters[0])">
          {{ $t('message.metadata.spatialResolutionInMeters.value', {number: distribution.spatialResolutionInMeters[0]}) }}
        </div>
      </td>
    </tr>
    <tr v-if="has(distribution, 'temporalResolution') && showArray(distribution.temporalResolution)">
      <td class="w-25 font-weight-bold">
        <tooltip :title="$t('message.tooltip.datasetDetails.temporalResolution')">
          {{ $t('message.metadata.temporalResolution') }}
        </tooltip>
      </td>
      <td>
        <div v-for="(temporalResolution, i) of distribution.temporalResolution" :key="i">
          {{ temporalResolution }}
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
import {
  has,
  isNil
} from 'lodash';
import { truncate } from '../../utils/helpers';
import AppLink from "@/modules/widgets/AppLink";
import Tooltip from "@/modules/widgets/Tooltip";
export default {
  name: "DistributionExpandedContent",
  components: { Tooltip, AppLink },
  props: [
    'distribution',
    'distributionIsExpanded',
    'showLicensingAssistant',
    'showLicence',
    'filterDateFormatEU',
    'showArray',
    'showNumber',
    'showObject',
    'showObjectArray',
    'appendCurrentLocaleToURL'
  ],
  methods: {
    has,
    isNil,
    truncate
  }
}
</script>

<style scoped>

</style>
