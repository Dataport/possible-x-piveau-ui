<template>
    <div class="row mt-2 flex-column dsd-feature">
      <div >
      <dataset-details-feature-header
      :title="'Keywords '+'(' + getKeywords.length + ')'"
      :arrowDown="!isKeywordsAllDisplayed"
      tag="keywords-toggle"
      :onClick="toggleDisplayCount"
    />
      </div>
      <div v-if="isKeywordsAllDisplayed" class="keywords__item row mt-4">
          <span
            v-for='(keyword, i) in displayedKeywords'
            :key="i"
            class="col-6 col-sm-3 col-md-2 mt-md-0 mt-3 mb-2 px-1"
          >
          <app-link v-if="showKeyword(keyword) && isKeywordsAllDisplayed" :to="getKeywordLink(keyword)" :rel="followKeywordLinks">
              <small class="d-inline-block text-nowrap w-100 py-2 rounded-pill text-center text-white tag-color"
                     :data-toggle="keywordTruncated(keyword) ? 'tooltip' : false"
                     :data-placement="keywordTruncated(keyword) ? 'top' : false"
                     :aria-label="keyword.title"
                     :title="keywordTruncated(keyword) ? keyword.title : false">
                {{ truncate(keyword.title, maxKeywordLength, false) }}
              </small>
            </app-link>
          </span>
      </div>
      <div>
      </div>
<!--      <div>-->
<!--        <div-->
<!--          v-if="!keywords.displayAll && !isKeywordsAllDisplayed"-->
<!--          class="keywords__item"-->
<!--        >-->
<!--          <div-->
<!--            class="keywords__actions pb-md-3"-->
<!--          >-->
<!--            <button-->
<!--              v-for="increment in keywords.incrementSteps.filter(nonOverflowingIncrementsForKeywords)"-->
<!--              :key="increment"-->
<!--              class="btn btn-sm btn-secondary mr-1"-->
<!--              @click="increaseNumDisplayedKeywords(increment)"-->
<!--            >-->
<!--              <i class="fas fa-chevron-down"/> {{ $t('message.metadata.showXMore', { increment }) }}-->
<!--            </button>-->
<!--            <button-->
<!--              class="btn btn-sm btn-primary"-->
<!--              @click="keywords.displayCount = getKeywords.length"-->
<!--            >-->
<!--              <i class="fas fa-eye"/> {{ $t('message.metadata.showAll') }} {{ getKeywords.length.toLocaleString('fi') }}-->
<!--            </button>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div> -->
    </div>
</template>

<script>
import DatasetDetailsFeatureHeader from "@/modules/datasetDetails/features/DatasetDetailsFeatureHeader";
import {truncate} from "@/modules/utils/helpers";
import {mapGetters} from "vuex";
import {has, isString} from "lodash";
import AppLink from "@/modules/widgets/AppLink";
import {sortAlphabetically} from "@/modules/datasetDetails/features/utils/sortAlphabetically";
import $ from "jquery";


export default {
  name: "DatasetDetailsKeywords",
  components: {AppLink,DatasetDetailsFeatureHeader},
  props: {
    showKeyword: Function,
  },
  data() {
    return {
      defaultLocale: this.$env.languages.locale,
      showTitle: this.$env.content.datasetDetails.keywords.showTitle,
      defaultDisplayCount: 0,
      keywords: {
        displayAll: this.$env.content.datasetDetails.keywords.collapsed ? this.$env.content.datasetDetails.keywords.collapsed : false,
        displayCount: 24, // Should never exceed number of keywords
        incrementSteps: [12, 60],
      },
      maxKeywordLength: this.$env.content.datasets.maxKeywordLength,
      followKeywordLinks: this.$env.content.datasets.followKeywordLinks
    }
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getKeywords'
    ]),
    displayedKeywords() {
      return this.keywords.displayAll
        ? Object.freeze(this.sortedKeywords)
        : Object.freeze(this.sortedKeywords.slice(0, this.keywords.displayCount));
    },
    isKeywordsAllDisplayed() {
      return this.keywords.displayAll;
    },
    remainingKeywords() {
      return this.getKeywords.length - this.keywords.displayCount;
    },
    sortedKeywords() {
      let selected = [], fallback = [], other = {}, without = []; // eslint-disable-line
      const selectedLanguage = this.$route.query.locale;
      const fallbackLanguage = this.defaultLocale;
      // Sort by language
      this.getKeywords.forEach(k => has(k, 'language') && isString(k.language)
        ? (k.language === selectedLanguage
          ? selected.push(k)
          : k.language === fallbackLanguage
            ? fallback.push(k)
            : has(other, k.language)
              ? other[k.language].push(k)
              : other[k.language] = [k])
        : without.push(k));
      // Sort alphabetically
      this.sortAlphabetically(selected, 'title', selectedLanguage);
      this.sortAlphabetically(fallback, 'title', fallbackLanguage);
      Object.keys(other).forEach(key => this.sortAlphabetically(other[key], 'title', selectedLanguage || fallbackLanguage));
      other = Object.keys(other).sort().reduce((arr, el) => arr.concat(other[el]), []);
      this.sortAlphabetically(without, 'title', selectedLanguage || fallbackLanguage);
      // Return sorted keywords by language order
      return selected
        .concat(fallback)
        .concat(other)
        .concat(without);
    }
  },
  methods: {
    truncate,
    sortAlphabetically,
    // Increases the current number of keywords displayed
    // and clamps the result so that it never exceeds the number of all keywords.
    increaseNumDisplayedKeywords(increment) {
      const clampedSum = this.clamp(this.keywords.displayCount + increment, 0, this.getKeywords.length);
      this.keywords.displayCount = clampedSum;
    },
    nonOverflowingIncrementsForKeywords(incrementStep) {
      return this.keywords.displayCount + incrementStep <= this.getKeywords.length;
    },
    keywordTruncated(keyword) {
      return keyword.title.length > this.maxKeywordLength;
    },
    clamp(n, min, max) {
      return Math.min(Math.max(n, min), max);
    },
    getKeywordLink(keyword) {
      return { path: `/datasets?keywords=${keyword.id}`, query: Object.assign({}, { locale: this.$route.query.locale }) };
    },
    toggleDisplayCount() {
    this.keywords.displayAll = !this.keywords.displayAll;
    $('body').tooltip({selector: '[data-toggle="tooltip"]'});
    }
  }
}
</script>

<style scoped lang="scss">
.tag-color {
  background-color: var(--tag-color);
}
.keywords__item > div {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
</style>
