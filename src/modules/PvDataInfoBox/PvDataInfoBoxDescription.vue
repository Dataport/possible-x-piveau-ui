<template>
  <div>
    <p
      v-if="description"
      class="dataset-info-box-description m-0"
    >
      {{
        descriptionMaxLength
          ? truncatedDescription
          : description
      }}
    </p>
    <span v-else>
      <p class="text-muted font-italic m-0" data-cy="dataset-description">
        {{ $t("message.catalogsAndDatasets.noDescriptionAvailable") }}
      </p>
    </span>
  </div>
</template>

<script>
import { truncate } from '../utils/helpers';

export default {
  props: {
    description: {
      type: String,
      default: null,
    },
    descriptionMaxLength: {
      type: Number,
      default: null,
    },
  },

  computed: {
    truncatedDescription() {
      return this.descriptionMaxLength && truncate(this.description, this.descriptionMaxLength);
    },
  }
};
</script>
