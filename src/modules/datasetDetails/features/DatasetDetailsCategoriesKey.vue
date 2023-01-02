<template>
  <div class="dsd-feature">
    <div class="row">
      <div class="">
        <div>
        <pv-show-more
          v-if="getCategories.length > defaultDisplayCount"
          :label="isCategoriesAllDisplayed? 'Show less' : 'Show more'"
          :upArrow="isCategoriesAllDisplayed"
          :action="toggleDisplayCount"
          class="row text-primary"
        />
      </div>
        <h2 class="mb-4 h4 font-weight-bold">
          {{ $t("message.datasetDetails.subnav.categories") }} ({{
            getCategories.length
          }})
        </h2>
        <div class="keywords__item row" v-if="catCollapsed">
          <span
            v-for="(category, i) in getCategories"
            :key="i"
            class="col-6 col-sm-5 col-md-3 mt-md-0 mt-3 mb-2 px-1"
          >
            <app-link
              :to="getCategoryLink(category)"
              v-if="showCategory(category)"
              ><small
                class=" d-inline-block text-nowrap w-100 py-2 rounded-pill text-center text-white tag-color">
                {{ getTranslationFor(category.title, $route.query.locale) }}
              </small>
            </app-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { has } from "lodash-es";
import { getTranslationFor } from "@/modules/utils/helpers";
import PvShowMore from "@/modules/widgets/PvShowMore";
import AppLink from "@/modules/widgets/AppLink";

export default {
  name: "datasetDetailsCategoriesKey",
  dependencies: "DatasetService",
  components: {PvShowMore,AppLink},
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
      catCollapsed:Boolean
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
.keywords__item > div {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
</style>