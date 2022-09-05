<template>
  <div
    v-if="header"
    class="mb-2">
    <span class="font-weight-bold">{{ header }}</span>
    <i
      v-if="toolTipTitle"
      class="tooltip-icon material-icons small-icon align-right text-dark pl-1"
      data-toggle="tooltip"
      data-placement="right"
      :title="toolTipTitle">
      help_outline
    </i>
  </div>
</template>

<script>
export default {
  name: "ECSelectHeader",
  props: {
    header: String,
    toolTipTitle: String
  }
}
</script>

<style scoped>

.tooltip-icon {
  font-size: 15px;
}

span {
  font-family: Arial, sans-serif;
  font-size: medium;
  color: #2c2c2c;
}

</style>
