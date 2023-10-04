<template>
  <div class="distribution-added pl-2">
    <span v-if="date">
     {{ date }}
    </span>
    <div v-else type="UNKNOWN" data-toggle="tooltip" data-placement="top" title="" class="unknown" data-original-title="UNKNOWN">
      <span>UNKNOWN</span>
    </div>
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
.unknown {
    align-self: flex-start;
    padding: 0.25em 0.4em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    border-radius: 0;
    background-color: #595959;
    color:white;
    margin-top: 0.25rem;
}
</style>
