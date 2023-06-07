<template>
      <span
        class="d-inline-block"
        data-toggle="tooltip"
        data-placement="left"
        :title="toolTipTitle"
      >
        <slot></slot>
      </span>
</template>

<script>
  export default {
    name: 'Tooltip',
    props: {
      toolTipTitle: {
        type: String,
      },
      placement: {
        type: String,
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
