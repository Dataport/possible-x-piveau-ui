<template>
  <div class="ecl-message ecl-message--info" data-ecl-message="" role="alert"><svg
    class="ecl-icon ecl-icon--l ecl-message__icon" focusable="false" aria-hidden="true">
    <use xlink:href="@/assets/img/ecl/icons.svg#information"></use>
  </svg>
    <div class="ecl-message__content">
      <button class="ecl-button ecl-button--ghost ecl-message__close" type="button" data-ecl-message-close="">
        <span class="ecl-button__container">
          <span class="ecl-button__label" data-ecl-label="true">Close</span>
          <svg class="ecl-icon ecl-icon--xs ecl-button__icon ecl-button__icon--after" focusable="false" aria-hidden="true" data-ecl-icon="">
            <use xlink:href="@/assets/img/ecl/icons.svg#close-filled"></use>
          </svg>
        </span>
      </button>
      <div v-if="title" class="ecl-message__title">{{ title }}</div>
      <div class="ecl-message__description">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ECInfo",
  props: {
    title: String,
    message: String
  }
}
</script>

<style scoped>

</style>
