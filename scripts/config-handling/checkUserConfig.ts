import {configSchema} from "../../packages/piveau-hub-ui-modules/lib/configurations/config-schema";
import {pathByWorkspaceName} from "../utils/pathByWorkspaceName";
import {getConfigObject} from "./getConfigSchema";

export function checkUserConfig(workspaceName) {
    const configObject = getConfigObject();
    if (workspaceName) {
        pathByWorkspaceName(workspaceName).then(filePath => {
            // const runtimeConfigFilePath = `${filePath}/config/runtime-config.js`
            const userConfigFilePath = `${filePath}/config/user-config.sample.js`
            console.log(userConfigFilePath)
            import("../../" + userConfigFilePath).then(({glueConfig: userConfigSample}) => {
               console.log("userConfigSample", userConfigFilePath, userConfigSample)
            });
        });
    }
}

checkUserConfig(process.argv[2]);
