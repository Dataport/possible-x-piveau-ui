<template>
  <div class="d-flex w-100 heading">
    <div class="col-1 my-auto text-right arrow"
         @click="onClick()">
      <span class="text-dark">
        <i class="material-icons dsd-feature-header-arrow">{{ arrowDown ? "keyboard_arrow_down" : "keyboard_arrow_up" }}</i>
      </span>
    </div>
    <div class="col-11 py-2 bg-white">
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
  .arrow {
    order: 2;
    padding-right: 15px;
  }
}
</style>
