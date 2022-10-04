<template>
  <button
    :class="`ecl-button ecl-button--${primary? 'primary' : 'secondary'}`"
    @click="onClick()"
    :title="tooltip"
  >
    {{ label }}
    <svg v-if="icon" class="ecl-icon ecl-icon--fluid ecl-button__icon ecl-button__icon--after"
         focusable="false" aria-hidden="true" data-ecl-icon="">
      <use :xlink:href="`@/assets/img/ecl/icons.svg#${icon}`"></use>
    </svg>
    <slot />
  </button>
</template>

<script>
export default {
  name: "ECButton",
  props: {
    primary: Boolean,
    label: String,
    action: Function,
    tooltip: String,
    icon: String
  },
  methods: {
    onClick() {
      if (typeof this.action === "function") this.action();
    }
  }
}
</script>

