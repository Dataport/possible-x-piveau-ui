import { configureServices } from "./configureServices";
import { ComponentMap, configureComponents } from "./configureComponents";

type ModulesConfig = {
  components: ComponentMap,
  serviceParams: {[key: string]: unknown},
  customFacets: any,
};

export const extras: {[key:string]: any} = {};

export function configureModules(app: any, store: any, config?: ModulesConfig) {
  if (config) {
    configureServices(store, config.serviceParams);
    configureComponents(app, config.components);
  }

  extras.customFacets = config?.customFacets;
  store.$app = app;
}
