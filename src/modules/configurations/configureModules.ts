import {ComponentMap, configureComponents} from "./configureComponents";
import registerServices from "@/modules/services/registerServices";
import Vue from 'vue';

type ModulesConfig = {
  components?: ComponentMap,
  services?: {[key: string]: object},
  serviceParams?: {[key: string]: unknown},
  // props: object
};

export function configureModules(config?: ModulesConfig) {
  if (config) {
    configureComponents(config.components);
    if (config.services) {
      registerServices(config.services, config.serviceParams);
    }
    // if (config.props) {
    //   Vue.prototype.$config = config.props;
    // }
  }
}

