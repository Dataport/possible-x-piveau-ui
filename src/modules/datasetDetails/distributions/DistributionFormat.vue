<template>
  <div class="d-inline-block col-2 col-md-1 pl-1 p-md-3 px-md-4 m-md-0 m-auto">
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

<style scoped lang="scss">
  .circle {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    padding: 20px 0;
    font-size: 12px;
    line-height: 1px;
    border-radius: 50%;
    background-color: #595959;
  &[type="HTML"] {
     background-color: #285C76;
   }
  &[type="JSON"] {
     background-color: var(--dark-orange);
   }
  &[type="XML"] {
     background-color: #8F4300;
   }
  &[type="TXT"] {
     background-color: #2B5E73;
   }
  &[type="CSV"] {
     background-color: var(--badge-green);
   }
  &[type="XLS"] {
     background-color: #1A6537;
   }
  &[type="ZIP"] {
     background-color: #252525;
   }
  &[type="API"] {
     background-color: #923560;
   }
  &[type="PDF"] {
     background-color: #B30519;
   }
  &[type="SHP"] {
     background-color: var(--badge-black);
   }
  &[type="RDF"],
  &[type="NQUAD"],
  &[type="NTRIPLES"],
  &[type="TURTLE"] {
     background-color: #0b4498;
   }
  }
</style>
