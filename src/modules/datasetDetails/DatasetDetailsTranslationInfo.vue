<template>
  <div>
    <!-- MACHINE TRANSLATED BANNER -->
    <div class="p-0 py-3 text-center text-sm-left alert alert-secondary alert-dismissible fade show"
         role="alert"
         v-if="machineTranslated">
      <div class="row">
        <div class="col-1 m-auto text-center">
          <i class="material-icons">info</i>
        </div>
        <div class="col-10">
          <p class="mb-0">{{ $t('message.datasetDetails.translation.message') }}</p>
          <div v-if="showString(getOriginalLanguage)">
            <p class="mb-0">{{ $t('message.datasetDetails.translation.original') }}: <strong>{{ getOriginalLanguage }}</strong></p>
            <app-link :to="getDatasetOriginalLanguage(getOriginalLanguage)">
              <button class="alert-link font-weight-light btn btn-link btn-sm p-0"
                      @click="setDatasetOriginalLanguage(getOriginalLanguage)">
                {{ $t('message.datasetDetails.translation.link') }}
              </button>
            </app-link>
          </div>
        </div>
        <div class="col-1">
          <button class="close pt-0"
                  type="button"
                  data-dismiss="alert"
                  aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>
    <!-- TRANSLATION NOT AVAILABLE BUT ARE ONGOING BANNER -->
    <div class="p-0 py-3 text-center text-sm-left alert alert-secondary alert-dismissible fade show"
         role="alert"
         v-if="translationNotAvailable">
      <div class="row">
        <div class="col-1 m-auto text-center">
          <i class="material-icons">info</i>
        </div>
        <div class="col-10">
          <p class="mb-0">{{ $t('message.datasetDetails.translation.noTranslation') }}</p>
        </div>
        <div class="col-1">
          <button class="close pt-0"
                  type="button"
                  data-dismiss="alert"
                  aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "DatasetDetailsTranslationInfo",
  props: {
    machineTranslated: Boolean,
    translationNotAvailable: Boolean,
    showString: Function
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getOriginalLanguage'
    ])
  },
  methods: {
    getDatasetOriginalLanguage(originalLanguage) {
      return { query: Object.assign({}, this.$route.query, { locale: originalLanguage }) };
    },
    setDatasetOriginalLanguage(originalLanguage) {
      this.$i18n.locale = originalLanguage;
    }
  }
}
</script>

<style scoped>

</style>
