<template>
  <div class="facet-container user-select-none">
    <div class="mb-2 font-weight-bold facet-header"><span class="font-weight-bold">{{ header }}</span></div>
    <div>
      <div @click="showOptions"
           @keydown.esc="away"
           @keydown.enter="showOptions"
           class="value-display list-group-item col w-100 d-flex flex-row justify-content-between p-0 align-items-center"
           type="button"
           tabindex="0"
           ref="value-display"
           aria-haspopup="true"
           aria-expanded="false">
        <span data-toggle="tooltip"
              data-placement="center"
              class="ml-2">
          {{ header }}
        </span>
        <div class="ecl-select__icon">
          <svg class="ecl-icon ecl-icon--s ecl-icon--rotate-180 ecl-select__icon-shape" focusable="false" aria-hidden="true">
            <use xlink:href="../assets/img/ecl/icons.svg#corner-arrow"></use>
          </svg>
        </div>
      </div>
      <div v-if="open" v-on-clickaway="away" class="dropdown w-100">
        <div v-for="(item, index) in items" :key="`field@${index}`" class="select-row">
          <e-c-checkbox
            :id="`${fieldId}_${itemTitles[index]}`"
            :label="itemTitles[index]"
            :label-right="item.count"
            :checked="facetIsSelected(fieldId, item)"
            :onClick="() => facetClicked(fieldId, item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {getFacetTranslation} from "@/modules/utils/helpers";
import { mixin as clickaway } from 'vue-clickaway';
import Dropdown from "@/modules/widgets/Dropdown";
import ECCheckbox from "@/components/ECCheckbox";

export default {
  name: "ECMultiSelectFacet",
  components: {ECCheckbox, Dropdown},
  mixins: [clickaway],
  props: {
    header: {
      type: String,
      default: '',
    },
    fieldId: {
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
    facetIsSelected: Function,
    facetClicked: Function
  },
  data() {
    return {
      open: false,
      id: null,
      isExpanded: false,
      isGrown: false
    };
  },
  computed: {
    myId() {
      // Use Vue generated uid to set give each facet a unique id
      return `facet-${this.id}`;
    },
    itemTitles() {
      return this.items.map(this.getTitle);
    }
  },
  methods: {
    getFacetTranslation,
    getTitle(item) {
      return Vue.i18n.te(`message.datasetFacets.facets.datascopeField.${item.id}`) ?
        Vue.i18n.t(`message.datasetFacets.facets.datascopeField.${item.id}`)
        : this.getFacetTranslationWrapper(this.fieldId, item.id, this.$route.query.locale, item.title);
    },
    getFacetTranslationWrapper(fieldId, facetId, userLocale, fallback) {
      return fieldId === 'scoring'
        ? `${Vue.i18n.t(`message.datasetFacets.facets.scoring.${facetId}`)}${facetId === 'sufficientScoring' || facetId === 'goodScoring' ? '+' : ''}`
        : this.getFacetTranslation(fieldId, facetId, userLocale, fallback);
    },
    away() {
      this.open = false;
    },
    showOptions() {
      this.open = true;
      this.$refs["value-display"].focus();
    }
  },
  mounted() {
    this.id = this._uid; // eslint-disable-line
  }
}
</script>

<style lang="scss" scoped>

.select-row {
 padding: 16px;
  &:hover {
    background-color: #e3e3e3;
  }
}

.highlighted-row {
  background-color: #e3e3e3;
}

.ecl-select__icon {
  height: 100%;
}

.value-display {
  height: 48px;
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

.facet-container {
  padding: 0;
  font-family: Arial, sans-serif;
}

.facet-header > span {
  font-size: medium;
  color: #2c2c2c;
}

.tooltip-icon {
  font-size: 15px;
}


.btn-color {
  background-color: var(--primary);
  border-color: var(--primary);

  &:hover {
    background-color: #196fd2;
    border-color: #196fd2;
  }
}

//.dropdown {
//  background:#f8f9fa;
//  padding: 6px;
//  border: 1px solid #ccc;
//  max-height: 300px;
//  overflow: auto;
//  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px;
//}

.dropdown {
  background: #f5f5f5;
  border: 1px solid #e3e3e3;
  max-height: 300px;
  overflow: auto;
  //box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px;
  //padding: 6px;
}

.value-display {
  border-color: #2c2c2c;
}

</style>
