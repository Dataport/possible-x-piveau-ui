<template>
  <div class="d-flex flex-row align-items-center col-12 col-lg-10 offset-lg-1 mb-3 px-0 dsd-header-title">
    <div v-if="isErpdActive()" class="d-none d-lg-block dsd-title-tag erpdInfo">
      <span>{{$t('message.metadata.protecteddata')}}</span>
    </div>
    <div v-else class="d-none d-lg-block dsd-title-tag">
      <span  :style="{ fontSize: titleFontSize }">
        {{$t('message.metadata.dataset')}}

      </span>
    </div>
    <h1 class="d-none d-lg-block dataset-details-title" data-cy="dataset-title">{{ getTranslationFor(getTitle, $route.query.locale, getLanguages) }}</h1>
  </div>
</template>

<script>
import {getTranslationFor} from "../../utils/helpers";
import {mapGetters} from "vuex";

export default {
  name: "DatasetDetailsHeaderTitle",
  props: {
    titleFontSize: String,
  },
  methods: {
    getTranslationFor,
    isErpdActive() {
      // console.log(this.getLanguages);
      return this.getCatalog.is_part_of  === 'erpd';
    },
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getLanguages',
      'getTitle',
      'getCatalog',

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
.erpdInfo{
  background-color: #8f4300 !important;
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
