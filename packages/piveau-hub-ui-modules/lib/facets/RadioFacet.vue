<template>
  <div class="list-group w-100 radio-facet" role="group" :aria-labelledby="myTitleId">
    <facet-title
      :title="title"
      :tooltip="toolTipTitle"
      :title-id="myTitleId"
    />
    <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
      {{ property }}
      <span class="ml-2 d-flex flex-wrap">
        <div class="custom-control custom-radio" v-for="(id, index) in optionIds">
          <input type="radio" :id="`${title}_${id}`" :value="id" :name="title" class="custom-control-input" @click="onChange(id)" :checked="option === id">
          <label class="custom-control-label" :for="`${title}_${id}`">{{ optionLabels[index] }}</label>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import FacetTitle from "../facets/FacetTitle.vue";
export default {
  name: "RadioFacet",
  components: {FacetTitle},
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
      id: '',
      option: this.initialOption
    };
  },
  computed: {
    myId() {
      // Use Vue generated uid to give each facet a unique id
      return `facet-${this.id}`;
    },
    myTitleId() {
      // Use Vue generated uid to give each facet a unique id
      return `facet-title-${this.id}`;
    }
  },
  methods: {
    onChange(id) {
      this.option = id;
      this.change(id);
    }
  },
  watch: {
    initialOption(value) {
      this.option = value;
    }
  },
  mounted() {
    this.id = this._uid; // eslint-disable-line
  },
}
</script>

<style scoped lang="scss">
</style>
