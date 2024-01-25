<template>
  <div class="row mt-4 flex-column dsd-item dsd-keywords">
    <span v-if="showTitle" class="mb-4 h-4 font-weight-bold">Subjects ({{ displayedSubjects.length }})</span>
    <div class="keywords__item row">

    
      <span
        v-for='(subject, i) in displayedSubjects'
        :key="i"
        class="col-6 col-sm-3 col-md-2 mt-md-0 mt-3 mb-2 mx-0 px-1"
      >

     
      
      <app-link :to="getSubjectLink(subject)">
        <small v-if="typeof subject.title === 'object'" class="d-inline-block w-100 py-2 rounded-pill text-center text-white subject">
          <span v-for="(value, key) in subject.title" :key="key">
            
            <tooltip :title="value"  data-placement="top">
              {{ truncate(value, maxSubjectLength, false) }}
            </tooltip>
        
          </span>
        </small>
      
        <small v-else-if="typeof subject.title === 'string'" class="d-inline-block w-100 py-2 rounded-pill text-center text-white subject">
          <span>
            <tooltip :title="subject.title"  data-placement="top">
              {{ truncate(subject.title, maxSubjectLength, false) }}
            </tooltip>
          </span>
        </small>
      </app-link>
      </span>
    </div>
    <div>
      <pv-show-more
        v-if="displayedSubjects.length > defaultDisplayCount"
        :label="isSubjectAllDisplayed? $t('message.metadata.showLess') : $t('message.metadata.showMore')"
        :upArrow="isSubjectAllDisplayed"
        :action="toggleDisplayCount"
        class="row text-primary"
      />
    </div>
<!--    <div>-->
<!--      <div-->
<!--        v-if="!subject.displayAll && !isSubjectAllDisplayed"-->
<!--        class="keywords__item"-->
<!--      >-->
<!--        <div-->
<!--          class="keywords__actions pb-md-3"-->
<!--        >-->
<!--          <button-->
<!--            v-for="increment in subject.incrementSteps.filter(nonOverflowingIncrementsForSubject)"-->
<!--            :key="increment"-->
<!--            class="btn btn-sm btn-secondary mr-1"-->
<!--            @click="increaseNumDisplayedSubject(increment)"-->
<!--          >-->
<!--            <i class="fas fa-chevron-down"/> {{ $t('message.metadata.showXMore', { increment }) }}-->
<!--          </button>-->
<!--          <button-->
<!--            class="btn btn-sm btn-primary"-->
<!--            @click="subject.displayCount = getSubject.length"-->
<!--          >-->
<!--            <i class="fas fa-eye"/> {{ $t('message.metadata.showAll') }} {{ getSubject.length.toLocaleString('fi') }}-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
import {truncate} from "../../utils/helpers";
import {has} from "lodash";
import {mapGetters} from "vuex";
import Tooltip from "../../widgets/Tooltip";
import AppLink from "../../widgets/AppLink";
import {sortAlphabetically} from "./utils/sortAlphabetically";

export default {
  name: "DatasetDetailsSubject",
  components: {Tooltip, AppLink},
  data() {
    return {
      showTitle: this.$env.content.datasetDetails.keywords.showTitle,
      maxSubjectLength: this.$env.content.datasets.maxKeywordLength,
      defaultDisplayCount: 24,
      followSubjectLinks: this.$env.content.datasets.followSubjectLinks,
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
    displayedSubjects() {
      const subjects = this.subject.displayAll
        ? Object.freeze(this.sortedSubject)
        : Object.freeze(this.sortedSubject.slice(0, this.subject.displayCount));
      return subjects.filter(subject => subject.title);
    },
    isSubjectAllDisplayed() {
      return this.subject.displayCount >= this.displayedSubjects.length;
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
      this.sortAlphabetically(selected, 'title', selectedLanguage);
      return selected;
    }
  },
  methods: {
    truncate,
    sortAlphabetically,
    increaseNumDisplayedSubject(increment) {
      this.subject.displayCount = this.clamp(this.subject.displayCount
        + increment, 0, this.getSubject.length);
    },
    nonOverflowingIncrementsForSubject(incrementStep) {
      return this.subject.displayCount + incrementStep <= this.getSubject.length;
    },
    clamp(n, min, max) {
      return Math.min(Math.max(n, min), max);
    },
    getSubjectLink(subject) {
      const urlResource = subject.id
    
      
        return {
        path: `/datasets?subject=${urlResource}`,
        query: Object.assign({}, { locale: this.$route.query.locale }),
      };
      
      
      
    },
    toggleDisplayCount() {
      if (this.keywords.displayCount < this.displayedSubjects.length) {
        this.keywords.displayCount = this.displayedSubjects.length;
      } else {
        this.keywords.displayCount = this.defaultDisplayCount;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.subject {
  background-color: #196fd2;
}
</style>
