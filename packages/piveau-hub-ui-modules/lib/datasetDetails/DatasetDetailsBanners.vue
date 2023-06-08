<template>
  <div class="w-100 dsd-banners">
    <!-- INCORRECT DATE BANNER -->
    <pv-banner
      v-if="dateIncorrect"
      message="This dataset's last updated date is incorrect or incomplete, please contact the data provider for further inquiries."
      class="mb-3"
    />
    <pv-banner
      v-if="machineTranslated"
      :message="$t('message.datasetDetails.translation.message')"
      class="mb-3"
    >
      <div v-if="showString(getOriginalLanguage)">
        <p class="mb-0">{{ $t('message.datasetDetails.translation.original') }}: <strong>{{ getOriginalLanguage }}</strong></p>
        <app-link :to="getDatasetOriginalLanguage(getOriginalLanguage)">
          <button class="alert-link font-weight-light btn btn-link btn-sm p-0"
                  @click="setDatasetOriginalLanguage(getOriginalLanguage)">
            {{ $t('message.datasetDetails.translation.link') }}
          </button>
        </app-link>
      </div>
    </pv-banner>
    <pv-banner
      v-if="translationNotAvailable"
      :message="$t('message.datasetDetails.translation.noTranslation')"
      class="mb-3"
    />
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {isNil, isString} from "lodash";
import AppLink from "../widgets/AppLink";

export default {
  name: "DatasetDetailsBanners",
  components: {AppLink},
  props: {
    dateIncorrect: Boolean,
    machineTranslated: Boolean,
    translationNotAvailable: Boolean
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
    },
    showString(string) {
      return !isNil(string) && isString(string);
    }
  }
}
</script>
