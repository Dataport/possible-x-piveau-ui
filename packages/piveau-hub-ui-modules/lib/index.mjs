// @ts-nocheck
import AppLink from "./widgets/AppLink.vue";
import Tooltip from "./widgets/Tooltip.vue";
import PropertyValue from "./widgets/PropertyValue.vue";

import AppSnackbar from './modal/AppSnackbar.vue';
import AppConfirmationDialog from './modal/AppConfirmationDialog.vue';

import Auth from './auth/Auth.vue';

import DatasetDetailsCategories from "./datasetDetails/DatasetDetailsCategories.vue";
import DatasetDetailsQuality from "./datasetDetails/DatasetDetailsQuality.vue";
import DatasetDetailsSimilarDatasets from "./datasetDetails/DatasetDetailsSimilarDatasets.vue";
import DatasetDetailsDataset from "./datasetDetails/DatasetDetailsDataset.vue";
import DatasetDetailsSkeleton from "./datasetDetails/DatasetDetailsSkeleton.vue";
import DatasetDetails from "./datasetDetails/DatasetDetails.vue";

import FadingDistributionOverlay from "./datasetDetails/distributions/FadingDistributionOverlay";
import AppMarkdownContent from './datasetDetails/AppMarkdownContent.vue';

import DistributionAdded from "./datasetDetails/distributions/DistributionAdded.vue";
import DistributionFormat  from "./datasetDetails/distributions/DistributionFormat.vue";
import DistributionDescription from "./datasetDetails/distributions/distributionDetails/DistributionDescription.vue";
import DistributionExpandedContent from "./datasetDetails/distributions/distributionDetails/DistributionExpandedContent.vue";
import DistributionVisibleContent from "./datasetDetails/distributions/distributionDetails/DistributionVisibleContent.vue";

import DistributionOptionsDropdown from "./datasetDetails/distributions/distributionActions/DistributionOptionsDropdown";
import DistributionDownload from "./datasetDetails/distributions/distributionActions/DistributionDownload";
import LinkedDataButtonsDropdown from "./datasetDetails/distributions/distributionActions/LinkedDataButtonsDropdown";

import DatasetDetailsNavigation from './datasetDetails/navigation/DatasetDetailsNavigation.vue'

import CSVLinter from "./datasetDetails/DatasetDetailsCSVLinter.vue";

import MapBasic from "./map/MapBasic.vue";
import MapBoundsReceiver from "./map/MapBoundsReceiver.vue";

import NotFound from "./pages/NotFound.vue";
import Imprint from "./pages/Imprint.vue";
import PrivacyPolicy from "./pages/PrivacyPolicy.vue";
import SparqlSearch from "./pages/SparqlSearch.vue";

import Datasets from "./datasets/Datasets.vue";
import DatasetDate from "./datasets/DatasetDate.vue";
import Catalogues from "./catalogues/Catalogues.vue";
import CatalogPage from "./catalogues/CatalogPage.vue";

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

import DataProviderInterface from './data-provider-interface/DataProviderInterface.vue';
import DataFetchingComponent from './data-provider-interface/components/DataFetchingComponent.vue';
import OverviewPage from './data-provider-interface/views/OverviewPage.vue';
import InputPage from './data-provider-interface/views/InputPage.vue';
import DraftsPage from './data-provider-interface/views/DraftsPage.vue';
import LinkedDataViewer from './data-provider-interface/views/LinkedDataViewer.vue';
import UserProfilePage from './data-provider-interface/views/UserProfilePage.vue';
import UserCataloguesPage from './data-provider-interface/views/UserCataloguesPage.vue';
import DpiMenu from './data-provider-interface/DPI-menu.vue';
import InfoSlot from './data-provider-interface/components/InfoSlot.vue';
import AutocompleteInput from './data-provider-interface/components/AutocompleteInput.vue';
import CustomURL from './data-provider-interface/components/CustomURL.vue';
import ConditionalInput from './data-provider-interface/components/ConditionalInput.vue';
import Groupedinput from './data-provider-interface/components/Groupedinput.vue';
import UniqueIdentifierInput from './data-provider-interface/components/UniqueIdentifierInput.vue';
import FileUpload from './data-provider-interface/components/FileUpload.vue';
import DatePicker from './data-provider-interface/components/DatePicker.vue';
import DateTimePicker from './data-provider-interface/components/DateTimePicker.vue';

import usePiwikSuspendFilter from "./mixins/usePiwikSuspendFilter";
import useRouteMetaBreadcrumbs from "./mixins/useRouteMetaBreadcrumbs";

import { configureModules } from "./configurations/configureModules";

import { truncate, getImg, getCountryFlagImg, getTranslationFor, getFacetTranslation } from './utils/helpers';
import fileTypes from './utils/fileTypes';
import SubNavigation from './navigation/SubNavigation.vue';
import Pagination from './widgets/Pagination.vue';

import DatasetsFilters from "./datasets/DatasetsFilters.vue";
import DatasetsTopControls from "./datasets/DatasetsTopControls.vue";
import DatasetsFacets from './datasets/datasetsFacets/DatasetsFacets.vue';
import CataloguesFacets from './catalogues/cataloguesFacets/CataloguesFacets.vue';
import SelectedFacetsOverview from './facets/SelectedFacetsOverview.vue';
import DatasetsMapFacet from './datasets/datasetsFacets/DatasetsMapFacet.vue';
import SettingsFacet from './datasets/datasetsFacets/SettingsFacet.vue';


export {
  AppLink,
  Tooltip,
  PropertyValue,
  AppSnackbar,
  AppConfirmationDialog,

  Auth,

  DatasetDetailsCategories,
  DatasetDetailsQuality,
  DatasetDetailsSimilarDatasets,
  DatasetDetailsDataset,
  DatasetDetailsSkeleton,
  DatasetDetails,
  AppMarkdownContent,

  FadingDistributionOverlay,

  DistributionAdded,
  DistributionFormat,
  DistributionDescription,
  DistributionExpandedContent,
  DistributionVisibleContent,

  DistributionDownload,
  DistributionOptionsDropdown,
  LinkedDataButtonsDropdown,

  CSVLinter,

  MapBasic,
  MapBoundsReceiver,

  NotFound,
  Imprint,
  PrivacyPolicy,
  SparqlSearch,

  Datasets,
  DatasetDate,
  DatasetsFilters,
  Catalogues,
  CatalogPage,

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
  CustomURL,
  ConditionalInput,
  Groupedinput,
  UniqueIdentifierInput,
  FileUpload,
  DatePicker,
  DateTimePicker,

  usePiwikSuspendFilter,
  useRouteMetaBreadcrumbs,

  configureModules,

  fileTypes,
  DatasetDetailsNavigation,
  SubNavigation,
  Pagination,

  DatasetsFacets,
  CataloguesFacets,
  DatasetsTopControls,
  SelectedFacetsOverview,
  DatasetsMapFacet,
  SettingsFacet,

  truncate,
  getImg,
  getCountryFlagImg,
  getTranslationFor,
  getFacetTranslation,
};

// @ts-ignore
export * as helpers from "./utils/helpers.ts";
