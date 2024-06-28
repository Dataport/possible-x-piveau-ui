import {configSchema} from "../../packages/piveau-hub-ui-modules/lib/configurations/config-schema";
import {ZodObject, ZodType, ZodDefault, ZodEffects} from 'zod';

export function getConfigSchema() {
    return configSchema;
}

let configObject = null;

export function getConfigObject() {
    if ( ! configObject) {
        configObject = convert(configSchema);
    }
    return configObject;
}

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
        return {...z.shape}; // Avoid side-effects on z by creating a new object!
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
export function convert(z: ZodType, keyPath: string = '') {
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
