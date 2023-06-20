<template>
  <div class="distribution-added pl-2">
    <span>
     {{ date }}
    </span>
  </div>
</template>

<script>

export default {
  name: "DistributionAdded",
  props: [
    'date',
  ],
}
</script>

<style lang="scss" scoped>
</style>
