<template>
  <div class="text-break">
    <span class="font-weight-bold"
          :title="tooltip"
          data-toggle="tooltip"
          data-placement="top">
          {{ property }}:
    </span>
    <dataset-date
      v-if="isDate"
      :date="value"
    />
    <span v-else>
      {{ value }}
    </span>
  </div>
</template>

<script>
import DatasetDate from "@/modules/datasets/DatasetDate";
export default {
  name: "PropertyValue",
  components: {DatasetDate},
  props: {
    property: String,
    value: [String, Number],
    tooltip: String,
    isDate: Boolean
  }
}
</script>

<style scoped>

</style>
