import fs, {Stats} from "fs";

import {configSchema} from "../packages/piveau-hub-ui-modules/lib/configurations/config-schema";
// import oldConfig from "../apps/vanilla-piveau-hub-ui/config/runtime-config.js";
// import oldConfig from "../local/deu-piveau-hub-ui/runtime-config_old.js";
// import oldConfig from "../local/deu-piveau-hub-ui/config/runtime-config.js";
import {ZodObject, ZodType, ZodDefault, ZodEffects} from 'zod';
import {pathByWorkspaceName} from "./utils/pathByWorkspaceName";
import {doForApps} from "./utils/doForApp";

import prompt_ from 'prompt-sync';
const prompt = prompt_();

// import readline_ from "readline";
// const readline = readline_.createInterface({ input: process.stdin, output: process.stdout });
// const prompt = (query) => new Promise((resolve) => readline.question(query, resolve));
// readline.on('close', () => process.exit(0));

/**
 * Turns a Zod object into a regular Javascript key-value object where the values are still Zod objects
 * @param z
 */
function getShape(z: ZodType) {
    if (z instanceof ZodDefault) {
        return getShape(z._def.innerType);
    } else if (z instanceof ZodEffects) {
        return getShape(z._def.schema);
    } else if (z instanceof ZodObject) {
        return z.shape;
    } else {
        return null;
    }
}

/**
 * Recursively turns a Zod object into a regular Javascript key-value object, where the values
 * are strings that have the special shape to start with "$VITE_" and then chaining the keys
 * path in upper case separated by underscores.
 * @param z
 * @param keyPath
 */
function convert(z: ZodType, keyPath: string = '') {
    const entries = getShape(z);
    if (entries instanceof Object) {
        for (const [key, value] of Object.entries(entries)) {
            const extendedKeyPath = keyPath === '' ? camelToSnake(key).toUpperCase() : keyPath + '_' + camelToSnake(key).toUpperCase();
            const convertedValue = convert(value as ZodType, extendedKeyPath);
            if (convertedValue === null) {
                entries[key] = ("$VITE_" + keyPath + "_"
                    + camelToSnake(key).toUpperCase()).replace(/-/g, "_");
            } else {
                entries[key] = convertedValue;
            }
        }
        return entries;
    } else {
        return null;
    }
}

function camelToSnake(s: string): string {
    return s.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (sub, arg) => (arg ? "_" : "") + sub).toLowerCase();
}

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

    const fileBody = JSON.stringify(configObject || convert(configSchema), null, 2);

    const fileEnd = `;`;

    return fileStart + fileBody + fileEnd;
}

export function writeRuntimeConfig(filePath: string, config) {
    fs.writeFileSync(filePath, config);
    console.log("Created", filePath);
}

export function createRuntimeConfig(workspaceName) {
    const configObject = convert(configSchema);
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
    import("../" + configFilePath).then(({default: oldConfig}) => {
        compareObjects(oldConfig, configObject,"missing", "\x1b[33m Not in in official schema:");
        compareObjects(configObject, oldConfig, "missing", "\x1b[31m Missing in app's runtime-config:");
        compareObjects(configObject, oldConfig, "difference", "", "\x1b[35m Key changed (app value --> official schema value):");
        console.log('\x1b[0m');

        const result = prompt("Generate and overwrite runtime-config? (y/n) ")

        const r = result.toLowerCase().trim();
        if (r === "y") {
            console.log("Writing file.")
            // writeRuntimeConfig(configFilePath, config);
        } else {
            console.log("Aborting runtime-config file generation.")
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
