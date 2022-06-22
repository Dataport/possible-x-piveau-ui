import AppLink from "./widgets/AppLink.vue";
import Tooltip from "./widgets/Tooltip.vue";
import Dropdown from "./widgets/Dropdown.vue";
import DropdownDownload from "./widgets/DropdownDownload.vue";
import ResourceAccessPopup from "./widgets/ResourceAccessPopup.vue";

import ResourceDetailsLinkedDataButton from "./datasetDetails/ResourceDetailsLinkedDataButton.vue";
import DatasetDetailsCategories from "./datasetDetails/DatasetDetailsCategories.vue";
import Distributions from "./datasetDetails/distributions/Distributions.vue";
import DatasetDetailsHeader from "./datasetDetails/DatasetDetailsHeader.vue";
// import DatasetDetailsShareButton from "./datasetDetails/DatasetDetailsShareButton.vue";
// import DatasetDetailsLinkedMetricsButton from "./datasetDetails/DatasetDetailsLinkedMetricsButton.vue";
// import DatasetDetailsFeedbackButton from "./datasetDetails/DatasetDetailsFeedbackButton.vue";
// import DatasetDetailsActivityStream from "./datasetDetails/DatasetDetailsActivityStream.vue";
import DatasetDetailsNavigation from "./datasetDetails/DatasetDetailsNavigation.vue";
import DatasetDetailsQuality from "./datasetDetails/DatasetDetailsQuality.vue";
import DatasetDetailsSimilarDatasets from "./datasetDetails/DatasetDetailsSimilarDatasets.vue";
import DatasetDetailsDataset from "./datasetDetails/DatasetDetailsDataset.vue";
import DatasetDetails from "./datasetDetails/DatasetDetails.vue";
import MapBasic from "./datasetDetails/MapBasic.vue";

import SubNavigation from "./navigation/SubNavigation.vue";

import DatasetDate from "./datasets/DatasetDate.vue";

import dateFilters from "./filters/dateFilters";
import PvDataInfoBox from "./PvDataInfoBox/PvDataInfoBox.vue";

import filtersMixin from "./mixins/filters";
import animations from "./mixins/animations";

export {
    AppLink,
    Tooltip,
    Dropdown,
    DropdownDownload,
    ResourceAccessPopup,

    PvDataInfoBox,
    ResourceDetailsLinkedDataButton,
    DatasetDetailsCategories,
    Distributions,
    DatasetDetailsHeader,
    // DatasetDetailsShareButton,
    // DatasetDetailsLinkedMetricsButton,
    DatasetDetailsNavigation,
    // DatasetDetailsFeedbackButton,
    DatasetDetailsQuality,
    DatasetDetailsSimilarDatasets,
    // DatasetDetailsActivityStream,
    DatasetDetailsDataset,
    DatasetDetails,
    MapBasic,

    SubNavigation,

    DatasetDate,

    dateFilters,

    filtersMixin,
    animations
};

// @ts-ignore
export * as helpers from "./utils/helpers.ts";
