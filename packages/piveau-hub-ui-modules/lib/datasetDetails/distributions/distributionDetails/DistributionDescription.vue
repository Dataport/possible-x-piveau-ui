<template>
  <span class="mt-2 d-block">
    <small v-if="distributionDescriptionIsExpanded(distribution.id)">
      <p class="text-muted">
        {{ getDistributionDescription(distribution) }}
        <span class="text-primary details-link pl-2" @click="toggleDistributionDescription(distribution.id)">
          {{ $t('message.metadata.readLess') }}
        </span>
      </p>
    </small>
    <small v-else-if="!distributionDescriptionIsExpandable(getDistributionDescription(distribution))">
      <p class="text-muted">{{ getDistributionDescription(distribution) }}</p>
    </small>
    <small v-else>
      <p class="text-muted">
        {{ truncate(getDistributionDescription(distribution), distributions.descriptionMaxChars) }}
        <span class="text-primary details-link pl-2" @click="toggleDistributionDescription(distribution.id)">
          {{ $t('message.metadata.readMore') }}
        </span>
      </p>
    </small>
  </span>
</template>

<script>
import { truncate} from "../../../utils/helpers";

export default {
  name: "DistributionDescription",
  props: [
    'distribution',
    'distributions',
    'distributionDescriptionIsExpanded',
    'getDistributionDescription',
    'toggleDistributionDescription',
    'distributionDescriptionIsExpandable'
  ],
  computed: {
    resolvedDistributionDescription() {
      const noDescriptionKey = 'message.catalogsAndDatasets.noDescriptionAvailable'
      const noDescriptionAvailable = this.$te(noDescriptionKey)
        ? this.$t(noDescriptionKey)
        : 'No description available'
      if (!this.distribution) return noDescriptionAvailable
      return this.getDistributionDescription(this.distribution, '') || noDescriptionAvailable
    },
  },
  methods: {
    truncate
  }
}
</script>

<style lang="scss" scoped>
  .details-link {
    cursor: pointer;

  &:hover {
     text-decoration: underline;
   }
  }
</style>
