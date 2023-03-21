<template>
  <!-- HEADER -->
  <div class="dsd-header">
    <dataset-details-header-title />
    <div class="d-flex offset-lg-1 col-lg-10 mt-1 px-0 flex-nowrap justify-content-between dsd-header-info">
      <dataset-details-header-catalogue class="mr-2"/>
      <property-value
        v-if="!hidePublisher && showObject(getPublisher)"
        :property="$t('message.metadata.publisher')"
        :tooltip="$t('message.tooltip.datasetDetails.publisher')"
        :value="getPublisherName"
        class="mr-2"
      />
      <property-value
        v-if="!hideDate"
        :property="$t('message.metadata.updated')"
        :tooltip="$t('message.tooltip.datasetDetails.updated')"
        :value="getModificationDate"
        :isDate="true"
      />
    </div>
  </div>
</template>

<script>
  // import Actions and Getters from Store Module
  import { mapGetters } from 'vuex';
  // import helper functions
  import { has, isNil, isObject } from 'lodash-es';

  import AppLink from '../../widgets/AppLink.vue';
  import DatasetDate from '../../datasets/DatasetDate.vue';
  import * as helpers from '../../utils/helpers';
  import dateFilters from '../../filters/dateFilters';
  import DatasetDetailsHeaderTitle from "@/modules/datasetDetails/header/DatasetDetailsHeaderTitle";
  import DatasetDetailsHeaderCatalogue
    from "@/modules/datasetDetails/header/DatasetDetailsHeaderCatalogue";
  import PropertyValue from "@/modules/widgets/PropertyValue";
  const { getTranslationFor, getCountryFlagImg, truncate } = helpers;

  export default {
    name: 'datasetDetailsHeader',
    components: {
      PropertyValue,
      DatasetDetailsHeaderCatalogue,
      DatasetDetailsHeaderTitle,
      DatasetDate,
      AppLink,
    },
    dependencies: 'DatasetService',
    data() {
      return {
        hidePublisher: this.$env.content.datasetDetails.header.hidePublisher,
        hideDate: this.$env.content.datasetDetails.header.hideDate,
      };
    },
    computed: {
      // import store-getters
      ...mapGetters('datasetDetails', [
        'getCatalog',
        'getCountry',
        'getLanguages',
        'getPublisher',
        'getModificationDate'
      ]),
      getPublisherName() {
        if (has(this.getPublisher, 'name') && !isNil(this.getPublisher.name)) {
          return this.getPublisher.name;
        } else {
          return "";
        }
      }
    },
    methods: {
      has,
      isNil,
      isObject,
      truncate,
      getTranslationFor,
      getCountryFlagImg,
      filterDateFormatUS(date) {
        return dateFilters.formatUS(date);
      },
      filterDateFormatEU(date) {
        return dateFilters.formatEU(date);
      },
      showObject(object) {
        return !isNil(object) && isObject(object) && !Object.values(object).reduce((keyUndefined, currentValue) => keyUndefined && currentValue === undefined, true);
      },
      filterDateFromNow(date) {
        return dateFilters.fromNow(date);
      }
    },
  };
</script>

