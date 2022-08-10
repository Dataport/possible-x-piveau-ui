<template>
  <radio-facet
    :header="$t('message.datasetFacets.settings')"
    :toolTipTitle="$t('message.helpIcon.settings')"
    :property="$t('message.datasetFacets.operator')"
    :initialOption="getOption"
    :optionIds="optionIds"
    :optionLabels="optionLabels"
    :change="change"
  />
<!--  <div class="row facet-field mb-3">-->
<!--    <facet-->
<!--      :header="$t('message.datasetFacets.settings')"-->
<!--      :toolTipTitle="$t('message.helpIcon.settings')"-->
<!--      :items="[]"-->
<!--      class="col pr-0"-->
<!--    >-->
<!--      <template #after>-->
<!--        <div class="form-group list-group-item list-group-item-action d-flex justify-content-between align-items-center">-->
<!--          {{ $t('message.datasetFacets.operator') }}-->
<!--          <span class="ml-2 d-flex flex-wrap">-->
<!--            <div class="custom-control custom-radio">-->
<!--              <input type="radio" id="radio-and" name="radio-facet-operator" class="custom-control-input" @click="changeFacetOperator(FACET_OPERATORS.and)" :checked="getFacetOperator === FACET_OPERATORS.and">-->
<!--              <label class="custom-control-label" for="radio-and">{{ $t('message.datasetFacets.and') }}</label>-->
<!--            </div>-->
<!--            <div class="custom-control custom-radio">-->
<!--              <input type="radio" class="custom-control-input" id="radio-or" name="radio-facet-operator" @click="changeFacetOperator(FACET_OPERATORS.or)" :checked="getFacetOperator === FACET_OPERATORS.or">-->
<!--              <label class="custom-control-label" for="radio-or">{{ $t('message.datasetFacets.or').toUpperCase() }}</label>-->
<!--            </div>-->
<!--          </span>-->
<!--        </div>-->
<!--      </template>-->
<!--    </facet>-->
<!--  </div>-->
</template>

<script>
import Vue from 'vue';
import {mapActions, mapGetters} from "vuex";
import RadioFacet from "@/modules/facets/RadioFacet";

export default {
  name: "SettingsFacet",
  components: {RadioFacet},
  data() {
    return {
      FACET_OPERATORS: this.$env.datasets.facets.FACET_OPERATORS,
      optionIds: ["radio-and", "radio-or"],
      optionLabels: [
        Vue.i18n.t('message.datasetFacets.and').toUpperCase(),
        Vue.i18n.t('message.datasetFacets.or').toUpperCase()
      ],
    };
  },
  computed: {
    ...mapGetters('datasets', [
      'getFacetOperator'
    ]),
    getOption() {
      return this.getFacetOperator === this.FACET_OPERATORS.and ? 0 : 1;
    }
  },
  methods: {
    ...mapActions('datasets', [
      'setFacetOperator',
      'setFacetGroupOperator'
    ]),
    changeFacetOperator(op) {
      this.setFacetOperator(op);
      this.setFacetGroupOperator(op);
    },
    change(index) {
      this.changeFacetOperator(index === 0 ? this.FACET_OPERATORS.and : this.FACET_OPERATORS.or)
    }
  },
  watch: {
    getFacetOperator(facetOperator) {
      this.$router.replace(
        { query: Object.assign({}, this.$route.query, { facetOperator }) }
      ).catch(
        error => { console.log(error); }
      );
    }
  }
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
</style>
