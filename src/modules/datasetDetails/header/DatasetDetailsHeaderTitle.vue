<template>
  <div class="d-flex flex-row align-items-center col-12 col-lg-10 offset-lg-1 mb-3 px-0 dsd-header-title">
    <div class="dsd-title-tag">
      <span>
        Dataset
      </span>
    </div>
    <h1 class="d-none d-lg-block dataset-details-title" data-cy="dataset-title">{{ getTranslationFor(getTitle, $route.query.locale, getLanguages) }}</h1>
  </div>
</template>

<script>
import {getTranslationFor} from "@/modules/utils/helpers";
import {mapGetters} from "vuex";

export default {
  name: "DatasetDetailsHeaderTitle",
  methods: {
    getTranslationFor
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getLanguages',
      'getTitle',
    ]),
  }
}
</script>

<style scoped lang="scss">
.dataset-details-title {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.2;
  color: inherit;
}
@media (min-width: 768px) {
  .dataset-details-title {
    font-size: 1.5rem;
  }
}

@media (min-width: 992px) {
  .dataset-details-title {
    font-size: 1.75rem;
  }
}

.dsd-title-tag {
  display: none;
  //background: #6292FA;
  background-color: steelblue;
  font-size: smaller;
  color: white;
  font-weight: bold;
  padding: 0.2rem 1.5rem;
  margin-right: 1rem;
  margin-bottom: 0.4rem;
}

</style>
