import {ComponentMap, configureComponents} from "./configureComponents";
import registerServices from "../services/registerServices";

type ModulesConfig = {
  components?: ComponentMap,
  services?: {[key: string]: object},
  serviceParams?: {[key: string]: unknown},
  // props: object
};

export function configureModules(app: any, config?: ModulesConfig) {
  if (config) {
    configureComponents(app, config.components);
    if (config.services) {
      registerServices(config.services, config.serviceParams);
    }
  }
}

