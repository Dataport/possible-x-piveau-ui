<template>
  <nav class="dsd-nav-links">
    <ul class="menu m-0 list-inline list-unstyled navbar-nav">
      <dataset-details-feedback-button />
      <div class="d-inline dropdown dsd-link-share">
        <app-link class="nav-item nav-link dropdown-toggle text-nowrap" fragment="#" role="button" id="shareDatasetDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span :title="$t('message.tooltip.datasetDetails.share')"
                    data-toggle="tooltip"
                    data-placement="top">
                    {{ $t('message.datasetDetails.share') }}
              </span>
        </app-link>
        <div class="dropdown-menu" aria-labelledby="shareDatasetDropdownMenuLink">
          <dataset-details-share-button class="dropdown-item" :to="`https://www.facebook.com/sharer.php?u=${url}`" :icon="{ prefix: 'fab', iconName: 'facebook-f' }"></dataset-details-share-button>
          <dataset-details-share-button class="dropdown-item" :to="`https://twitter.com/intent/tweet?url=${url}`" :icon="{ prefix: 'fab', iconName: 'twitter' }"></dataset-details-share-button>
          <dataset-details-share-button class="dropdown-item" :to="`https://www.linkedin.com/shareArticle?mini=true&url=${url}`" :icon="{ prefix: 'fab', iconName: 'linkedin-in' }"></dataset-details-share-button>
        </div>
      </div>
      <div class="d-inline dsd-link-feed">
        <app-link class="nav-item nav-link text-nowrap"
                  :to="getFeedLink()"
                  target="_blank"
                  matomo-track-page-view
                  role="button">
          <span :title="$t('message.tooltip.datasetDetails.datasetFeed')" data-toggle="tooltip"  data-placement="top"> {{ $t('message.datasetDetails.datasetFeed') }}
          </span>
        </app-link>
      </div>
      <div class="d-inline dropdown dsd-link-linked-data">
        <app-link class="nav-item nav-link dropdown-toggle text-nowrap" fragment="#" role="button" id="linkedDataDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <!--<i class="material-icons small-icon align-bottom text-dark">***FIND A LINKED DATA ICON***</i>-->
          <span :title="$t('message.tooltip.datasetDetails.linkedData')"
                data-toggle="tooltip"
                data-placement="top">
                    {{ $t('message.metadata.linkedData') }}
              </span>
        </app-link>
        <div class="dropdown-menu" aria-labelledby="linkedDataDropdownMenuLink">
          <resource-details-linked-data-button class="dropdown-item" format="rdf" text="RDF/XML" resources="datasets" v-bind:resources-id="datasetId"></resource-details-linked-data-button>
          <resource-details-linked-data-button class="dropdown-item" format="ttl" text="Turtle" resources="datasets" v-bind:resources-id="datasetId"></resource-details-linked-data-button>
          <resource-details-linked-data-button class="dropdown-item" format="n3" text="Notation3" resources="datasets" v-bind:resources-id="datasetId"></resource-details-linked-data-button>
          <resource-details-linked-data-button class="dropdown-item" format="nt" text="N-Triples" resources="datasets" v-bind:resources-id="datasetId"></resource-details-linked-data-button>
          <resource-details-linked-data-button class="dropdown-item" format="jsonld" text="JSON-LD" resources="datasets" v-bind:resources-id="datasetId"></resource-details-linked-data-button>
        </div>
      </div>
      <div class="d-inline dropdown dsd-link-dqv" v-if="showDQV">
        <app-link class="nav-item nav-link dropdown-toggle text-nowrap" :class="{'disabled': !(this.getIsDQVDataRDFAvailable)}"
                  fragment="#" role="button" id="metaDataDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <!--<i class="material-icons small-icon align-bottom text-dark">***FIND A LINKED DATA ICON***</i>-->
          <span :title="$t('message.tooltip.datasetDetails.dqvData')"
                data-toggle="tooltip"
                data-placement="top">
                     DQV Data
              </span>
        </app-link>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="metaDataDropdownMenuLink">
          <dataset-details-linked-metrics-button class="dropdown-item" :class="{'disabled': !getIsDQVDataRDFAvailable}" format="rdf" text="RDF/XML" v-bind:dataset-id="datasetId"></dataset-details-linked-metrics-button>
          <dataset-details-linked-metrics-button class="dropdown-item" :class="{'disabled': !getIsDQVDataRDFAvailable}" format="ttl" text="Turtle" v-bind:dataset-id="datasetId"></dataset-details-linked-metrics-button>
          <dataset-details-linked-metrics-button class="dropdown-item" :class="{'disabled': !getIsDQVDataRDFAvailable}" format="n3" text="Notation3" v-bind:dataset-id="datasetId"></dataset-details-linked-metrics-button>
          <dataset-details-linked-metrics-button class="dropdown-item" :class="{'disabled': !getIsDQVDataRDFAvailable}" format="nt" text="N-Triples" v-bind:dataset-id="datasetId"></dataset-details-linked-metrics-button>
          <dataset-details-linked-metrics-button class="dropdown-item" :class="{'disabled': !getIsDQVDataRDFAvailable}" format="jsonld" text="JSON-LD" v-bind:dataset-id="datasetId"></dataset-details-linked-metrics-button>
        </div>
      </div>
      <div class="d-inline dropdown dsd-link-cite">
        <app-link
          class="nav-item nav-link dropdown-toggle text-nowrap"
          :class="{
            'disabled': getLoading,
          }"
          fragment="#"
          role="button"
          id="citationDropdown"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          data-cy="citation-dropdown-expand">
          <span :title="$t('message.tooltip.datasetDetails.cite')" data-toggle="tooltip" data-placement="top"> {{ $t('message.datasetDetails.cite') }}
          </span>
        </app-link>
        <div
          class="dropdown-menu dropdown-menu-right"
          aria-labelledby="citationDropdown"
        >
          <button
            class="dropdown-item"
            v-for="(citationLabel, style) in availableCitationStyles"
            type="button"
            :key="style"
            :disabled="getLoading"
            @click="showCitationModal(style)"
          >
            <div :data-cy="`citation-dropdown-item@${style}`">
              {{ $te(`message.datasetDetails.citationStyle.${style}`) ? $t(`message.datasetDetails.citationStyle.${style}`) : citationLabel }}
            </div>
          </button>
        </div>
      </div>
      <hr />
    </ul>
    <dataset-citation-modal
      v-if="!getLoading && getID"
      :modal-id="citationModalId"
      :citation-style="citationStyle"
      :available-citation-styles="availableCitationStyles"
    />
  </nav>
</template>

<script>
import DatasetDetailsFeedbackButton from "../../datasetDetails/DatasetDetailsFeedbackButton";
import AppLink from "../../widgets/AppLink";
import DatasetDetailsShareButton from "../../datasetDetails/DatasetDetailsShareButton";
import ResourceDetailsLinkedDataButton from "../../widgets/ResourceDetailsLinkedDataButton";
import DatasetDetailsLinkedMetricsButton from "../../datasetDetails/DatasetDetailsLinkedMetricsButton";
import {mapGetters, mapActions} from "vuex";
import $ from "jquery";
// import DatasetCitationModal from "../../citation/DatasetCitationModal";
import {getTranslationFor} from "../../utils/helpers";
export default {
  name: "DatasetDetailsNavigationLinks",
  dependencies: 'DatasetService',
  props: {
    datasetId: {
      type: String,
      required: true,
    },
  },
  components: {
    DatasetCitationModal: () => import('../../citation/DatasetCitationModal'),
    DatasetDetailsLinkedMetricsButton,
    ResourceDetailsLinkedDataButton,
    DatasetDetailsFeedbackButton,
    AppLink,
    DatasetDetailsShareButton
  },
  data() {
    return {
      baseUrl: this.$env.api.baseUrl,
      citationModalId: 'citationModal',
      // Note: leave citationStyle empty so that the app does not try to load the citation
      // on navigation to the dataset details page in the background.
      citationStyle: '',
      availableCitationStyles: {
        deu: 'EU Data Citation',
        apa: 'APA',
        harvard1: 'Harvard',
        vancouver: 'Vancouver',
      }
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getTitle',
      'getLanguages',
      'getLoading',
      'getIsDQVDataRDFAvailable',
      'getID'
    ]),
    url() { return window.location.href; },
    showDQV() {
      const path = this.$router.currentRoute.path;
      return path.endsWith("quality");
    }
  },
  methods: {
    getTranslationFor,
    ...mapActions('datasetDetails', [
      'useService',
      'loadDQVData'
    ]),
    getFeedLink() {
      return `${this.baseUrl}${this.$route.query.locale}/feeds/datasets/${this.datasetId}.rss`;
    },
    async showCitationModal(style = 'default') {
      this.citationStyle = style;
      await this.$nextTick();
      $('#citationModal').modal({ show: true });
    },
    modal() {
      $('#citationModal').modal({ show: true });
    },
  },
  metaInfo() {
    return {
      link: [{
        rel: 'alternate', type: 'application/rss+xml', title: `${this.$env.metadata.title} - ${this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages)}`, href: `https://piveau-hub-search-data-europa-eu.apps.osc.fokus.fraunhofer.de/de/feeds/datasets/${this.getID}.rss`,
      }],
    };
  },
  mounted() {
    this.useService(this.DatasetService);
    this.$nextTick(() => {
      this.$Progress.start();
      this.loadDQVData({ id: this.$route.params.ds_id, formats: ['rdf'], locale: this.$route.query.locale })
        .then(() => {
          this.$Progress.finish();
          $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
          });
        })
        .catch(() => {
          this.$Progress.fail();
        })
        .finally(() => {
          console.clear();
        });
    });
  }
}
</script>

<style scoped lang="scss">
.dropdown-item {
  &:active {
    background-color: var(--dropdown-item-active-bg);
  }
}

.nav-link {
  text-decoration: underline;
}
</style>
