<template>
  <div class="row mt-2 flex-column dsd-item dsd-keywords">
        <span class="mb-4 h4 font-weight-bold">
          {{ $t("message.datasetDetails.subnav.categories") }} ({{
            getCategories.length
          }})
        </span>
        <div class="categories__item row" v-if="catCollapsed">
          <span
            v-for="(category, i) in getCategories"
            :key="i"
            class="col-6 col-sm-3 col-md-2 mt-md-0 mt-3 mb-2 px-1"
          >
            <app-link
              :to="getCategoryLink(category)"
              v-if="showCategory(category)"
              ><!-- <small
                class=" d-inline-block text-nowrap w-100 py-2 rounded-pill text-center text-white tag-color">
                {{ getTranslationFor(category.title, $route.query.locale) }}
              </small> -->
              <small class="d-inline-block text-nowrap w-100 py-2 rounded-pill text-center text-white tag-color"
                     :data-toggle="categoryTruncated(category) ? 'tooltip' : false"
                     :data-placement="categoryTruncated(category) ? 'top' : false"
                     :title="categoryTruncated(category) ? category.title : false">
                {{ truncate(category.title, maxKeywordLength, false) }}
              </small>
            </app-link>
          </span>
    </div>
  </div>
</template>

<script>
import {truncate} from "@/modules/utils/helpers";
import { mapActions, mapGetters } from "vuex";
import { has } from "lodash-es";
import { getTranslationFor } from "@/modules/utils/helpers";

import AppLink from "@/modules/widgets/AppLink";

export default {
  name: "datasetDetailsCategoriesKey",
  dependencies: "DatasetService",
  components: {AppLink},
  metaInfo() {
    return {
      title: this.$t("message.metadata.categories"),
      showTitle: this.$env.datasetDetails.categories.showTitle,
      meta: [
        {
          name: "description",
          vmid: "description",
          content: `${this.$t(
            "message.metadata.categories"
          )} - ${this.getTranslationFor(
            this.getTitle,
            this.$route.query.locale,
            this.getLanguages
          )} - data.europa.eu`.substr(0, 4999),
        },
        {
          name: "keywords",
          vmid: "keywords",
          content: this.getKeywords
            .map((k) => k.title)
            .join(" ")
            .substring(0, 4999),
        },
      ],
    };
  },
  data() {
    return {
      catCollapsed:Boolean,
      maxKeywordLength: this.$env.datasets.maxKeywordLength
    };
    
  },
  computed: {
    // import store-getters
    ...mapGetters("datasetDetails", [
      "getCategories",
      "getKeywords",
      "getLanguages",
      "getTitle",
    ]),
    isCategoriesAllDisplayed() {
      return this.categories.displayCount >= this.getKeywords.length;
    }
  },
  methods: {
    truncate,
    has,
    getTranslationFor,
    // import store-actions
    ...mapActions("datasetDetails", ["loadDatasetDetails", "useService"]),
    showCategory(category) {
      return has(category, "id");
    },
    getCategoryLink(category) {
      const categoryID = category.id.toUpperCase();
      return {
        path: `/datasets?categories=${categoryID}`,
        query: Object.assign({}, { locale: this.$route.query.locale }),
      };
    },
    categoryTruncated(category) {
      return category.title.length > this.maxKeywordLength;
    }
  },
  created() {
    this.useService(this.DatasetService);
    this.$nextTick(() => {
      this.$Progress.start();
      this.loadDatasetDetails(this.$route.params.ds_id)
        .then(() => {
          this.$Progress.finish();
        })
        .catch(() => {
          this.$Progress.fail();
          this.$router.replace({
            name: "NotFound",
            query: {
              locale: this.$route.query.locale,
              dataset: this.$route.params.ds_id,
            },
          });
        });
    });
  },
  toggleDisplayCount() {
      if (this.categories.displayCount < this.getCategoryLink.length) {
        this.categories.displayCount = this.getCategoryLink.length;
      } else {
        this.categories.displayCount = this.defaultDisplayCount;
      }
    }
};
</script>

<style scoped lang="scss">
.tag-color {
  background-color: var(--primary);
}
</style>