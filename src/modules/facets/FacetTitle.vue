<template>
  <div class="d-none d-md-block list-group-item facet-title">
    <h2 class="h5 mb-0 float-left">{{ title }}</h2>
    <i class="tooltip-icon material-icons small-icon align-right text-dark pl-1"
       ref="tooltip-icon"
       data-toggle="tooltip"
       data-placement="right"
       :title="tooltip">
      help_outline
    </i>
  </div>
</template>

<script>

export default {
  name: "FacetTitle",
  props: {
    title: String,
    tooltip: String
  }
}
</script>

<style scoped lang="scss">
.facet-title {
  background-color: rgba(0, 29, 133,0.05);
}

.tooltip-icon {
  font-size: 15px;
}
</style>
