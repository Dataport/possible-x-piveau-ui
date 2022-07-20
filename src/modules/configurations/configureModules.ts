import {ComponentMap, configureComponents} from "./configureComponents";

type ModulesConfig = { components: ComponentMap };

export function configureModules(config: ModulesConfig) {
  configureComponents(config.components);
}

