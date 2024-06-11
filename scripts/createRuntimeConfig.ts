import fs, {Stats} from "fs";

import {configSchema} from "../packages/piveau-hub-ui-modules/lib/configurations/config-schema";
import oldConfig from "../apps/vanilla-piveau-hub-ui/config/runtime-config.js";
import {ZodObject, ZodType, ZodDefault, ZodEffects} from 'zod';
import {pathByWorkspaceName} from "./utils/pathByWorkspaceName";
import {doForApps} from "./utils/doForApp";

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
                entries[key] = "$VITE_" + keyPath + "_"
                    + camelToSnake(key).toUpperCase();
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

function runtimeConfigAsString() {
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

    const fileBody = JSON.stringify(convert(configSchema), null, 2);

    const fileEnd = `;`;

    return fileStart + fileBody + fileEnd;
}

export function writeRuntimeConfig(filePath: string) {
    fs.writeFileSync(filePath, runtimeConfigAsString());
    console.log("Created", filePath);
}

export function createRuntimeConfig(workspaceName) {
    if (workspaceName) {
        pathByWorkspaceName(workspaceName).then((filePath) => {
            writeRuntimeConfig(`${filePath}/config/runtime-config2.js`);
        });
    } else {
        doForApps((file: string, stats: Stats, folder: string) => {
            writeRuntimeConfig(`${folder}/${file}/config/runtime-config2.js`);
        });
    }
}

// createRuntimeConfig(process.argv[2]);


//////////////////////////////////////////////////////////
// Following are ways to compare the objects created    //
// automatically by the Zod configuration with the      //
// existing runtime-config-js in vanilla-piveau-hub-ui: //
//////////////////////////////////////////////////////////


let count = 1;

function compareObjects(source: object, comparison: object, mode: string = "all", path: string[] = []) {
    const keys = Object.keys(source);
    const pathString = path.join(" > ");
    keys.forEach(key => {
        const extendedPathString = pathString + " > " + key;
        const sourceValue = source[key];
        const targetValue = comparison[key];
        if ( ! targetValue) {
            if (mode === "all" || mode === "missing") {
                console.log('\x1b[33m', "MISSING: " + extendedPathString);
            }
        } else if (typeof sourceValue === 'string') {
           if (sourceValue !== targetValue) {
               if (mode === "all" || mode === "difference") {
                   console.log('\x1b[31m', "DIFFERENT: " + extendedPathString + ": " + targetValue + " instead of " + sourceValue);
               }
           }
        } else if (typeof sourceValue === 'object' && typeof targetValue === 'object') {
            compareObjects(sourceValue, targetValue, mode, [...path, key]);
        }
    });
}
// compareObjects(convert(configSchema), oldConfig, "missing");
// compareObjects(convert(configSchema), oldConfig, "difference");
compareObjects(oldConfig, convert(configSchema), "missing");
// compareObjects(oldConfig, convert(configSchema), "difference");
