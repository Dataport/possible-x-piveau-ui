<template>
  <button
    :class="`ecl-button ecl-button--${primary? 'primary' : 'secondary'}`"
    @click="onClick()"
    :title="tooltip"
  >
    {{ label }}
  </button>
</template>

<script>
export default {
  name: "ECButton",
  props: {
    primary: Boolean,
    label: String,
    action: Function,
    tooltip: String
  },
  methods: {
    onClick() {
      if (typeof this.action === "function") this.action();
    }
  }
}
</script>

