<template>
  <div class="w-100">
    <!-- INCORRECT DATE BANNER -->
    <pv-banner
      v-if="dateIncorrect"
      text="This dataset's last updated date is incorrect or incomplete, please contact the data provider for further inquiries."
    />
    <pv-banner
      v-if="machineTranslated"
      :text="$t('message.datasetDetails.translation.message')"
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
      :text="$t('message.datasetDetails.translation.noTranslation')"
    />
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import PvBanner from "@/modules/widgets/PvBanner";
import {isNil, isString} from "lodash";

export default {
  name: "DatasetDetailsBanners",
  components: {PvBanner},
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
