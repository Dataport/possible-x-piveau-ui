<template>
  <div class="list-group">
    <e-c-facet-header
      v-if="title"
      :title="title"
      :tooltip="toolTipTitle"
    />
    <div class="value-display list-group-item d-flex justify-content-between align-items-center">
      {{ property }}
      <span class="ml-2 d-flex flex-wrap">
        <div class="custom-control custom-radio" v-for="(id, index) in optionIds">
          <input type="radio" :id="id" :name="title" class="custom-control-input" @click="onChange(id)" :checked="option === id">
          <label class="custom-control-label" :for="id">{{ optionLabels[index] }}</label>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import FacetTitle from "@/modules/facets/FacetTitle";
import ECFacetHeader from "@/components/ECFacetHeader";
export default {
  name: "ECRadioFacet",
  components: {ECFacetHeader, FacetTitle},
  props: {
    title: String,
    toolTipTitle: String,
    property: String,
    initialOption: String,
    optionIds: Array,
    optionLabels: Array,
    change: Function
  },
  data() {
    return {
      option: this.initialOption
    };
  },
  computed: {
    myId() {
      // Use Vue generated uid to set give each facet a unique id
      return `facet-${this.id}`;
    }
  },
  methods: {
    onChange(id) {
      this.option = id;
      this.change(id);
    }
  },
  mounted() {
    // this.id = this.myId; // eslint-disable-line
    this.id = this._uid; // eslint-disable-line
  },
}
</script>

<style scoped lang="scss">

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

.list-group {
  width: 100%;
}

.value-display {
  width: 100%;
  min-height: 48px;
  border-color: #2c2c2c;
  border-radius: 0 !important;
  padding: 8px;
  &:focus {
    border-width: 3px;
  }
  &:hover {
    border-color: var(--primary);
    .ecl-select__icon {
      background: var(--primary);
    }
  }
}

</style>
