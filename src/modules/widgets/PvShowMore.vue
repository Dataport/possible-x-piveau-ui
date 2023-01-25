<template>
  <button class="btn show-more text-nowrap" @click="action">
    {{ label }}
    <i v-if="upArrow" class="material-icons small-icon float-right align-bottom">keyboard_arrow_up</i>
    <i v-else class="material-icons small-icon float-right align-bottom">keyboard_arrow_down</i>
  </button>
</template>

<script>
export default {
  name: "PvShowMore",
  props: {
    label: String,
    upArrow: Boolean,
    action: Function
  }
}
</script>

<style scoped>

.material-icons.small-icon {
  font-size: 20px;
}

</style>
