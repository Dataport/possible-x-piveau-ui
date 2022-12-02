import Vue from "vue";
import ExpandableSelectFacet from "@/modules/facets/ExpandableSelectFacet.vue";
import RadioFacet from "@/modules/facets/RadioFacet.vue";
import PvShowMore from "@/modules/widgets/PvShowMore.vue";
import PvButton from "@/modules/widgets/PvButton.vue";
import PvBanner from "@/modules/widgets/PvBanner.vue";
import DatasetDetailsNavigationPage from "@/modules/datasetDetails/navigation/DatasetDetailsNavigationPage.vue";
import PvDataInfoBox from "@/modules/PvDataInfoBox/PvDataInfoBox.vue";
import Datasets from "@/modules/datasets/Datasets.vue";
import DistributionsHeader from "@/modules/datasetDetails/distributions/DistributionsHeader.vue";
import DistributionDetails from "@/modules/datasetDetails/distributions/distributionDetails/DistributionDetails.vue";
import SelectedFacetsOverview from "@/modules/facets/SelectedFacetsOverview.vue"
import SubNavigation from "@/modules/navigation/SubNavigation.vue";

export type ComponentMap = { [key: string]: any };

const defaultComponents: ComponentMap = {
  SelectFacet: ExpandableSelectFacet,
  RadioFacet,
  PvShowMore,
  PvButton,
  PvBanner,
  DatasetDetailsNavigationPage,
  PvDataInfoBox,
  Datasets,
  DistributionsHeader,
  DistributionDetails,
  SelectedFacetsOverview,
  SubNavigation
};

export function configureComponents(components?: ComponentMap) {
  const allComponents: ComponentMap = { ...defaultComponents, ...components };
  const componentKeys: string[] = Object.keys(allComponents);
  componentKeys.forEach((key: string) => {
    Vue.component(key, allComponents[key]);
  });
}
