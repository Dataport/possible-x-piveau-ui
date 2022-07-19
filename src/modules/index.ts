// @ts-nocheck
import AppLink from "./widgets/AppLink.vue";
// import Tooltip from "./widgets/Tooltip.vue";
// import Dropdown from "./widgets/Dropdown.vue";
// import ResourceAccessPopup from "./widgets/ResourceAccessPopup.vue";
// import ResourceDetailsLinkedDataButton from "./widgets/ResourceDetailsLinkedDataButton.vue";

import AppSnackbar from './modal/AppSnackbar.vue';
import AppConfirmationDialog from './modal/AppConfirmationDialog.vue';

import DatasetDetailsCategories from "./datasetDetails/DatasetDetailsCategories.vue";
// import Distributions from "./datasetDetails/distributions/Distributions.vue";
// import DatasetDetailsHeader from "./datasetDetails/DatasetDetailsHeader.vue";
// import DatasetDetailsNavigation from "./datasetDetails/DatasetDetailsNavigation.vue";
import DatasetDetailsQuality from "./datasetDetails/DatasetDetailsQuality.vue";
import DatasetDetailsSimilarDatasets from "./datasetDetails/DatasetDetailsSimilarDatasets.vue";
import DatasetDetailsDataset from "./datasetDetails/DatasetDetailsDataset.vue";
import DatasetDetails from "./datasetDetails/DatasetDetails.vue";

import MapBasic from "./map/MapBasic.vue";
import MapBoundsReceiver from "./map/MapBoundsReceiver.vue";

// import SubNavigation from "./navigation/SubNavigation.vue";

import NotFound from "./pages/NotFound.vue";
import Imprint from "./pages/Imprint.vue";
import PrivacyPolicy from "./pages/PrivacyPolicy.vue";
import SparqlSearch from "./pages/SparqlSearch.vue";

// import DatasetDate from "./datasets/DatasetDate.vue";
import Datasets from "./datasets/Datasets.vue";

import Catalogues from "./catalogues/Catalogues.vue";

import dateFilters from "./filters/dateFilters";
// import PvDataInfoBox from "./PvDataInfoBox/PvDataInfoBox.vue";
//
// import filtersMixin from "./mixins/filters";
// import animations from "./mixins/animations";

import vueKeycloak from "./services/keycloakService";
import bulkDownloadCorsProxyService from "./services/bulkDownloadCorsProxyService";
import corsProxyService from "./services/corsProxyService";
import uploadService from "./services/uploadService";
import runtimeConfigurationService from "./services/runtimeConfigurationService";
import datasetService from "./services/piveau-ui-adapter-vhub/datasets";
import catalogService from "./services/piveau-ui-adapter-vhub/catalogs";
import gazetteerService from "./services/piveau-ui-adapter-vhub/gazetteer";
import registerServices from "./services/registerServices";

import { decode } from "./utils/jwt";
// import createIdentifiersApi from "./utils/identifiersApi";
// import { DataEuropaFormatter } from "./utils/formatter";
// import createDraftApi from "./utils/draftApi";
import { retrieveDataFromSource } from "./utils/adapter";

import store from "./store";

import DataProviderInterface from './data-provider-interface/DataProviderInterface';
import DataFetchingComponent from './data-provider-interface/components/DataFetchingComponent';
import OverviewPage from './data-provider-interface/views/OverviewPage';
import InputPage from './data-provider-interface/views/InputPage';
import DraftsPage from './data-provider-interface/views/DraftsPage';
import LinkedDataViewer from './data-provider-interface/views/LinkedDataViewer';
import UserProfilePage from './data-provider-interface/views/UserProfilePage';
import UserCataloguesPage from './data-provider-interface/views/UserCataloguesPage';
import DpiMenu from './data-provider-interface/DPI-menu';
import InfoSlot from './data-provider-interface/components/InfoSlot';
import AutocompleteInput from './data-provider-interface/components/AutocompleteInput';
import ConditionalInput from './data-provider-interface/components/ConditionalInput';
import UniqueIdentifierInput from './data-provider-interface/components/UniqueIdentifierInput';


export {
  AppLink,
  // Tooltip,
  // Dropdown,
  // DropdownDownload,
  // ResourceAccessPopup,
  AppSnackbar,
  AppConfirmationDialog,

  // PvDataInfoBox,
  // ResourceDetailsLinkedDataButton,
  DatasetDetailsCategories,
  // Distributions,
  // DatasetDetailsHeader,
  // DatasetDetailsNavigation,
  DatasetDetailsQuality,
  DatasetDetailsSimilarDatasets,
  DatasetDetailsDataset,
  DatasetDetails,

  MapBasic,
  MapBoundsReceiver,

  // SubNavigation,

  NotFound,
  Imprint,
  PrivacyPolicy,
  SparqlSearch,

  // DatasetDate,
  Datasets,
  Catalogues,

  dateFilters,

  // filtersMixin,
  // animations,

  vueKeycloak,
  bulkDownloadCorsProxyService,
  corsProxyService,
  uploadService,
  runtimeConfigurationService,
  datasetService,
  catalogService,
  gazetteerService,
  registerServices,

  decode,
  // createIdentifiersApi,
  // DataEuropaFormatter,
  // createDraftApi,
  retrieveDataFromSource,

  store,
  DataProviderInterface,
  DataFetchingComponent,
  OverviewPage,
  InputPage,
  DraftsPage,
  LinkedDataViewer,
  UserProfilePage,
  UserCataloguesPage,
  DpiMenu,
  InfoSlot,
  AutocompleteInput,
  ConditionalInput,
  UniqueIdentifierInput
};

// @ts-ignore
export * as helpers from "./utils/helpers.ts";
