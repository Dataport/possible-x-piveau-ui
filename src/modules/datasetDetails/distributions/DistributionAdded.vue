<template>
  <div class="distribution-added p-3">
    <span>
      {{ date }}
    </span>
  </div>
</template>

<script>
export default {
  name: "DistributionAdded",
  props: [
    "date"
  ]
}
</script>

<style lang="scss" scoped>

.distribution-added {
  display: none;
}
</style>
