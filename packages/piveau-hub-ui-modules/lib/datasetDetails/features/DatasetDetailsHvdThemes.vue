<template>
    <div class="mt-2 flex-column dsd-feature">
      <div>
      <dataset-details-feature-header
      :title="`HVD Categories/Themes (${
            getHvdCategories ? getHvdCategories.length.toLocaleString('fi') : 0
          })`"
      :arrowDown="!isCategoriesAllDisplayed"
      tag="keywords-toggle"
      :onClick="toggleDisplayCount"
    />
      </div> 
      <div v-if="isCategoriesAllDisplayed"  class="keywords__item row mt-4">
          <span
            v-for='(category, i) in getHvdCategories'
            :key="i"
            class="col-6 col-sm-3 col-md-2 mt-md-0 mt-3 mb-2 px-1"
          >
          <app-link :to="getHvdCategoryLink(category)" :rel="followCategoryLinks">
              <small class="d-inline-block text-nowrap w-100 py-2 rounded-pill text-center text-white tag-color"
                     :data-toggle="categoryTruncated(category) ? 'tooltip' : false"
                     :data-placement="categoryTruncated(category) ? 'top' : false"
                     :aria-label="getTranslationFor(category.title, $route.query.locale)"
                     :title="categoryTruncated(category) ? getTranslationFor(category.title, $route.query.locale) : false">
                {{ truncate(getTranslationFor(category.title, $route.query.locale), maxCategoryLength, false) }}
              </small>
            </app-link>
          </span>
      </div>
      <div>
      </div>
    </div>
  </template>
  
  <script>
  import DatasetDetailsFeatureHeader from "../../datasetDetails/features/DatasetDetailsFeatureHeader";
  import {truncate} from "../../utils/helpers";
  import {mapGetters} from "vuex";
  import AppLink from "../../widgets/AppLink";
  import { getTranslationFor } from "../../utils/helpers";
  import {sortAlphabetically} from "../../datasetDetails/features/utils/sortAlphabetically";
  import $ from "jquery";
  
  
  export default {
  name: "DatasetDetailsHvdThemes",
  components: {
    AppLink,
    // DatasetDetailsFeatureHeader
  },
  props: {

  },
  data() {
    return {
      defaultLocale: this.$env.languages.locale,
      defaultDisplayCount: 0,
      hvdCategories: {
        displayAll: false,
        displayCount: 24, // Should never exceed number of keywords
        incrementSteps: [12, 60],
      },
      maxCategoryLength: 15,
      followCategoryLinks: this.$env.content.datasets.followCategoryLinks
    }
  },
  computed: {
    ...mapGetters('datasetDetails', [
        "getHvdCategories"
    ]),
    isCategoriesAllDisplayed() {
      // return this.categories.displayCount >= this.getCategories.length;
      return this.hvdCategories.displayAll;
    }
  },
  methods: {
    truncate,
    sortAlphabetically,
    getTranslationFor,
    categoryTruncated(category) {
      return getTranslationFor(category.title, this.defaultLocale).length > this.maxCategoryLength;
    },
    getHvdCategoryLink(category) {
        const categoryID = category.id;
        return {
          path: `/datasets`,
          query: Object.assign({}, { hvdCategory: categoryID, locale: this.$route.query.locale })
        };
      },
    toggleDisplayCount() {
      $('body').tooltip({selector: '[data-toggle="tooltip"]'});
      if (this.hvdCategories.displayCount < this.getHvdCategories.length) {
        this.hvdCategories.displayCount = this.getHvdCategories.length;
      } else {
        this.hvdCategories.displayCount = this.defaultDisplayCount;
      }
      this.hvdCategories.displayAll = !this.hvdCategories.displayAll;
    }
  }
  }
  </script>
  
  <style scoped lang="scss">
  .tag-color {
    background-color: var(--primary);
  }
  </style>
  