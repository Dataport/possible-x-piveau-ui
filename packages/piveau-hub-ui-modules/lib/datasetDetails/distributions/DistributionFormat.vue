<template>
  <div class="d-inline-block col-2 col-md-1 pl-1 p-md-3 px-md-4 m-auto distribution-format">
    <div class="circle float-md-right text-center text-white mt-1"
         :type="getDistributionFormat(distribution)"
         :data-toggle="distributionFormatTruncated(distribution) ? 'tooltip' : false"
         :data-placement="distributionFormatTruncated(distribution) ? 'top' : false"
         :title="distributionFormatTruncated(distribution) ? getDistributionFormat(distribution) : false">
      <span :style="{ fontSize: embed ? '0.75rem' : '' }">{{ truncate(getDistributionFormat(distribution), 10, true) }}</span>
    </div>
  </div>
</template>

<script>
import { truncate } from '../../utils/helpers';
export default {
  name: "DistributionFormat",
  props: [
    'distribution',
    'getDistributionFormat',
    'distributionFormatTruncated',
    'embed'
  ],
  methods: {
    truncate
  }
}
</script>
 
