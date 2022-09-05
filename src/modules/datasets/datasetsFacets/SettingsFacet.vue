<template>
  <div>
    <radio-facet
      :title="title"
      :toolTipTitle="toolTipTitle"
      :property="property"
      :initialOption="getFacetOperator"
      :optionIds="optionIds"
      :optionLabels="optionLabels"
      :change="change"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import {mapActions, mapGetters} from "vuex";

export default {
  name: "SettingsFacet",
  data() {
    const ops = this.$env.datasets.facets.FACET_OPERATORS;
    return {
      FACET_OPERATORS: ops,
      optionIds: [ops.and, ops.or],
      optionLabels: [
        Vue.i18n.t('message.datasetFacets.and').toUpperCase(),
        Vue.i18n.t('message.datasetFacets.or').toUpperCase()
      ],
      title: Vue.i18n.t('message.datasetFacets.settings'),
      toolTipTitle: Vue.i18n.t('message.helpIcon.settings'),
      property: Vue.i18n.t('message.datasetFacets.operator'),
    };
  },
  computed: {
    ...mapGetters('datasets', [
      'getFacetOperator'
    ])
  },
  methods: {
    ...mapActions('datasets', [
      'setFacetOperator',
      'setFacetGroupOperator'
    ]),
    changeFacetOperator(op) {
      this.setFacetOperator(op);
      this.setFacetGroupOperator(op);
      this.$router.replace(
        { query: Object.assign({}, this.$route.query, { facetOperator: op }) }
      ).catch(
        error => { console.log(error); }
      );
    },
    change(op) {
      if (op !== this.getFacetOperator) {
        this.changeFacetOperator(op);
      }
    },
  }
}
</script>

<style scoped lang="scss">

</style>
