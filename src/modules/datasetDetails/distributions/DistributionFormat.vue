<template>
  <div class="d-inline-block col-2 col-md-1 pl-1 p-md-3 px-md-4 m-md-0 m-auto distribution-format">
    <div class="circle float-md-right text-center text-white"
         :type="getDistributionFormat(distribution)"
         :data-toggle="distributionFormatTruncated(distribution) ? 'tooltip' : false"
         :data-placement="distributionFormatTruncated(distribution) ? 'top' : false"
         :title="distributionFormatTruncated(distribution) ? getDistributionFormat(distribution) : false">
      <span>{{ truncate(getDistributionFormat(distribution), 4, true) }}</span>
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
  ],
  methods: {
    truncate
  }
}
</script>

