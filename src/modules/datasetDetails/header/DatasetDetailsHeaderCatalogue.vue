<template>
  <div class="col-4 col-lg-3 offset-lg-1 d-flex align-items-center">
    <img v-if="showCountryFlag(getCountry)" class="mr-2 border border-dark flag" :class="{ 'io': getCountry.id === 'io' }" :src="getCountryFlagImg(getCountry.id)" alt="Catalog Flag">
    <app-link
      :to="getCatalogLink(getCatalog)"
      :title="$t('message.tooltip.datasetDetails.catalogue')"
      data-toggle="tooltip"
      data-placement="top">
      {{ getTranslationFor(getCatalog.title, $route.query.locale, getLanguages) }}
    </app-link>
  </div>
</template>

<script>
import {has, isNil} from "lodash";
import {getTranslationFor, getCountryFlagImg} from "@/modules/utils/helpers";
import {mapGetters} from "vuex";

export default {
  name: "DatasetDetailsHeaderCatalogue",
  computed: {
    ...mapGetters('datasetDetails', [
      'getCatalog',
      'getCountry',
      'getLanguages'
    ]),
  },
  methods: {
    getTranslationFor,
    getCountryFlagImg,
    showCountryFlag(country) {
      return has(country, 'id') && !isNil(country.id);
    },
    getCatalogLink(catalog) {
      return `/datasets?catalog=${catalog.id}&showcatalogdetails=true&locale=${this.$route.query.locale}`;
    }
  }
}
</script>

<style scoped lang="scss">
.flag {
  max-width: 30px;
  max-height: 19px;
}
</style>
