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
        <app-link class="nav-item nav-link dropdown-toggle text-nowrap" 
          :class="{'disabled': !(getIsDQVDataRDFAvailable || getIsDQVDataTTLAvailable || getIsDQVDataN3Available || getIsDQVDataNTAvailable || getIsDQVDataJSONLDAvailable)}"
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
          <dataset-details-linked-metrics-button class="dropdown-item" :class="{'disabled': !getIsDQVDataTTLAvailable}" format="ttl" text="Turtle" v-bind:dataset-id="datasetId"></dataset-details-linked-metrics-button>
          <dataset-details-linked-metrics-button class="dropdown-item" :class="{'disabled': !getIsDQVDataN3Available}" format="n3" text="Notation3" v-bind:dataset-id="datasetId"></dataset-details-linked-metrics-button>
          <dataset-details-linked-metrics-button class="dropdown-item" :class="{'disabled': !getIsDQVDataNTAvailable}" format="nt" text="N-Triples" v-bind:dataset-id="datasetId"></dataset-details-linked-metrics-button>
          <dataset-details-linked-metrics-button class="dropdown-item" :class="{'disabled': !getIsDQVDataJSONLDAvailable}" format="jsonld" text="JSON-LD" v-bind:dataset-id="datasetId"></dataset-details-linked-metrics-button>
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
      <div v-if="this.$env.content.datasetDetails.embed.enable" class="d-inline dropdown dsd-link-cite">
        <button type="button" data-toggle="modal" data-target="#embedModal" class="nav-item nav-link text-nowrap bg-none border-0" fragment="#" role="button" id="" style="background:none;">
          <span title="Embed"
                data-toggle="tooltip"
                data-placement="top"
                >
                    {{ $t('message.datasetDetails.datasets.modal.embed') }}
              </span>
        </button>
      </div>
      <hr />
    </ul>
    <dataset-citation-modal
      v-if="!getLoading && getID"
      :modal-id="citationModalId"
      :citation-style="citationStyle"
      :available-citation-styles="availableCitationStyles"
    />
    <dataset-embed-modal />
  </nav>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapGetters, mapActions } from "vuex";
import $ from "jquery";
import * as metaInfo from '../../composables/head';
import { getTranslationFor } from "../../utils/helpers";


export default {
  name: "DatasetDetailsNavigationLinks",
  props: {
    datasetId: {
      type: String,
      required: true,
    },
  },
  components: {
    AppLink: defineAsyncComponent(() => import('../../widgets/AppLink')),
    DatasetCitationModal: defineAsyncComponent(() => import('../../citation/DatasetCitationModal')),
    DatasetEmbedModal: defineAsyncComponent(() => import('../../embed/DatasetEmbedModal')),
    DatasetDetailsFeedbackButton: defineAsyncComponent(() => import('../../datasetDetails/DatasetDetailsFeedbackButton')),
    DatasetDetailsShareButton: defineAsyncComponent(() => import('../../datasetDetails/DatasetDetailsShareButton')),
    DatasetDetailsLinkedMetricsButton: defineAsyncComponent(() => import('../../datasetDetails/DatasetDetailsLinkedMetricsButton')),
    ResourceDetailsLinkedDataButton: defineAsyncComponent(() => import('../../widgets/ResourceDetailsLinkedDataButton')),
  },
  data() {
    return {
      baseUrl: this.$env.api.baseUrl,
      useDQVDataDropdown: this.$env.content.datasetDetails.quality.useDQVDataDropdown,
      citationModalId: 'citationModal',
      // Note: leave citationStyle empty so that the app does not try to load the citation
      // on navigation to the dataset details page in the background.
      citationStyle: '',
      availableCitationStyles: {
        deu: 'EU Data Citation',
        apa: 'APA',
        harvard1: 'Harvard',
        vancouver: 'Vancouver',
      },
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getTitle',
      'getLanguages',
      'getLoading',
      'getIsDQVDataRDFAvailable',
      'getIsDQVDataTTLAvailable',
      'getIsDQVDataN3Available',
      'getIsDQVDataNTAvailable',
      'getIsDQVDataJSONLDAvailable',
      'getID',
    ]),
    url() { 
      return window.location.href; 
    },
    showDQV() {
      return this.useDQVDataDropdown && this.$route.path.endsWith("quality");
    },
  },
  methods: {
    getTranslationFor,
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
  mounted() {},
  setup() {
    metaInfo.useDatasetDetailsNavigationLinksHead();
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
