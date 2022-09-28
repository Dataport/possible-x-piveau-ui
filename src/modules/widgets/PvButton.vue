<template>
  <button :class="`btn btn-${primary? 'primary' : 'secondary'}`" @click="action">
    {{ label }}
  </button>
</template>

<script>
export default {
  name: "PvButton",
  props: {
    primary: Boolean,
    label: String,
    action: Function
  }
}
</script>

<style scoped>

</style>
