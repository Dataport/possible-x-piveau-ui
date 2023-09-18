<template>
  <div class="settings-facet">
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
import {mapActions, mapGetters} from "vuex";

export default {
  name: "SettingsFacet",
  data() {
    const ops = this.$env.content.datasets.facets.FACET_OPERATORS;
    return {
      FACET_OPERATORS: ops,
      optionIds: [ops.and, ops.or],
      optionLabels: [
        this.i18n.global.t('message.datasetFacets.and').toUpperCase(),
        this.i18n.global.t('message.datasetFacets.or').toUpperCase()
      ],
      title: this.i18n.global.t('message.datasetFacets.settings'),
      toolTipTitle: this.i18n.global.t('message.helpIcon.settings'),
      property: this.i18n.global.t('message.datasetFacets.operator'),
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
        error => { console.error(error); }
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
