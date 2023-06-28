// @ts-nocheck

/***** IMPORT JS *****/

// Import Services
import vueKeycloak from "./services/keycloakService";
import bulkDownloadCorsProxyService from "./services/bulkDownloadCorsProxyService";
import corsProxyService from "./services/corsProxyService";
import uploadService from "./services/uploadService";
import runtimeConfigurationService from "./services/runtimeConfigurationService";
import datasetService from "./services/piveau-ui-adapter-vhub/datasets";
import catalogService from "./services/piveau-ui-adapter-vhub/catalogs";
import gazetteerService from "./services/piveau-ui-adapter-vhub/gazetteer";


// Import Stores
import store from "./store";


// Import Utils
import { decode } from "./utils/jwt";
import { truncate, getImg, getCountryFlagImg, getTranslationFor, getFacetTranslation } from './utils/helpers';
import fileTypes from './utils/fileTypes';


// Import Filters
import dateFilters from "./filters/dateFilters";


// Import Mixins
import usePiwikSuspendFilter from "./mixins/usePiwikSuspendFilter";
import useRouteMetaBreadcrumbs from "./mixins/useRouteMetaBreadcrumbs";


// Import Configurations
import { configureModules } from "./configurations/configureModules";



/***** IMPORT VUE COMPONENTS *****/

// Import auth 
import Auth from "./auth/Auth";

// Import cataloguesFacets
import CataloguesFacets from "./catalogues/cataloguesFacets/CataloguesFacets";

// Import catalogues 
import CatalogPage from "./catalogues/CatalogPage";
import Catalogues from "./catalogues/Catalogues";

// Import citation 
import DatasetCitationModal from "./citation/DatasetCitationModal";
import DatasetCitationTable from "./citation/DatasetCitationTable";

// Import data-provider-interface components
import AutocompleteInput from "./data-provider-interface/components/AutocompleteInput";
import CustomURL from './data-provider-interface/components/CustomURL.vue';
import CustomNumber from './data-provider-interface/components/CustomNumber.vue';
import ConditionalInput from "./data-provider-interface/components/ConditionalInput";
import DataFetchingComponent from "./data-provider-interface/components/DataFetchingComponent";
import DatePicker from "./data-provider-interface/components/DatePicker";
import DateTimePicker from "./data-provider-interface/components/DateTimePicker";
import Dropup from "./data-provider-interface/components/Dropup";
import FileUpload from "./data-provider-interface/components/FileUpload";
import Groupedinput from "./data-provider-interface/components/Groupedinput";
import InfoSlot from "./data-provider-interface/components/InfoSlot";
import LangStringInput from "./data-provider-interface/components/LangStringInput";
import LanguageSelector from "./data-provider-interface/components/LanguageSelector";
import Navigation from "./data-provider-interface/components/Navigation";
import UniqueIdentifierInput from "./data-provider-interface/components/UniqueIdentifierInput";
import ValidationModal from "./data-provider-interface/components/ValidationModal";

// Import data-provider-interface views OverviewPage
import CatalogueOverview from "./data-provider-interface/views/OverviewPage/CatalogueOverview";
import DatasetOverview from "./data-provider-interface/views/OverviewPage/DatasetOverview";
import DistributionOverview from "./data-provider-interface/views/OverviewPage/DistributionOverview";
import PropertyEntry from "./data-provider-interface/views/OverviewPage/PropertyEntry";

// Import data-provider-interface views
import DistOverview from "./data-provider-interface/views/DistributionOverview";
import DraftsPage from "./data-provider-interface/views/DraftsPage";
import InputPage from "./data-provider-interface/views/InputPage";
import LinkedDataViewer from "./data-provider-interface/views/LinkedDataViewer";
import OverviewPage from "./data-provider-interface/views/OverviewPage";
import UserCataloguesPage from "./data-provider-interface/views/UserCataloguesPage";
import UserProfilePage from "./data-provider-interface/views/UserProfilePage";

// Import data-provider-interface 
import DataProviderInterface from "./data-provider-interface/DataProviderInterface";
import DpiMenu from "./data-provider-interface/DPIMenu";

// Import datasetDetails distributionActions
import DistributionActions from "./datasetDetails/distributions/distributionActions/DistributionActions";
import DistributionDownload from "./datasetDetails/distributions/distributionActions/DistributionDownload";
import DistributionDownloadAs from "./datasetDetails/distributions/distributionActions/DistributionDownloadAs";
import DistributionsDropdownDownload from "./datasetDetails/distributions/distributionActions/DistributionDropdownDownload";
import DistributionOptionsDropdown from "./datasetDetails/distributions/distributionActions/DistributionOptionsDropdown";
import DistributionPreview from "./datasetDetails/distributions/distributionActions/DistributionPreview";
import LinkedDataButtonsDropdown from "./datasetDetails/distributions/distributionActions/LinkedDataButtonsDropdown";

// Import datasetDetails distributionDetails
import DistributionDescription from "./datasetDetails/distributions/distributionDetails/DistributionDescription";
import DistributionDetails from "./datasetDetails/distributions/distributionDetails/DistributionDetails";
import DistributionExpand from "./datasetDetails/distributions/distributionDetails/DistributionExpand";
import DistributionExpandedContent from "./datasetDetails/distributions/distributionDetails/DistributionExpandedContent";
import DistributionVisibleContent from "./datasetDetails/distributions/distributionDetails/DistributionVisibleContent";

// Import datasetDetails distributions 
import Distribution from "./datasetDetails/distributions/Distribution";
import DistributionAdded from "./datasetDetails/distributions/DistributionAdded";
import DistributionDownloadAsModal from "./datasetDetails/distributions/DistributionDownloadAsModal";
import DistributionFormat from "./datasetDetails/distributions/DistributionFormat";
import Distributions from "./datasetDetails/distributions/Distributions";
import DistributionsHeader from "./datasetDetails/distributions/DistributionsHeader";
import DownloadAllDistributions from "./datasetDetails/distributions/DownloadAllDistributions";
import FadingDistributionOverlay from "./datasetDetails/distributions/FadingDistributionOverlay";

// Import datasetDetails features
import DatasetDetailsCategoriesKey from "./datasetDetails/features/DatasetDetailsCategoriesKey";
import DatasetDetailsDataServices from "./datasetDetails/features/DatasetDetailsDataServices";
import DatasetDetailsFeatureHeader from "./datasetDetails/features/DatasetDetailsFeatureHeader";
import DatasetDetailsFeatures from "./datasetDetails/features/DatasetDetailsFeatures";
import DatasetDetailsIsUsedBy from "./datasetDetails/features/DatasetDetailsIsUsedBy";
import DatasetDetailsKeywords from "./datasetDetails/features/DatasetDetailsKeywords";
import DatasetDetailsMap from "./datasetDetails/features/DatasetDetailsMap";
import DatasetDetailsPages from "./datasetDetails/features/DatasetDetailsPages";
import DatasetDetailsRelations from "./datasetDetails/features/DatasetDetailsRelations";
import DatasetDetailsSubject from "./datasetDetails/features/DatasetDetailsSubject";
import DatasetDetailsVisualisations from "./datasetDetails/features/DatasetDetailsVisualisations";

// Import datasetDetails header
import DatasetDetailsHeader from "./datasetDetails/header/DatasetDetailsHeader";
import DatasetDetailsHeaderCatalogue from "./datasetDetails/header/DatasetDetailsHeaderCatalogue";
import DatasetDetailsHeaderTitle from "./datasetDetails/header/DatasetDetailsHeaderTitle";

// Import datasetDetails navigation
import DatasetDetailsNavigation from "./datasetDetails/navigation/DatasetDetailsNavigation";
import DatasetDetailsNavigationLinks from "./datasetDetails/navigation/DatasetDetailsNavigationLinks";
import DatasetDetailsNavigationPage from "./datasetDetails/navigation/DatasetDetailsNavigationPage";
import DatasetDetailsNavigationPages from "./datasetDetails/navigation/DatasetDetailsNavigationPages";

// Import datasetDetails
import AppMarkdownContent from "./datasetDetails/AppMarkdownContent";
import DatasetDetails from "./datasetDetails/DatasetDetails";
import DatasetDetailsActivityStream from "./datasetDetails/DatasetDetailsActivityStream";
import DatasetDetailsBanners from "./datasetDetails/DatasetDetailsBanners";
import DatasetDetailsCategories from "./datasetDetails/DatasetDetailsCategories";
import CSVLinter from "./datasetDetails/DatasetDetailsCSVLinter";
import DatasetDetailsDataset from "./datasetDetails/DatasetDetailsDataset";
import DatasetDetailsDescription from "./datasetDetails/DatasetDetailsDescription";
import DatasetDetailsFeedbackButton from "./datasetDetails/DatasetDetailsFeedbackButton";
import DatasetDetailsLinkedMetricsButton from "./datasetDetails/DatasetDetailsLinkedMetricsButton";
import DatasetDetailsProperties from "./datasetDetails/DatasetDetailsProperties";
import DatasetDetailsQuality from "./datasetDetails/DatasetDetailsQuality";
import DatasetDetailsShareButton from "./datasetDetails/DatasetDetailsShareButton";
import DatasetDetailsSimilarDatasets from "./datasetDetails/DatasetDetailsSimilarDatasets";
import DatasetDetailsSkeleton from "./datasetDetails/DatasetDetailsSkeleton";

// Import datasets 
import DatasetDate from "./datasets/DatasetDate";
import Datasets from "./datasets/Datasets";
import DatasetsFilters from "./datasets/DatasetsFilters";
import DatasetsTopControls from "./datasets/DatasetsTopControls";

// Import datasetsFacets
import CatalogDetailsFacet from "./datasets/datasetsFacets/CatalogDetailsFacet";
import DatasetsFacets from "./datasets/datasetsFacets/DatasetsFacets";
import DatasetsFacetsItem from "./datasets/datasetsFacets/DatasetsFacetsItem";
import DatasetsMapFacet from "./datasets/datasetsFacets/DatasetsMapFacet";
import SettingsFacet from "./datasets/datasetsFacets/SettingsFacet";

// Import facets 
import ExpandableSelectFacet from "./facets/ExpandableSelectFacet";
import Facet from "./facets/Facet";
import FacetTitle from "./facets/FacetTitle";
import Radiofacet from "./facets/Radiofacet";
import SelectedFacetsOverview from "./facets/SelectedFacetsOverview";

// Import map 
import MapBasic from "./map/MapBasic";
import MapBoundsReceiver from "./map/MapBoundsReceiver";
import MapBoundsSender from "./map/MapBoundsSender";

// Import modal 
import AppConfirmationDialog from "./modal/AppConfirmationDialog";
import AppSnackbar from "./modal/AppSnackbar";
import AppToast from "./modal/AppToast";

// Import navigation 
import SubNavigation from "./navigation/SubNavigation";

// Import pages 
import Imprint from "./pages/Imprint";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SparqlSearch from "./pages/SparqlSearch";

// Import PvBadge 
import PvBadge from "./PvBadge/PvBadge";

// Import PvDataInfoBox 
import PvDataInfoBox from "./PvDataInfoBox/PvDataInfoBox";
import PvDataInfoBoxDescription from "./PvDataInfoBox/PvDataInfoBoxDescription";
import PvDataInfoBoxFooter from "./PvDataInfoBox/PvDataInfoBoxFooter";

// Import widgets 
import AppLink from "./widgets/AppLink";
import Dropdown from "./widgets/Dropdown";
import Pagination from "./widgets/Pagination";
import PropertyValue from "./widgets/PropertyValue";
import PvBanner from "./widgets/PvBanner";
import PvButton from "./widgets/PvButton";
import PvShowMore from "./widgets/PvShowMore";
import ResourceAccessPopup from "./widgets/ResourceAccessPopup";
import ResourceDetailsLinkedDataButton from "./widgets/ResourceDetailsLinkedDataButton";
import Tooltip from "./widgets/Tooltip";


export {
  vueKeycloak,
  bulkDownloadCorsProxyService,
  corsProxyService,
  uploadService,
  runtimeConfigurationService,
  datasetService,
  catalogService,
  gazetteerService,

  store,

  decode, 
  truncate, 
  getImg, 
  getCountryFlagImg, 
  getTranslationFor, 
  getFacetTranslation,
  fileTypes,

  dateFilters,

  usePiwikSuspendFilter,
  useRouteMetaBreadcrumbs,

  configureModules,

  Auth,

  CataloguesFacets,
  CatalogPage, 
  Catalogues,

  DatasetCitationModal, 
  DatasetCitationTable,

  AutocompleteInput, 
  CustomURL,
  CustomNumber,
  ConditionalInput, 
  DataFetchingComponent, 
  DatePicker, 
  DateTimePicker,
  Dropup, 
  FileUpload, 
  Groupedinput, 
  InfoSlot, 
  LangStringInput, 
  LanguageSelector, 
  Navigation,
  UniqueIdentifierInput, 
  ValidationModal,
  CatalogueOverview, 
  DatasetOverview, 
  DistributionOverview, 
  PropertyEntry,
  DistOverview,
  DraftsPage,
  InputPage,
  LinkedDataViewer,
  OverviewPage,
  UserCataloguesPage,
  UserProfilePage,
  DataProviderInterface, 
  DpiMenu,

  DistributionActions, 
  DistributionDownload, 
  DistributionDownloadAs, 
  DistributionsDropdownDownload, 
  DistributionOptionsDropdown, 
  DistributionPreview, 
  LinkedDataButtonsDropdown,
  DistributionDescription, 
  DistributionDetails, 
  DistributionExpand, 
  DistributionExpandedContent, 
  DistributionVisibleContent,
  Distribution, 
  DistributionAdded, 
  DistributionDownloadAsModal, 
  DistributionFormat, 
  Distributions, 
  DistributionsHeader, 
  DownloadAllDistributions, 
  FadingDistributionOverlay, 

  DatasetDetailsCategoriesKey, 
  DatasetDetailsDataServices, 
  DatasetDetailsFeatureHeader, 
  DatasetDetailsFeatures, 
  DatasetDetailsIsUsedBy, 
  DatasetDetailsKeywords, 
  DatasetDetailsMap, 
  DatasetDetailsPages, 
  DatasetDetailsRelations, 
  DatasetDetailsSubject, 
  DatasetDetailsVisualisations,
  DatasetDetailsHeader, 
  DatasetDetailsHeaderCatalogue, 
  DatasetDetailsHeaderTitle,
  DatasetDetailsNavigation, 
  DatasetDetailsNavigationLinks, 
  DatasetDetailsNavigationPage, 
  DatasetDetailsNavigationPages,
  AppMarkdownContent, 
  DatasetDetails, 
  DatasetDetailsActivityStream, 
  DatasetDetailsBanners, 
  DatasetDetailsCategories, 
  CSVLinter, 
  DatasetDetailsDataset, 
  DatasetDetailsDescription, 
  DatasetDetailsFeedbackButton, 
  DatasetDetailsLinkedMetricsButton,
  DatasetDetailsProperties,
  DatasetDetailsQuality, 
  DatasetDetailsShareButton, 
  DatasetDetailsSimilarDatasets, 
  DatasetDetailsSkeleton,

  DatasetDate, 
  Datasets, 
  DatasetsFilters, 
  DatasetsTopControls,
  CatalogDetailsFacet, 
  DatasetsFacets,
  DatasetsFacetsItem, 
  DatasetsMapFacet, 
  SettingsFacet,
  ExpandableSelectFacet, 
  Facet, 
  FacetTitle, 
  Radiofacet, 
  SelectedFacetsOverview,

  MapBasic, 
  MapBoundsReceiver, 
  MapBoundsSender,

  AppConfirmationDialog, 
  AppSnackbar, 
  AppToast,

  SubNavigation,

  Imprint, 
  NotFound, 
  PrivacyPolicy, 
  SparqlSearch ,

  PvBadge,

  PvDataInfoBox, 
  PvDataInfoBoxDescription, 
  PvDataInfoBoxFooter,

  AppLink, 
  Dropdown, 
  Pagination, 
  PropertyValue, 
  PvBanner, 
  PvButton, 
  PvShowMore, 
  ResourceAccessPopup, 
  ResourceDetailsLinkedDataButton, 
  Tooltip,
};

// @ts-ignore
export * as helpers from "./utils/helpers.ts";