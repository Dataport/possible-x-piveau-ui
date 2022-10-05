<template>
  <div
    class="distributions__item--preview"
  >
    <!-- Fade out the last item so it has a preview feel -->
    <!-- Render actions on top of it -->
    <div class="distributions__actions pb-md-3">
      <button
        v-for="increment in distributions.incrementSteps.filter(nonOverflowingIncrementsForDistributions)"
        :key="increment"
        class="btn btn-sm btn-secondary mr-1"
        @click="increaseNumDisplayedDistributions(increment)"
      >
        <i class="fas fa-chevron-down"/> {{ $t('message.metadata.showXMore', { increment }) }}
      </button>
      <button
        class="btn btn-sm btn-primary"
        @click="setDistributionsDisplayCount(getDistributions.length)"
      >
        <i class="fas fa-eye"/> {{ $t('message.metadata.showAll') }} {{ getDistributions.length.toLocaleString('fi') }}
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "FadingDistributionOverlay",
  props: {
    distributions: Object,
    setDistributionsDisplayCount: Function,
    increaseNumDisplayedDistributions: Function,
    nonOverflowingIncrementsForDistributions: Function
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getDistributions'
    ])
  }
}
</script>

<style lang="scss" scoped>

.distributions {

  &__item--preview {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, white 55%);
    z-index: 10;
  }

  &__actions {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100%;
    z-index: 11;
  }
}
</style>
