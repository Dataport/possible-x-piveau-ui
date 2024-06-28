import fs, {Stats} from "fs";

import {pathByWorkspaceName} from "../utils/pathByWorkspaceName";
import {doForApps} from "../utils/doForApp";

import prompt_ from 'prompt-sync';
import {getConfigObject} from "./getConfigSchema";
const prompt = prompt_();

function runtimeConfigAsString(configObject) {
    const fileStart = `/**
 * Configuration template file to bind specific properties from user-config.js to environment variables.
 *
 * This object MUST be structurally identical to the standard user-config.sample.js file.
 * Each value MUST start with the $VITE_ prefix and SHOULD be followed by their path, e.g.
 *
 * api: { baseUrl: '$VITE_API_BASE_URL' }
 *
 * Their corresponding environment variable keys MUST equal that value without the $ character, e.g.
 *
 * VITE_API_BASE_URL: '/base'
 */
 
export default `;

    const fileBody = JSON.stringify(configObject || getConfigObject(), null, 2);

    const fileEnd = `;`;

    return fileStart + fileBody + fileEnd;
}

export function writeRuntimeConfig(filePath: string, config) {
    fs.writeFileSync(filePath, config);
    console.log("Created", filePath);
}

export function createRuntimeConfig(workspaceName) {
    const configObject = getConfigObject();
    const config = runtimeConfigAsString(configObject);
    if (workspaceName) {
        pathByWorkspaceName(workspaceName).then(filePath => createSingleRuntimeConfig(filePath, configObject, config));
    } else {
        doForApps((file: string, stats: Stats, folder: string) => {
            // createSingleRuntimeConfig(`${folder}/${file}`, configObject, config)
            writeRuntimeConfig(`${folder}/${file}/config/runtime-config.js`, config);
        });
    }
}

function createSingleRuntimeConfig(filePath, configObject, config) {
    console.log('\x1b[32m');
    console.log("============================================================");
    console.log(" Updating runtime-config for", filePath);
    console.log("============================================================\n");
    const configFilePath = `${filePath}/config/runtime-config.js`
    import("../../" + configFilePath).then(({default: oldConfig}) => {
        compareObjects(oldConfig, configObject,"missing", "\x1b[33m Not in in official schema:");
        compareObjects(configObject, oldConfig, "missing", "\x1b[31m Missing in app's runtime-config:");
        compareObjects(configObject, oldConfig, "difference", "", "\x1b[35m Key changed (app value --> official schema value):");
        console.log('\x1b[0m');

        const result = prompt("Update app's runtime-config? (y/n) ")

        const r = result.toLowerCase().trim();
        if (r === "y") {
            console.log("Writing file.")
            writeRuntimeConfig(configFilePath, config);
        } else {
            console.log("Aborted runtime-config file generation.")
        }
    });
}

createRuntimeConfig(process.argv[2]);

//////////////////////////////////////////////////////////
// Following are ways to compare the objects created    //
// automatically by the Zod configuration with the      //
// existing runtime-config-js in vanilla-piveau-hub-ui: //
//////////////////////////////////////////////////////////

function compareObjects(source: object, comparison: object, mode: string = "all",
                        missingPrompt: string = '\x1b[33m MISSING:', changePrompt: string = '\x1b[31m Changed:',
                        path: string[] = []) {
    const keys = Object.keys(source);
    const pathString = path.join(" > ");
    keys.forEach(key => {
        const extendedPathString = pathString + " > " + key;
        const sourceValue = source[key];
        const targetValue = comparison[key];
        if ( ! targetValue) {
            if (mode === "all" || mode === "missing") {
                console.log(missingPrompt, extendedPathString);
            }
        } else if (typeof sourceValue === 'string') {
           if (sourceValue !== targetValue) {
               if (mode === "all" || mode === "difference") {
                   console.log(changePrompt, targetValue + " --> " + sourceValue);
                   // console.log('\x1b[31m', "DIFFERENT: " + extendedPathString + ": " + targetValue + " instead of " + sourceValue);
               }
           }
        } else if (typeof sourceValue === 'object' && typeof targetValue === 'object') {
            compareObjects(sourceValue, targetValue, mode, missingPrompt, changePrompt,[...path, key]);
        }
    });
}
