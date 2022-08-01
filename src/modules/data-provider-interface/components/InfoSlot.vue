<template>
  <label :for="context.id">
    <span class="form-label">{{ context.label }}</span>
    <a v-if="info" class="infoButton"><i class="material-icons" :title="info"
      data-toggle="tooltip"
      data-placement="top">info</i>
    </a>
  </label>
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
    info: {
      type: [String, Boolean],
      default: false,
    },
  },
};
</script>

<style scoped>
.infoButton{
  border-radius: 5px;
  cursor: pointer;
}

.infoButton .material-icons {
  font-size: 20px;
  vertical-align: text-bottom;
  margin-left: 5px;
  margin-bottom: 1px;
}

.form-label {
  font-size: 20px;
}
</style>
