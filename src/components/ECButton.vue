<template>
  <button :class="`ecl-button ecl-button--${primary? 'primary' : 'secondary'}`" @click="action()">
    {{ label }}
  </button>
</template>

<script>
export default {
  name: "ECButton",
  props: {
    primary: Boolean,
    label: String,
    action: Function
  }
}
</script>

