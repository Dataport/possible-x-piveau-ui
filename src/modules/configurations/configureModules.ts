import {ComponentMap, configureComponents} from "./configureComponents";
import registerServices from "@/modules/services/registerServices";

type ModulesConfig = {
  components?: ComponentMap,
  services?: {[key: string]: object},
  serviceParams?: {[key: string]: unknown}
};

export function configureModules(config?: ModulesConfig) {
  if (config) {
    configureComponents(config.components);
    if (config.services) {
      registerServices(config.services, config.serviceParams);
    }
  }
}

