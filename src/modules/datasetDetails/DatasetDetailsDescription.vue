<template>
  <div class="mt-1 mb-4" data-cy="dataset-description">
    <div class="row">
      <div v-if="getDatasetDescription !== 'No description available'" class="col-12 col-lg-11 offset-lg-1" property="dc:description">
        <app-markdown-content
          v-if="$env.datasetDetails.description.enableMarkdownInterpretation"
          :text="truncate(getDatasetDescription, datasetDescriptionLength)"
        >
          <template #after>
            <small v-if="!isDatasetDescriptionExpanded && datasetDescriptionLength < getDatasetDescriptionLength" class="cursor-pointer text-nowrap" @click="toggleDatasetDescription">
              {{ $t('message.metadata.showMore') }}
            </small>
            <small v-else-if="isDatasetDescriptionExpanded" class="cursor-pointer text-nowrap" @click="toggleDatasetDescription">
              {{ $t('message.metadata.showLess') }}
            </small>
          </template>
        </app-markdown-content>
        <p v-else style="word-wrap:break-word;">
          <span class="mr-2">{{ truncate(getDatasetDescription, datasetDescriptionLength) | stripHtml }}</span>
          <small v-if="!isDatasetDescriptionExpanded && datasetDescriptionLength < getDatasetDescriptionLength" class="cursor-pointer text-nowrap" @click="toggleDatasetDescription">
            {{ $t('message.metadata.showMore') }}
          </small>
          <small v-else-if="isDatasetDescriptionExpanded" class="cursor-pointer text-nowrap" @click="toggleDatasetDescription">
            {{ $t('message.metadata.showLess') }}
          </small>
        </p>
      </div>
      <div v-else class="col-10 offset-1 text-muted font-italic">
        <p style="word-wrap:break-word;">
          {{ $t('message.catalogsAndDatasets.noDescriptionAvailable') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import AppMarkdownContent from "@/modules/datasetDetails/AppMarkdownContent";
import filtersMixin from "@/modules/mixins/filters";
import {getTranslationFor, truncate} from "@/modules/utils/helpers";
import {mapGetters} from "vuex";
export default {
  name: "DatasetDetailsDescription",
  components: {AppMarkdownContent},
  mixins: [filtersMixin],
  data() {
    return {
      isDatasetDescriptionExpanded: false,
      datasetDescriptionLength: 5000,
      INITIAL_DATASET_DESCRIPTION_LENGTH: 5000,
      MAX_DATASET_DESCRIPTION_LENGTH: 100000
    }
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getDescription'
    ]),
    getDatasetDescription() {
      return getTranslationFor(this.getDescription, this.$route.query.locale, this.getLanguages);
    },
    getDatasetDescriptionLength() {
      return this.getDatasetDescription ? this.getDatasetDescription.length : 0;
    }
  },
  methods: {
    truncate,
    toggleDatasetDescription() {
      this.isDatasetDescriptionExpanded = !this.isDatasetDescriptionExpanded;
      if (this.datasetDescriptionLength === this.INITIAL_DATASET_DESCRIPTION_LENGTH) this.datasetDescriptionLength = this.MAX_DATASET_DESCRIPTION_LENGTH;
      else this.datasetDescriptionLength = this.INITIAL_DATASET_DESCRIPTION_LENGTH;
    }
  }
}
</script>

<style scoped>

</style>
