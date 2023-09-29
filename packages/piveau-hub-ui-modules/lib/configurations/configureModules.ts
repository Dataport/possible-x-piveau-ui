import { configureServices } from "./configureServices";
import { ComponentMap, configureComponents } from "./configureComponents";

type ModulesConfig = {
  components: ComponentMap,
  serviceParams: {[key: string]: unknown},
};

export function configureModules(app: any, store: any, config?: ModulesConfig) {
  if (config) {
    configureServices(store, config.serviceParams);
    configureComponents(app, config.components);
  }
}