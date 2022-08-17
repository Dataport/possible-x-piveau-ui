<template>
  <div class="text-right" v-if="distributionCanShowMore(distribution)" @click="toggleDistribution(distribution.id)">
    <small class="arrow" v-if="distributionIsExpanded(distribution.id)">
      {{ $t('message.metadata.showLess') }}
      <i class="material-icons align-middle small-icon">keyboard_arrow_up</i>
    </small>
    <small class="arrow" v-else>
      {{ $t('message.metadata.showMore') }}
      <i class="material-icons align-middle small-icon">keyboard_arrow_down</i>
    </small>
  </div>
</template>

<script>
export default {
  name: "DistributionExpand",
  props: [
    'distribution',
    'distributionCanShowMore',
    'toggleDistribution',
    'distributionIsExpanded'
  ]
}
</script>

<style scoped>
  div, .arrow {
    cursor: pointer;
  }
</style>

