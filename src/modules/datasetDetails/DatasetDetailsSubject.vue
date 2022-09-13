<template>
  <div class="row mt-4">
    <div class="row">
      <div class="col-12 col-lg-11 offset-lg-1">
        <div class="keywords__item row" id="keywordsItemsDiv">
            <span
              v-for='(subject, i) in displayedSubject'
              :key="i"
              class="col-6 col-sm-3 col-md-2 mt-md-0 mt-3 mb-2 mx-0 px-1"
            >
            <span v-if="showSubject(subject)">
                <small v-if="typeof (subject.title) === 'object'" class="d-inline-block w-100 py-2 rounded-pill text-center text-white subjectBg">
                  <span v-for="(value, key) in subject.title" :key="key">
                    <tooltip :title="value"  data-placement="top">
                      {{ truncate(value, maxSubjectLength, false) }}
                    </tooltip>
                  </span>
                </small>
                <small v-else-if="typeof (subject.title) === 'string'" class="d-inline-block w-100 py-2 rounded-pill text-center text-white subjectBg">
                  <span>
                    <tooltip :title="subject.title"  data-placement="top">
                      {{ truncate(subject.title, maxSubjectLength, false) }}
                    </tooltip>
                  </span>
                </small>
            </span>
              </span>
        </div>
      </div>
      <div>
        <div
          v-if="!subject.displayAll && !isSubjectAllDisplayed"
          class="keywords__item"
        >
          <div
            class="keywords__actions pb-md-3"
          >
            <button
              v-for="increment in subject.incrementSteps.filter(nonOverflowingIncrementsForSubject)"
              :key="increment"
              class="btn btn-sm btn-secondary mr-1"
              @click="increaseNumDisplayedSubject(increment)"
            >
              <i class="fas fa-chevron-down"/> {{ $t('message.metadata.showXMore', { increment }) }}
            </button>
            <button
              class="btn btn-sm btn-primary"
              @click="subject.displayCount = getSubject.length"
            >
              <i class="fas fa-eye"/> {{ $t('message.metadata.showAll') }} {{ getSubject.length.toLocaleString('fi') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {truncate} from "@/modules/utils/helpers";
import {has, isNil} from "lodash";
import {mapGetters} from "vuex";

export default {
  name: "DatasetDetailsSubject",
  props: {
    sortAlphabetically: Function
  },
  data() {
    return {
      maxSubjectLength: this.$env.datasets.maxSubjectLength,
      followSubjectLinks: this.$env.datasets.followSubjectLinks,
      subject: {
        displayAll: false,
        displayCount: 24, // Should never exceed number of subjects
        incrementSteps: [12, 60],
      }
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getSubject'
    ]),
    displayedSubject() {
      return this.subject.displayAll
        ? Object.freeze(this.sortedSubject)
        : Object.freeze(this.sortedSubject.slice(0, this.subject.displayCount));
    },
    isSubjectAllDisplayed() {
      return this.subject.displayCount >= this.getSubject.length;
    },
    sortedSubject() {
      let selected = [], fallback = [], other = {}, without = []; // eslint-disable-line
      const selectedLanguage = this.$route.query.locale;

      // Sort by language
      this.getSubject.forEach((element) => {
        const e = element;
        if (has(element, 'title') && element.title !== null) {
          if (typeof element.title === 'object') {
            Object.keys(element.title).forEach((key) => {
              if (key !== selectedLanguage) {
                delete e.title[key];
              }
            });
          }
          selected.push(element);
        }
      });
      this.sortAlphabetically(selected, 'title');
      return selected;
    }
  },
  methods: {
    truncate,
    showSubject(subject) {
      return has(subject, 'title') && !isNil(subject.title);
    },
    // subjectTruncated(subject) {
    //   return subject.title.length > this.maxSubjectLength;
    // },
    increaseNumDisplayedSubject(increment) {
      const clampedSum = this.clamp(this.subject.displayCount + increment, 0, this.getSubject.length);
      this.subject.displayCount = clampedSum;
    },
    nonOverflowingIncrementsForSubject(incrementStep) {
      return this.subject.displayCount + incrementStep <= this.getSubject.length;
    },
    clamp(n, min, max) {
      return Math.min(Math.max(n, min), max);
    }
  }
}
</script>

<style scoped lang="scss">
.subjectBg {
  background-color: #196fd2;
}
</style>
