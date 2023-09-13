import ExpandableSelectFacet from "../facets/ExpandableSelectFacet.vue";
import RadioFacet from "../facets/RadioFacet.vue";
import PvShowMore from "../widgets/PvShowMore.vue";
import PvButton from "../widgets/PvButton.vue";
import PvBanner from "../widgets/PvBanner.vue";
import DatasetDetailsNavigationPage from "../datasetDetails/navigation/DatasetDetailsNavigationPage.vue";
import PvDataInfoBox from "../PvDataInfoBox/PvDataInfoBox.vue";
import Datasets from "../datasets/Datasets.vue";
import DistributionsHeader from "../datasetDetails/distributions/DistributionsHeader.vue";
import DistributionDetails from "../datasetDetails/distributions/distributionDetails/DistributionDetails.vue";
import SelectedFacetsOverview from "../facets/SelectedFacetsOverview.vue"
import SubNavigation from "../navigation/SubNavigation.vue";
import DatasetDetailsHeader  from "../datasetDetails/header/DatasetDetailsHeader.vue";
import DatasetDetailsDescription from "../datasetDetails/DatasetDetailsDescription.vue";
import Distribution from "../datasetDetails/distributions/Distribution.vue";
import DistributionActions from "../datasetDetails/distributions/distributionActions/DistributionActions.vue";
import DatasetDetailsProperties from "../datasetDetails/DatasetDetailsProperties.vue";
import DatasetDetailsFeatures from "../datasetDetails/features/DatasetDetailsFeatures.vue";
import DatasetDetailsFeatureHeader from "../datasetDetails/features/DatasetDetailsFeatureHeader.vue"

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
  SubNavigation,
  DatasetDetailsHeader,
  DatasetDetailsDescription,
  Distribution,
  DistributionActions,
  DatasetDetailsProperties,
  DatasetDetailsFeatures,
  DatasetDetailsFeatureHeader
};

export function configureComponents(app: any, components?: ComponentMap) {
  const allComponents: ComponentMap = { ...defaultComponents, ...components };
  const componentKeys: string[] = Object.keys(allComponents);
  componentKeys.forEach((key: string) => { 
    app.component(key, allComponents[key]);
  });
}
