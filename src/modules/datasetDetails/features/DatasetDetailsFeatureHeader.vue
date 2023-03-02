<template>
  <div class="d-flex w-100 heading">
    <div class="col-1 my-auto text-right arrow dsd-feature-header-arrow-container"
         @click="onClick()">
        <i class="material-icons dsd-feature-header-arrow">{{ arrowDown ? "keyboard_arrow_down" : "keyboard_arrow_up" }}</i>
    </div>
    <div class="col-11 py-2">
      <span class="dsd-feature-title"
          :data-cy="tag"
          @click="onClick()">{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "DatasetDetailsFeatureHeader",
  props: {
    onClick: Function,
    title: String,
    tag: String,
    arrowDown: Boolean
  }
}
</script>

<style lang="scss" scoped>
.heading {
  cursor: pointer;
}
.arrow {
  padding-right: 0;
}
@media screen and (max-width: 991px) {
  .dsd-feature-header-arrow-container {
    width: 48px !important;
    order: 2;
    padding-right: 15px;
  }
}
</style>
