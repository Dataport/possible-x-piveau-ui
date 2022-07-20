import Facet from "@/modules/facets/Facet.vue";
import Vue from "vue";

export type ComponentMap = { [key: string]: any };

const defaultComponents: ComponentMap = {
  Facet
};

export function configureComponents(components: ComponentMap) {
  const allComponents: ComponentMap = { ...defaultComponents, ...components };
  const componentKeys: string[] = Object.keys(allComponents );
  componentKeys.forEach((key: string) => {
    Vue.component(key, allComponents[key]);
  });
}
