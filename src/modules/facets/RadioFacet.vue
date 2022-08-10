<template>
  <div class="list-group">
    <div class="d-none d-md-block list-group-item facet-header">
      <h2 class="h5 mb-0 float-left">{{ header }}</h2>
      <i class="tooltip-icon material-icons small-icon align-right text-dark pl-1"
         data-toggle="tooltip"
         data-placement="right"
         :title="toolTipTitle">
        help_outline
      </i>
    </div>
    <div class="form-group list-group-item list-group-item-action d-flex justify-content-between align-items-center">
      {{ property }}
      <span class="ml-2 d-flex flex-wrap">
        <div class="custom-control custom-radio" v-for="(id, index) in optionIds">
          <input type="radio" :id="id" name="radio-facet-operator" class="custom-control-input" @click="onChange(index)" :checked="option === index">
          <label class="custom-control-label" :for="id">{{ optionLabels[index] }}</label>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "RadioFacet",
  props: {
    header: String,
    toolTipTitle: String,
    property: String,
    initialOption: Number,
    optionIds: Array,
    optionLabels: Array,
    change: Function
  },
  data() {
    return {
      option: this.initialOption
    };
  },
  methods: {
    onChange(index) {
      this.option = index;
      this.change(index);
    }
  }
}
</script>

<style scoped lang="scss">
.facet-header {
  background-color: rgba(0, 29, 133,0.05);
}

.tooltip-icon {
  font-size: 15px;
}

.custom-control {
  padding-left: 1.5rem;
  margin-right: 1rem;
}
.custom-control-label {
  &::before {
    left: -1.5rem !important;
  }
  &::after {
    left: -1.5rem !important;
  }
}
.custom-control-input:checked ~ .custom-control-label::before {
  border-color: var(--primary);
  background-color: var(--primary);
}
</style>
