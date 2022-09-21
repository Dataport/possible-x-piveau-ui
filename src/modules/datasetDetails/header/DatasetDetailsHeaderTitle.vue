<template>
  <div class="col-12 col-lg-10 offset-lg-1">
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
</style>
