import AppLink from "./widgets/AppLink.vue";
import Tooltip from "./widgets/Tooltip.vue";
import Dropdown from "./widgets/Dropdown.vue";
import ResourceAccessPopup from "./widgets/ResourceAccessPopup.vue";
import AppSnackbar from './modal/AppSnackbar.vue';
import AppConfirmationDialog from './modal/AppConfirmationDialog.vue';

import ResourceDetailsLinkedDataButton from "./widgets/ResourceDetailsLinkedDataButton.vue";
import DatasetDetailsCategories from "./datasetDetails/DatasetDetailsCategories.vue";
import Distributions from "./datasetDetails/distributions/Distributions.vue";
import DatasetDetailsHeader from "./datasetDetails/DatasetDetailsHeader.vue";
import DatasetDetailsNavigation from "./datasetDetails/DatasetDetailsNavigation.vue";
import DatasetDetailsQuality from "./datasetDetails/DatasetDetailsQuality.vue";
import DatasetDetailsSimilarDatasets from "./datasetDetails/DatasetDetailsSimilarDatasets.vue";
import DatasetDetailsDataset from "./datasetDetails/DatasetDetailsDataset.vue";
import DatasetDetails from "./datasetDetails/DatasetDetails.vue";

import MapBasic from "./map/MapBasic.vue";
import MapBoundsReceiver from "./map/MapBoundsReceiver.vue";

import SubNavigation from "./navigation/SubNavigation.vue";

import NotFound from "./pages/NotFound.vue";
import Imprint from "./pages/Imprint.vue";
import PrivacyPolicy from "./pages/PrivacyPolicy.vue";
import SparqlSearch from "./pages/SparqlSearch.vue";

import DatasetDate from "./datasets/DatasetDate.vue";
import Datasets from "./datasets/Datasets.vue";

import Catalogues from "./catalogues/Catalogues.vue";

import dateFilters from "./filters/dateFilters";
import PvDataInfoBox from "./PvDataInfoBox/PvDataInfoBox.vue";

import filtersMixin from "./mixins/filters";
import animations from "./mixins/animations";

import authService from "./services/authService";
import vueKeycloak from "./services/keycloakService";
import bulkDownloadCorsProxyService from "./services/bulkDownloadCorsProxyService";
import corsProxyService from "./services/corsProxyService";
import uploadService from "./services/uploadService";
import runtimeConfigurationService from "./services/runtimeConfigurationService";
import datasetService from "./services/piveau-ui-adapter-vhub/datasets";
import catalogService from "./services/piveau-ui-adapter-vhub/catalogs";
import gazetteerService from "./services/piveau-ui-adapter-vhub/gazetteer";
// @ts-ignore
import registerServices from "./services/registerServices";

export {
  AppLink,
  Tooltip,
  Dropdown,
  // DropdownDownload,
  ResourceAccessPopup,
  AppSnackbar,
  AppConfirmationDialog,

  PvDataInfoBox,
  ResourceDetailsLinkedDataButton,
  DatasetDetailsCategories,
  Distributions,
  DatasetDetailsHeader,
  DatasetDetailsNavigation,
  DatasetDetailsQuality,
  DatasetDetailsSimilarDatasets,
  DatasetDetailsDataset,
  DatasetDetails,

  MapBasic,
  MapBoundsReceiver,

  SubNavigation,

  NotFound,
  Imprint,
  PrivacyPolicy,
  SparqlSearch,

  DatasetDate,
  Datasets,
  Catalogues,

  dateFilters,

  filtersMixin,
  animations,

  authService,
  vueKeycloak,
  bulkDownloadCorsProxyService,
  corsProxyService,
  uploadService,
  runtimeConfigurationService,
  datasetService,
  catalogService,
  gazetteerService,
  registerServices
};

// @ts-ignore
export * as helpers from "./utils/helpers.ts";
