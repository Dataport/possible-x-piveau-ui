<template>
  <div ref="datasetDescription" class="mt-4 mb-4 dsd-description" data-cy="dataset-description">
    <div v-if="getDatasetDescription !== 'No description available'" class="col-12 col-lg-11 offset-lg-1 dsd-description-content" property="dc:description">
      <app-markdown-content
        v-if="$env.content.datasetDetails.description.enableMarkdownInterpretation"
        :text="truncate(getDatasetDescription, datasetDescriptionLength)"
      />
      <p v-else style="word-wrap:break-word;">
        <span class="mr-2">{{ truncate(getDatasetDescription, datasetDescriptionLength) | stripHtml }}</span>
<!--        <small v-if="!isDatasetDescriptionExpanded && datasetDescriptionLength < getDatasetDescriptionLength" class="cursor-pointer text-nowrap" @click="toggleDatasetDescription">-->
<!--          {{ $t('message.metadata.showMore') }}-->
<!--        </small>-->
<!--        <small v-else-if="isDatasetDescriptionExpanded" class="cursor-pointer text-nowrap" @click="toggleDatasetDescription">-->
<!--          {{ $t('message.metadata.showLess') }}-->
<!--        </small>-->
      </p>
      <pv-show-more
        v-if="isDatasetDescriptionExpanded || (datasetDescriptionLength < getDatasetDescriptionLength)"
        :label="isDatasetDescriptionExpanded? $t('message.metadata.showLess') : $t('message.metadata.showMore')"
        :upArrow="isDatasetDescriptionExpanded"
        :action="toggleDatasetDescription"
        class="row text-primary"
      />
    </div>
    <div v-else class="col-10 offset-1 text-muted font-italic dsd-description-content">
      <p style="word-wrap:break-word;">
        {{ $t('message.catalogsAndDatasets.noDescriptionAvailable') }}
      </p>
    </div>
    <dataset-details-banners
      :dateIncorrect="dateIncorrect"
      :machineTranslated="machineTranslated"
      :translationNotAvailable="translationNotAvailable"
    />
  </div>
</template>

<script>
import AppMarkdownContent from "../datasetDetails/AppMarkdownContent";
import filtersMixin from "../mixins/filters";
import {getTranslationFor, truncate} from "../utils/helpers";
import { mapGetters, mapActions } from "vuex";
import DatasetDetailsBanners from "../datasetDetails/DatasetDetailsBanners.vue";
export default {
  name: "DatasetDetailsDescription",
  components: {AppMarkdownContent, DatasetDetailsBanners},
  mixins: [filtersMixin],
  props: {
    dateIncorrect: Boolean,
    machineTranslated: Boolean,
    translationNotAvailable: Boolean
  },
  data() {
    return {
      isDatasetDescriptionExpanded: false,
      datasetDescriptionLength: 1500,
      INITIAL_DATASET_DESCRIPTION_LENGTH: 1500,
      MAX_DATASET_DESCRIPTION_LENGTH: 100000
    }
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getDescription',
      'getLanguages'
    ]),
    getDatasetDescription() {
      return getTranslationFor(this.getDescription, this.$route.query.locale, this.getLanguages);
    },
    getDatasetDescriptionLength() {
      return this.getDatasetDescription ? this.getDatasetDescription.length : 0;
    }
  },
  methods: {
     ...mapActions('datasetDetails', [
      'setDatasetDescriptionHeight'
    ]),
    truncate,
    toggleDatasetDescription() {
      this.isDatasetDescriptionExpanded = !this.isDatasetDescriptionExpanded;
      if (this.datasetDescriptionLength === this.INITIAL_DATASET_DESCRIPTION_LENGTH) this.datasetDescriptionLength = this.MAX_DATASET_DESCRIPTION_LENGTH;
      else this.datasetDescriptionLength = this.INITIAL_DATASET_DESCRIPTION_LENGTH;
    },
    calculateDatasetDescriptionHeight() {
      return this.$refs.datasetDescription.querySelector('.dsd-description-content').clientHeight;
    }
  },
  mounted() {
    this.setDatasetDescriptionHeight(this.calculateDatasetDescriptionHeight());
  }
}
</script>

<style scoped>

</style>
