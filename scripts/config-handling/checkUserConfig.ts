import {pathByWorkspaceName} from "../utils/pathByWorkspaceName";
import {getConfigObject, getConfigSchema} from "./getConfigSchema";

export async function checkUserConfig(workspaceName) {
    const configSchema = getConfigSchema();
    // const configObject = getConfigObject();
    if (workspaceName) {
        const filePath = await pathByWorkspaceName(workspaceName);//.then(filePath => {
        console.log('\x1b[32m');
        console.log("============================================================");
        console.log(" Checking user-config.sample.js for", filePath);
        console.log("============================================================");
        console.log('\x1b[31m');
        // const runtimeConfigFilePath = `${filePath}/config/runtime-config.js`
        const userConfigFilePath = `${filePath}/config/user-config.sample.js`;
        const {glueConfig: userConfigSample} = await import("../../" + userConfigFilePath);

        const { success, error } = configSchema.safeParse(userConfigSample)
        if (!success) {
            if (error?.errors) {
                error.errors.forEach(e => {
                    console.warn(" Issue in", e.path.join("/"), ": expected:", e.expected, ", received:", e.received); // eslint-disable-line
                })
            }
        } else {
            console.log('\x1b[32m', "\u2713  File 'user-config.sample.js' is conforming to schema specifications.");
        }
            // import("../../" + userConfigFilePath).then(() => {
            // });
        // });
    }
}

