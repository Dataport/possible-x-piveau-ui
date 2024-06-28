import fs, {Stats} from "fs";

import {pathByWorkspaceName} from "../utils/pathByWorkspaceName";
import {doForApps} from "../utils/doForApp";

import prompt_ from 'prompt-sync';
import {getConfigObject} from "./getConfigSchema";
import {checkUserConfig} from "./checkUserConfig";
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
        console.log("Please provide workspace name!")
        // doForApps((file: string, stats: Stats, folder: string) => {
        //     // createSingleRuntimeConfig(`${folder}/${file}`, configObject, config)
        //     writeRuntimeConfig(`${folder}/${file}/config/runtime-config.js`, config);
        // });
    }
}

function createSingleRuntimeConfig(filePath, configObject, config) {
    console.log('\x1b[32m');
    console.log("============================================================");
    console.log(" Updating runtime-config for", filePath);
    console.log("============================================================\n");
    const configFilePath = `${filePath}/config/runtime-config.js`
    import("../../" + configFilePath).then(({default: oldConfig}) => {
        let count = 0;
        count += compareObjects(oldConfig, configObject,"missing", "\x1b[33m Not in in official schema:");
        count += compareObjects(configObject, oldConfig, "missing", "\x1b[31m Missing in app's runtime-config:");
        count += compareObjects(configObject, oldConfig, "difference", "", "\x1b[35m Key changed (app value --> official schema value):");

        if (count > 0) {
            console.log('\x1b[0m', "\n Found", count, "issues\n");
            const result = prompt("Update app's runtime-config? (y/n) ")

            const r = result.toLowerCase().trim();
            if (r === "y") {
                console.log("Writing file.")
                writeRuntimeConfig(configFilePath, config);
            } else {
                console.log("Aborted runtime-config file generation.")
            }
        } else {
            console.log('\x1b[32m', "\u2713  File runtime-config.js is up to date!")
        }
    });
}

await checkUserConfig(process.argv[2]);
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
    let count = 0;
    keys.forEach(key => {
        const extendedPathString = pathString + " > " + key;
        const sourceValue = source[key];
        const targetValue = comparison[key];
        if ( ! targetValue) {
            if (mode === "all" || mode === "missing") {
                console.log(missingPrompt, extendedPathString);
                ++count;
            }
        } else if (typeof sourceValue === 'string') {
           if (sourceValue !== targetValue) {
               if (mode === "all" || mode === "difference") {
                   console.log(changePrompt, targetValue + " --> " + sourceValue);
                   // console.log('\x1b[31m', "DIFFERENT: " + extendedPathString + ": " + targetValue + " instead of " + sourceValue);
                   ++count;
               }
           }
        } else if (typeof sourceValue === 'object' && typeof targetValue === 'object') {
            count += compareObjects(sourceValue, targetValue, mode, missingPrompt, changePrompt,[...path, key]);
        }
    });
    return count;
}
