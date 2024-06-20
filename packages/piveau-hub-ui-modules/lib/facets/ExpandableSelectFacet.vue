<template>
  <!-- Component for a collapsible facet -->
  <div class="list-group col pr-0" role="group" :aria-labelledby="myTitleId" >
    <template v-if="header">
      <facet-title
        :title="header"
        :tooltip="toolTipTitle"
        :title-id="myTitleId"
      />
      <a
        class="facet-title-mobile d-flex d-md-none list-group-item justify-content-between align-items-baseline"
        data-toggle="collapse"
        :data-target="`#${myListId}`"
        @click="isExpanded = !isExpanded"
      >
        <h2 class="h5 mb-0">{{ header }}</h2>
        <button class="btn">
          <i class="material-icons small-icon expand-more animated" v-if="!isExpanded">expand_more</i>
          <i class="material-icons small-icon expand-less animated" v-else>expand_less</i>
        </button>
      </a>
    </template>

    <div
      :id="myListId"
      class="collapse dont-collapse-sm">
      <template v-if="items && items.length > 0">
        <div
          class="list-item-container"
          v-for="(item, index) in items.slice(0, numItemsAllowed)"
          :key="`field@${index}`"
        >
          <datasets-facets-item
            class="d-flex facet list-group-item list-group-item-action justify-content-between align-items-center"
            :title="getFacetTranslationWrapper(fieldId, item.id, $route.query.locale, item.title)"
            :count="getFacetCount(item)"
            :hide-count="fieldId === 'dataScope'"
            :class="{active: facetIsSelected(fieldId, item)}"
            @click.native="facetClicked(fieldId, item)"
          />
        </div>
        <button
          v-if="items.length > minItems"
          class="d-block btn btn-primary btn-color w-100 facet-expand-button"
          @click="handleGrowToggle"
        >
          <i class="material-icons align-bottom expand-more animated">{{ isGrown ? 'expand_less' : 'expand_more' }}</i>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import DatasetsFacetsItem from "../datasets/datasetsFacets/DatasetsFacetsItem.vue";
import FacetTitle from "../facets/FacetTitle.vue";

export default defineComponent({
  name: 'ExpandableSelectFacet',
  inheritAttrs: false,
  components: {FacetTitle, DatasetsFacetsItem},
  props: {
    header: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      required: true,
    },
    toolTipTitle: {
      type: String,
      default: '',
    },
    fieldId: {
      type: String,
      default: '',
    },
    getFacetTranslationWrapper: Function,
    facetIsSelected: Function,
    facetClicked: Function
  },
  data() {
    return {
      isExpanded: false,
      isGrown: false,
      numItemsAllowed: this.$env.content.datasets.facets.MIN_FACET_LIMIT || 5,
      minItems: this.$env.content.datasets.facets.MIN_FACET_LIMIT || 5,
      maxItems: this.$env.content.datasets.facets.MAX_FACET_LIMIT || 50
    };
  },
  computed: {
    myId() {
      // Use Vue generated uid to set give each facet a unique id
      return `facet-${this.fieldId}`;
    },
    myListId() {
      // Use Vue generated uid to set give each facet a unique id
      return `facet-list-${this.fieldId}`;
    },
    myTitleId() {
      // Use Vue generated uid to set give each facet a unique id
      return `facet-title-${this.fieldId}`;
    },
  },
  methods: {
    handleGrowToggle() {
      this.isGrown = !this.isGrown;
      this.numItemsAllowed = this.isGrown
        ? this.maxItems
        : this.minItems;
    },
    getFacetCount(facet) {
      if (this.fieldId === 'scoring') return '';
      return facet.count;
    }
  }
});

</script>

<style lang="scss" scoped>
.facet-header {
  // background-color: #fffade;
  // background-color: rgba(255, 204, 0, 0.1);
  background-color: rgba(0, 29, 133,0.05);
  // background-color: #cddbe8;

  // background-color: #001d85;
  // color: white !important;
}
.tooltip-icon {
  font-size: 15px;
}

@media (min-width: 768px) {
  .collapse.dont-collapse-sm {
    display: block;
    height: auto !important;
    visibility: visible;
  }
}

.list-item-container {
  margin-bottom: -1px;
}

.btn-color {
  background-color: var(--primary);
  border-color: var(--primary);

  &:hover {
    background-color: #196fd2;
    border-color: #196fd2;
  }
}
</style>
