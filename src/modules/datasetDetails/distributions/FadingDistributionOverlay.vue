<template>
  <div
    class="distributions__item--preview"
  >
    <!-- Fade out the last item so it has a preview feel -->
    <!-- Render actions on top of it -->
    <div class="distributions__actions pb-md-3">
      <circle
        v-for="increment in distributions.incrementSteps.filter(nonOverflowingIncrementsForDistributions)"
        :key="increment"
        class="btn btn-sm btn-secondary mr-1"
        @click="increaseNumDisplayedDistributions(increment)"
      >
        <i class="fas fa-chevron-down"/> {{ $t('message.metadata.showXMore', { increment }) }}
      </circle>
      <button
        class="btn btn-sm btn-primary"
        @click="distributions.displayCount = getDistributions.length"
      >
        <i class="fas fa-eye"/> {{ $t('message.metadata.showAll') }} {{ getDistributions.length.toLocaleString('fi') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "FadingDistributionOverlay",
  props: [
    'distributions',
    'increaseNumDisplayedDistributions',
    'nonOverflowingIncrementsForDistributions',
    'getDistributions'
  ]
}
</script>

<style scoped>

</style>
