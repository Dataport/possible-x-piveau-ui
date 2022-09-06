// import Facet from "@/modules/facets/Facet.vue";
import Vue from "vue";
import ExpandableSelectFacet from "@/modules/facets/ExpandableSelectFacet.vue";
import RadioFacet from "@/modules/facets/RadioFacet.vue";

export type ComponentMap = { [key: string]: any };

const defaultComponents: ComponentMap = {
  SelectFacet: ExpandableSelectFacet,
  RadioFacet
};

export function configureComponents(components?: ComponentMap) {
  const allComponents: ComponentMap = { ...defaultComponents, ...components };
  const componentKeys: string[] = Object.keys(allComponents );
  componentKeys.forEach((key: string) => {
    Vue.component(key, allComponents[key]);
  });
}
