<template>
  <!-- FEEDBACK-BUTTON -->
  <app-link
    v-if="getFeedbackQuery(getID, getTitle)"
    :path="`/${this.$route.query.locale}/feedback/form`"
    :query="getFeedbackQuery(getID, getTitle)"
    @click="$emit('track-link', `/${this.$route.query.locale}/feedback/form${getFeedbackQuery(getID, getTitle)}`, 'link')"
    target="_blank"
    class="nav-item nav-link underline text-nowrap">
      <span :title="$t('message.tooltip.datasetDetails.feedback')"
                    data-toggle="tooltip"
                    data-placement="top">
                            {{ $t('message.datasetDetails.feedback') }}
      </span>
  </app-link>
</template>

<script>
  // Import Actions and Getters from Store Module
  import { mapGetters } from 'vuex';
  // Import custom helpers
  import { has } from 'lodash';
  import { getTranslationFor } from '../utils/helpers';
  // Import components used in template
  import { AppLink } from "@piveau/piveau-hub-ui-modules";

  export default {
    name: 'DEU-datasetDetailsFeedbackButton',
    components: {
      appLink: AppLink,
    },
    data() {
      return {
        rootURL: 'https://www.data.europa.eu/',
      };
    },
    computed: {
      // import store-getters
      ...mapGetters('datasetDetails', [
        'getID',
        'getLanguages',
        'getTitle',
      ]),
    },
    methods: {
      // Lodash has function
      has,
      getTranslationFor,
      // Creates the query string for the feedback URL of the dataset
      getFeedbackQuery(id, titles) {
        if (!id || !titles || (typeof titles !== 'object')) return false;
        // Get translated title
        let title = this.getTranslationFor(titles, this.$route.query.locale, this.getLanguages);
        if (!title) return false;
        title = title.replace(/ /g, '+');
        // Create query string
        const type = 'question-specific-dataset';
        const description = `${this.$t('message.datasetDetails.subnav.dataset')}+URL:+${this.rootURL}data/%23/datasets/${id}`;
        const summary = `${this.$t('message.datasetDetails.feedback')}+${this.$t('message.datasetDetails.about')}+${this.$t('message.datasetDetails.subnav.dataset')}:+${title}`;
        // Return query string
        return `?type=${type}&description=${description}&summary=${summary}`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .underline {
    text-decoration: underline;
  }
</style>
