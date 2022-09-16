<template>
  <!-- HEADER -->
  <div>
    <dataset-details-header-title />
    <div class="row mt-1">
      <dataset-details-header-catalogue />
      <div class="col-4 text-break" v-if="showObject(getPublisher)">
          <span class="font-weight-bold"
                :title="$t('message.tooltip.datasetDetails.publisher')"
                data-toggle="tooltip"
                data-placement="top">
                {{ $t('message.metadata.publisher')}}:
          </span>
          <span v-if="has(getPublisher, 'name') && !isNil(getPublisher.name)">
              {{ getPublisher.name }}
            </span>
        </div>
      <div class="col-4 text-right text-break">
        <span class="font-weight-bold mx-1"
          :title="$t('message.tooltip.datasetDetails.updated')"
              data-toggle="tooltip"
              data-placement="top">
              {{ $t('message.metadata.updated') }}:</span>
          <dataset-date :date="getModificationDate"/>
      </div>
    </div>
    <hr>
  </div>
</template>

<script>
  // import Actions and Getters from Store Module
  import { mapGetters } from 'vuex';
  // import helper functions
  import { has, isNil, isObject } from 'lodash';

  import AppLink from '../../widgets/AppLink.vue';
  import DatasetDate from '../../datasets/DatasetDate.vue';
  import * as helpers from '../../utils/helpers';
  import dateFilters from '../../filters/dateFilters';
  import DatasetDetailsHeaderTitle from "@/modules/datasetDetails/header/DatasetDetailsHeaderTitle";
  import DatasetDetailsHeaderCatalogue
    from "@/modules/datasetDetails/header/DatasetDetailsHeaderCatalogue";
  const { getTranslationFor, getCountryFlagImg, truncate } = helpers;

  export default {
    name: 'datasetDetailsDataset',
    components: {
      DatasetDetailsHeaderCatalogue,
      DatasetDetailsHeaderTitle,
      DatasetDate,
      AppLink,
    },
    dependencies: 'DatasetService',
    data() {
      return {};
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

