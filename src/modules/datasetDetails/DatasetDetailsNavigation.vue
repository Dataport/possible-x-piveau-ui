<template>
  <!-- NAVIGATION -->
  <sub-navigation :title="getTranslationFor(getTitle, $route.query.locale, getLanguages)">
    <div class="d-flex container-fluid justify-content-between px-0">
      <nav>
        <ul class="menu m-0 list-inline list-unstyled navbar-nav mr-auto">
          <li
            class="mr-2 list-inline-item nav-item text-nowrap"
          >
            <app-link
              class="nav-link"
              :to="{ path: `/datasets/${getID}`, query: Object.assign({}, { locale: $route.query.locale }) }"
              :title="$t('message.tooltip.datasetDetails.dataset')"
              exact
            >
              <span :title="$t('message.tooltip.datasetDetails.dataset')"
                    data-toggle="tooltip"
                    data-placement="top">
                      {{ $t('message.datasetDetails.subnav.dataset') }}
              </span>
            </app-link>
          </li>
          <li
            class="mr-2 list-inline-item nav-item text-nowrap"
          >
            <app-link
              class="nav-link"
              :to="{ path: `/datasets/${getID}/categories`, query: Object.assign({}, { locale: $route.query.locale }) }"
            >
            <span :title="$t('message.tooltip.datasetDetails.categories')"
                  data-toggle="tooltip"
                  data-placement="top">
                  {{ $t('message.datasetDetails.subnav.categories') }}
            </span>
            </app-link>
          </li>
          <li
            class="mr-2 list-inline-item nav-item text-nowrap"
          >
            <app-link
              class="nav-link"
              :to="{ path: `/datasets/${getID}/similarDatasets`, query: Object.assign({}, { locale: $route.query.locale }) }"
            >
              <span :title="$t('message.tooltip.datasetDetails.similarDatasets')"
                    data-toggle="tooltip"
                    data-placement="top">
                    {{ $t('message.datasetDetails.subnav.similarDatasets') }}
              </span>
            </app-link>
          </li>
            <li
            class="mr-2 list-inline-item nav-item text-nowrap"
          >
            <app-link
              class="nav-link"
              :to="{ path: `/datasets/${getID}/quality`, query: Object.assign({}, { locale: $route.query.locale }) }"
            >
              <span :title="$t('message.tooltip.datasetDetails.quality')"
                    data-toggle="tooltip"
                    data-placement="top">
                    {{ $t('message.datasetDetails.subnav.quality') }}
              </span>
            </app-link>
          </li>
          <!--<li class="mr-2 list-inline-item nav-item text-nowrap"-->
            <!--<app-link class="nav-link" :to="{ path: `/datasets/${getID}/activityStream`, query: Object.assign({}, $route.query) }">-->
              <!--{{ $t('message.datasetDetails.subnav.activityStream') }}-->
            <!--</app-link>-->
          <!--</li>-->
        </ul>
      </nav>
      <nav>
        <ul class="menu m-0 list-inline list-unstyled navbar-nav">
          <datasetDetailsFeedbackButton></datasetDetailsFeedbackButton>
          <div class="d-inline dropdown">
            <app-link class="nav-item nav-link dropdown-toggle text-nowrap" fragment="#" role="button" id="shareDatasetDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span :title="$t('message.tooltip.datasetDetails.share')"
                    data-toggle="tooltip"
                    data-placement="top">
                    {{ $t('message.datasetDetails.share') }}
              </span>
            </app-link>
            <div class="dropdown-menu" aria-labelledby="shareDatasetDropdownMenuLink">
              <datasetDetailsShareButton class="dropdown-item" :to="`https://www.facebook.com/sharer.php?u=${url}`" :icon="{ prefix: 'fab', iconName: 'facebook-f' }"></datasetDetailsShareButton>
              <datasetDetailsShareButton class="dropdown-item" :to="`https://twitter.com/intent/tweet?url=${url}`" :icon="{ prefix: 'fab', iconName: 'twitter' }"></datasetDetailsShareButton>
              <datasetDetailsShareButton class="dropdown-item" :to="`https://www.linkedin.com/shareArticle?mini=true&url=${url}`" :icon="{ prefix: 'fab', iconName: 'linkedin-in' }"></datasetDetailsShareButton>
            </div>
          </div>
          <div class="d-inline">
            <app-link class="nav-item nav-link text-nowrap"
                :to="getFeedLink()"
                target="_blank"
                matomo-track-page-view
                role="button">
              {{ $t('message.datasetDetails.datasetFeed') }}
            </app-link>
          </div>
          <div class="d-inline dropdown">
            <app-link class="nav-item nav-link dropdown-toggle text-nowrap" fragment="#" role="button" id="linkedDataDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <!--<i class="material-icons small-icon align-bottom text-dark">***FIND A LINKED DATA ICON***</i>-->
                <span :title="$t('message.tooltip.datasetDetails.linkedData')"
                    data-toggle="tooltip"
                    data-placement="top">
                    {{ $t('message.metadata.linkedData') }}
              </span>
            </app-link>
            <div class="dropdown-menu" aria-labelledby="linkedDataDropdownMenuLink">
              <resourceDetailsLinkedDataButton class="dropdown-item" format="rdf" text="RDF/XML" resources="datasets" v-bind:resources-id="datasetId"></resourceDetailsLinkedDataButton>
              <resourceDetailsLinkedDataButton class="dropdown-item" format="ttl" text="Turtle" resources="datasets" v-bind:resources-id="datasetId"></resourceDetailsLinkedDataButton>
              <resourceDetailsLinkedDataButton class="dropdown-item" format="n3" text="Notation3" resources="datasets" v-bind:resources-id="datasetId"></resourceDetailsLinkedDataButton>
              <resourceDetailsLinkedDataButton class="dropdown-item" format="nt" text="N-Triples" resources="datasets" v-bind:resources-id="datasetId"></resourceDetailsLinkedDataButton>
              <resourceDetailsLinkedDataButton class="dropdown-item" format="jsonld" text="JSON-LD" resources="datasets" v-bind:resources-id="datasetId"></resourceDetailsLinkedDataButton>
            </div>
          </div>
          <div class="d-inline dropdown">
            <app-link class="nav-item nav-link dropdown-toggle text-nowrap" :class="{'disabled': !(this.getIsDQVDataRDFAvailable)}" fragment="#" role="button" id="metaDataDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <!--<i class="material-icons small-icon align-bottom text-dark">***FIND A LINKED DATA ICON***</i>-->
              <span :title="$t('message.tooltip.datasetDetails.dqvData')"
                    data-toggle="tooltip"
                    data-placement="top">
                     DQV Data
              </span>
            </app-link>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="metaDataDropdownMenuLink">
              <datasetDetailsLinkedMetricsButton class="dropdown-item" :class="{'disabled': !getIsDQVDataRDFAvailable}" format="rdf" text="RDF/XML" v-bind:dataset-id="datasetId"></datasetDetailsLinkedMetricsButton>
              <datasetDetailsLinkedMetricsButton class="dropdown-item" :class="{'disabled': !getIsDQVDataRDFAvailable}" format="ttl" text="Turtle" v-bind:dataset-id="datasetId"></datasetDetailsLinkedMetricsButton>
              <datasetDetailsLinkedMetricsButton class="dropdown-item" :class="{'disabled': !getIsDQVDataRDFAvailable}" format="n3" text="Notation3" v-bind:dataset-id="datasetId"></datasetDetailsLinkedMetricsButton>
              <datasetDetailsLinkedMetricsButton class="dropdown-item" :class="{'disabled': !getIsDQVDataRDFAvailable}" format="nt" text="N-Triples" v-bind:dataset-id="datasetId"></datasetDetailsLinkedMetricsButton>
              <datasetDetailsLinkedMetricsButton class="dropdown-item" :class="{'disabled': !getIsDQVDataRDFAvailable}" format="jsonld" text="JSON-LD" v-bind:dataset-id="datasetId"></datasetDetailsLinkedMetricsButton>
            </div>
          </div>
          <div class="d-inline dropdown">
            <app-link class="nav-item nav-link dropdown-toggle text-nowrap" fragment="#" role="button" id="citationDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-cy="citation-dropdown-expand">
                     {{ $t('message.datasetDetails.cite') }}
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
        </ul>
      </nav>
    </div>
    <dataset-citation-modal
      v-if="!getLoading && getID"
      :modal-id="citationModalId"
      :citation-style="citationStyle"
      :available-citation-styles="availableCitationStyles"
    />
  </sub-navigation>
</template>

<script>
import $ from 'jquery';
import { mapActions, mapGetters } from 'vuex';
import AppLink from "../widgets/AppLink.vue";
import ResourceDetailsLinkedDataButton from "./ResourceDetailsLinkedDataButton.vue";
import { getTranslationFor } from "../utils/helpers";
import SubNavigation from '../navigation/SubNavigation.vue';
import DatasetDetailsFeedbackButton from './DatasetDetailsFeedbackButton.vue';
import DatasetDetailsShareButton from './DatasetDetailsShareButton';
import DatasetDetailsLinkedMetricsButton from './DatasetDetailsLinkedMetricsButton.vue';
import DatasetCitationModal from '../citation/DatasetCitationModal.vue';

  export default {
    name: 'datasetDetailsNavigation',
    components: {
      appLink: AppLink,
      subNavigation: SubNavigation,
      datasetDetailsFeedbackButton: DatasetDetailsFeedbackButton,
      datasetDetailsShareButton: DatasetDetailsShareButton,
      resourceDetailsLinkedDataButton: ResourceDetailsLinkedDataButton,
      datasetDetailsLinkedMetricsButton: DatasetDetailsLinkedMetricsButton,
      DatasetCitationModal
    },
    props: {
      datasetId: {
        type: String,
        required: true,
      },
    },
    metaInfo() {
      return {
        link: [{
          rel: 'alternate', type: 'application/rss+xml', title: `data.europa.eu - ${this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages)}`, href: `https://piveau-hub-search-data-europa-eu.apps.osc.fokus.fraunhofer.de/de/feeds/datasets/${this.getID}.rss`,
        }],
      };
    },
    data() {
      return {
        baseUrl: this.$env.api.baseUrl,
        navbarCollapsed: false,
        availableCitationStyles: {
          deu: 'EU Data Citation',
          apa: 'APA',
          harvard1: 'Harvard',
          vancouver: 'Vancouver',
        },
        citationModalId: 'citationModal',
        citationStyle: 'deu',
      };
    },
    computed: {
      // import store-getters
      ...mapGetters('datasetDetails', [
        'getID',
        'getTitle',
        'getLanguages',
        'getDQVDataHead',
        'getIsDQVDataRDFAvailable',
        'getLoading',
      ]),
      url() { return window.location.href; },
    },
    methods: {
      // import store-actions
      ...mapActions('datasetDetails', [
        'useService',
        'loadDQVData',
      ]),
      modal() {
        $('#citationModal').modal({ show: true });
      },
      getTranslationFor,
      getFeedLink() {
        return `${this.baseUrl}${this.$route.query.locale}/feeds/datasets/${this.datasetId}.rss`;
      },
      async showCitationModal(style = 'default') {
        this.citationStyle = style;
        await this.$nextTick();
        $('#citationModal').modal({ show: true });
      },
    },
    created() {
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
          });
      });
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../styles/bootstrap_theme';
  .nav-link {
    text-decoration: underline;
  }

  .active {
    text-decoration: none;
    font-weight: 700;
  }

  .dropdown-item {
    &:active {
      background-color: $dropdown-item-active-bg;
    }
  }
</style>
