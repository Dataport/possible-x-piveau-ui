// @ts-nocheck
import AppLink from "./widgets/AppLink.vue";

import AppSnackbar from './modal/AppSnackbar.vue';
import AppConfirmationDialog from './modal/AppConfirmationDialog.vue';

import Auth from './auth/Auth.vue';

import DatasetDetailsCategories from "./datasetDetails/DatasetDetailsCategories.vue";
import DatasetDetailsQuality from "./datasetDetails/DatasetDetailsQuality.vue";
import DatasetDetailsSimilarDatasets from "./datasetDetails/DatasetDetailsSimilarDatasets.vue";
import DatasetDetailsDataset from "./datasetDetails/DatasetDetailsDataset.vue";
import DatasetDetails from "./datasetDetails/DatasetDetails.vue";

import DistributionDescription from "./datasetDetails/distributions/distributionDetails/DistributionDescription.vue";
import DistributionExpandedContent from "./datasetDetails/distributions/distributionDetails/DistributionExpandedContent.vue";
import DistributionVisibleContent from "./datasetDetails/distributions/distributionDetails/DistributionVisibleContent.vue";

import CSVLinter from "./datasetDetails/DatasetDetailsCSVLinter.vue";

import MapBasic from "./map/MapBasic.vue";
import MapBoundsReceiver from "./map/MapBoundsReceiver.vue";

import NotFound from "./pages/NotFound.vue";
import Imprint from "./pages/Imprint.vue";
import PrivacyPolicy from "./pages/PrivacyPolicy.vue";
import SparqlSearch from "./pages/SparqlSearch.vue";

import Datasets from "./datasets/Datasets.vue";
import Catalogues from "./catalogues/Catalogues.vue";

import PvDataInfoBox from "./PvDataInfoBox/PvDataInfoBox.vue";

import PvBadge from "./PvBadge/PvBadge.vue";

import dateFilters from "./filters/dateFilters";

import vueKeycloak from "./services/keycloakService";
import bulkDownloadCorsProxyService from "./services/bulkDownloadCorsProxyService";
import corsProxyService from "./services/corsProxyService";
import uploadService from "./services/uploadService";
import runtimeConfigurationService from "./services/runtimeConfigurationService";
import datasetService from "./services/piveau-ui-adapter-vhub/datasets";
import catalogService from "./services/piveau-ui-adapter-vhub/catalogs";
import gazetteerService from "./services/piveau-ui-adapter-vhub/gazetteer";

import { decode } from "./utils/jwt";

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
import FileUpload from './data-provider-interface/components/FileUpload';
import DatePicker from './data-provider-interface/components/DatePicker';
import DateTimePicker from './data-provider-interface/components/DateTimePicker';

import usePiwikSuspendFilter from "./mixins/usePiwikSuspendFilter";
import useRouteMetaBreadcrumbs from "./mixins/useRouteMetaBreadcrumbs";

import { configureModules } from "./configurations/configureModules";

import fileTypes from './utils/fileTypes';
import DatasetsFacets from './datasets/datasetsFacets/DatasetsFacets.vue';
import Pagination from './widgets/Pagination';
import SelectedFacetsOverview from './facets/SelectedFacetsOverview';
import getTranslationFor from './utils/helpers';
import truncate from './utils/helpers';
import getImg from './utils/helpers';
import DatasetsTopControls from "./datasets/DatasetsTopControls";
import CataloguesFacets from './catalogues/cataloguesFacets/CataloguesFacets.vue';
import SubNavigation from './navigation/SubNavigation.vue';
import getCountryFlagImg from './utils/helpers';
import DatasetsFilters from "@/modules/datasets/DatasetsFilters.vue";

export {
  AppLink,
  AppSnackbar,
  AppConfirmationDialog,

  Auth,
  
  DatasetDetailsCategories,
  DatasetDetailsQuality,
  DatasetDetailsSimilarDatasets,
  DatasetDetailsDataset,
  DatasetDetails,

  DistributionDescription,
  DistributionExpandedContent,
  DistributionVisibleContent,

  CSVLinter,

  MapBasic,
  MapBoundsReceiver,

  NotFound,
  Imprint,
  PrivacyPolicy,
  SparqlSearch,

  Datasets,
  DatasetsFilters,
  Catalogues,

  PvDataInfoBox,

  PvBadge,

  dateFilters,

  vueKeycloak,
  bulkDownloadCorsProxyService,
  corsProxyService,
  uploadService,
  runtimeConfigurationService,
  datasetService,
  catalogService,
  gazetteerService,

  decode,

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
  UniqueIdentifierInput,
  FileUpload,
  DatePicker,
  DateTimePicker,

  usePiwikSuspendFilter,
  useRouteMetaBreadcrumbs,

  configureModules,

  fileTypes,
  DatasetsFacets,
  Pagination,
  CataloguesFacets,
  SubNavigation,
  SelectedFacetsOverview,
  DatasetsTopControls,
  getTranslationFor,
  truncate,
  getImg,
  getCountryFlagImg

};

// @ts-ignore
export * as helpers from "./utils/helpers.ts";
