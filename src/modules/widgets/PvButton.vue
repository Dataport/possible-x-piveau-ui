<template>
  <button :class="`btn btn-${primary? 'primary' : 'secondary'} ${small? 'btn-sm' : ''} ${rounded? 'rounded-lg' : ''}`" @click="action">
    {{ label }}
    <slot />
  </button>
</template>

<script>
export default {
  name: "PvButton",
  props: {
    primary: Boolean,
    label: String,
    action: {
      type: Function,
      default: () => {}
    },
    small: Boolean,
    rounded: Boolean
  }
}
</script>

<style scoped>

</style>
