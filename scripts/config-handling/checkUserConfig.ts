import {pathByWorkspaceName} from "../utils/pathByWorkspaceName";
import {getConfigObject, getConfigSchema} from "./getConfigSchema";

export function checkUserConfig(workspaceName) {
    const configSchema = getConfigSchema();
    const configObject = getConfigObject();
    if (workspaceName) {
        pathByWorkspaceName(workspaceName).then(filePath => {
            // const runtimeConfigFilePath = `${filePath}/config/runtime-config.js`
            const userConfigFilePath = `${filePath}/config/user-config.sample.js`
            import("../../" + userConfigFilePath).then(({glueConfig: userConfigSample}) => {
               // console.log("userConfigSample", userConfigFilePath, userConfigSample)
               //  configSchema.safeParse(userConfigSample);
                const { success, error } = configSchema.safeParse(userConfigSample)
                if (!success) {
                    if (error?.errors) {
                        error.errors.forEach(e => {
                            console.warn("Issue in", e.path.join("/"), ": expected:", e.expected, ", received:", e.received); // eslint-disable-line
                        })
                    }
                } else {
                    console.log("File 'user-config.sample.js' is conforming to schema specifications.");
                }
            });
        });
    }
}

checkUserConfig(process.argv[2]);
