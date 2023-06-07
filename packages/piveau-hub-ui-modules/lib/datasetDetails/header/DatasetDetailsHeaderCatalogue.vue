<template>
  <div class="d-flex align-items-center dsd-header-catalogue">
    <div class="d-lg-none dsd-title-tag">
      <span>
        {{$t('message.metadata.dataset')}}
      </span>
    </div>
    <div>
      <img v-if="showCountryFlag(getCountry)" class="mr-2 border border-dark flag" :class="{ 'io': getCountry.id === 'io' }" :src="getCountryFlagImg(getCountry.id)" alt="Catalog Flag">
      <app-link
        :to="getCatalogLink(getCatalog)"
        :title="$t('message.tooltip.datasetDetails.catalogue')"
        data-toggle="tooltip"
        data-placement="top">
        {{ getTranslationFor(getCatalog.title, $route.query.locale, getLanguages) }}
      </app-link>
    </div>
  </div>
</template>

<script>
import {has, isNil} from "lodash";
import {getTranslationFor, getCountryFlagImg} from "../../utils/helpers";
import {mapGetters} from "vuex";
import AppLink from "../../widgets/AppLink";

export default {
  name: "DatasetDetailsHeaderCatalogue",
  components: {AppLink},
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
      return { name: 'CatalogueDetails', params: { ctlg_id: catalog?.id }, query: { locale: this.$route.query.locale } };
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
