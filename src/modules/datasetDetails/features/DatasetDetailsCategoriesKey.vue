<template>
  <div class="row mt-2 flex-column dsd-feature">
    <div>
    <dataset-details-feature-header
    :title="`${$t('message.datasetDetails.subnav.categories')} (${
          getCategories ? getCategories.length.toLocaleString('fi') : 0
        })`"
    :arrowDown="!isCategoriesAllDisplayed"
    tag="keywords-toggle"
    :onClick="toggleDisplayCount"
  />
    </div>
    <div v-if="isCategoriesAllDisplayed"  class="keywords__item row mt-4">
        <span
          v-for='(category, i) in getCategories'
          :key="i"
          class="col-6 col-sm-3 col-md-2 mt-md-0 mt-3 mb-2 px-1"
        >
        <app-link :to="getCategoryLink(category)" :rel="followCategoryLinks">
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
// DatasetDetailsFeatureHeader is imported globally
// import DatasetDetailsFeatureHeader from "@/modules/datasetDetails/features/DatasetDetailsFeatureHeader";
import {truncate} from "@/modules/utils/helpers";
import {mapGetters} from "vuex";
import AppLink from "@/modules/widgets/AppLink";
import { getTranslationFor } from "@/modules/utils/helpers";
import {sortAlphabetically} from "@/modules/datasetDetails/features/utils/sortAlphabetically";
import $ from "jquery";


export default {
name: "DatasetDetailsCategoriesKey",
components: {
  AppLink,
  // DatasetDetailsFeatureHeader
},
props: {
  showCategory: Function
},
data() {
  return {
    defaultLocale: this.$env.languages.locale,
    defaultDisplayCount: 0,
    categories: {
      displayAll: this.$env.content.datasetDetails.categoriesKey.collapsed,
      displayCount: 24, // Should never exceed number of keywords
      incrementSteps: [12, 60],
    },
    maxCategoryLength: 15,
    followCategoryLinks: this.$env.content.datasets.followCategoryLinks
  }
},
computed: {
  ...mapGetters('datasetDetails', [
      "getCategories"
  ]),
  isCategoriesAllDisplayed() {
    // return this.categories.displayCount >= this.getCategories.length;
    return this.categories.displayAll;
  }
},
methods: {
  truncate,
  sortAlphabetically,
  // Increases the current number of keywords displayed
  // and clamps the result so that it never exceeds the number of all keywords.
  increaseNumDisplayedKeywords(increment) {
    const clampedSum = this.clamp(this.categories.displayCount + increment, 0, this.getCategories.length);
    this.categories.displayCount = clampedSum;
  },
  getTranslationFor,
  nonOverflowingIncrementsForKeywords(incrementStep) {
    return this.categories.displayCount + incrementStep <= this.getCategories.length;
  },
  categoryTruncated(category) {

    return getTranslationFor(category.title, this.defaultLocale).length > this.maxCategoryLength;

  },
  clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  },
  getCategoryLink(category) {
      const categoryID = category.id.toUpperCase();
      return {
        path: `/datasets?categories=${categoryID}`,
        query: Object.assign({}, { locale: this.$route.query.locale }),
      };
    },
  toggleDisplayCount() {
    $('body').tooltip({selector: '[data-toggle="tooltip"]'});
    if (this.categories.displayCount < this.getCategories.length) {
      this.categories.displayCount = this.getCategories.length;
    } else {
      this.categories.displayCount = this.defaultDisplayCount;
    }
    this.categories.displayAll = !this.categories.displayAll;
  }
}
}
</script>

<style scoped lang="scss">
.tag-color {
  background-color: var(--primary);
}
</style>
