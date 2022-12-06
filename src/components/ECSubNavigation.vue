<template>
  <nav class="col-12 navbar navbar-expand-lg navbar-light px-4 pb-3 mt-0 sub-navigation">
    <div class="col d-flex d-md-none justify-content-end flex-wrap">
      <button class="btn btn-primary mb-3 text-right text-white" data-toggle="collapse" data-target="#datasetFacets"
              data-cy="btn-filter-toggle" @click="filterCollapsed = !filterCollapsed">
        {{ $t('message.datasetFacets.title') }}
        <i class="material-icons small-icon align-bottom" v-if="filterCollapsed">arrow_drop_up</i>
        <i class="material-icons small-icon align-bottom" v-else>arrow_drop_down</i>
      </button>
    </div>
<!--    <button class="navbar-toggler px-1" type="button" data-toggle="collapse" data-target="#subNavigation" aria-controls="subNavigation" aria-expanded="false" aria-label="Toggle navigation">-->
<!--      <span class="navbar-toggler-icon"></span>-->
<!--    </button>-->
    <h1 class="d-inline-block d-lg-none col-10 col-md-11 title mb-0 text-break">{{ title }}</h1>
    <div class="col-12 collapse navbar-collapse px-0" id="subNavigation">
      <slot/>
    </div>
  </nav>
</template>

<script>
import $ from "jquery";

export default {
  name: "ECSubNavigation",
  props: {
    to: {
      default: '',
      required: false,
    },
    title: {
      type: String,
      default: '',
      required: false,
    },
  },
  computed: {
  },
  methods: {
  },
  beforeDestroy() {
    $('.tooltip').remove();
  },
}
</script>

<style scoped>
.sub-navigation {
  background-color: white !important;
  box-shadow: 0 2px 4px -4px grey;
  min-height: 56px;
}

.title {
  font-size: 1.5rem;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.2;
  color: inherit;
}

</style>
