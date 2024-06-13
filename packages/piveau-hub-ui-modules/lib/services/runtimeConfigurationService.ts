// @ts-nocheck
/**
 * Vue.js plugin to consume configurations using environment variables
 */

import { InjectionKey, type App } from 'vue';
import merge from 'merge-anything';
import { configSchema, type ResolvedConfig } from '../configurations/config-schema';
// The configuration object that contains symbols for overwriting during runtime
// import config from '../../config/runtime-config';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $env: ResolvedConfig;
  }
}

export const injectionKey: InjectionKey<ResolvedConfig> = Symbol('runtimeConfig');

// Takes a base configuration (e.g., process.env) and a runtime configuration
// and merges the runtime configuration over the base configuration to overwrite it.
// Overwritten values are always of type string. Pass an empty string to model a falsy value.

const RuntimeConfiguration = {
  install(app: App, runtimeConfig, options = {}) {
    const defaultOptions = {
      debug: true,
      baseConfig: import.meta.env,
      useExperimentalRuntimeParser: false,
    };
    const opts = Object.assign({}, defaultOptions, options);

    // Custom merge rule to ignore values that start with $VITE_
    // i.e., use this.$env property when environment variable is not set
    const ignoreUnusedVariables = (originVal, newVal) => {
      const result = newVal;

      if (typeof newVal === 'string') {

        // 1. Evaluate Arrays
        if (  newVal.startsWith('[') && newVal.endsWith(']')  ) {
          // This looks like an array
          // Use JSON.parse to transform it into a real array
          try {
            JSON.parse(  newVal  );
            return JSON.parse(  newVal  );
          } catch (error) {
            console.error("Invalid JSON, please note that the JSON standard requires double quotes: \n" + newVal );
            console.error(error);
          }

        }

        // 2. Evaluate Objects
        // TODO: Do we need this? It seems that no values are objects
        if ( newVal.startsWith('{') && newVal.endsWith('}')  ) {
          // This looks like an object
          // Use JSON.parse to transform it into a real object
          try {
            JSON.parse(  newVal  );
            return JSON.parse(  newVal  );
          } catch (error) {
            console.error("Invalid JSON, please note that the JSON standard requires double quotes: \n" + newVal );
            console.error(error);
          }

        }

      }

      // 3. Evaluate Boolean values
      if (newVal === 'false') return false;
      if (newVal === 'true') return true;

      // 4. Evaluate undefined values
      // Take originVal when env variable is not set
      if (originVal !== undefined && typeof newVal === 'string') {
        // Environment variable not set (e.g., development env)
        if (newVal.startsWith('$VITE_')) {
          return originVal;
        }
      }

      // Use the new value
      return result;
    };

    const mergeOptions = {
      extensions: [ignoreUnusedVariables],
    };

    const merged = clean(merge(mergeOptions, opts.baseConfig, runtimeConfig));
    if (opts.debug) {
      console.debug(`Runtime configuration = ${JSON.stringify(merged)}`); // eslint-disable-line
    }

    if (opts.useExperimentalRuntimeParser) {
      // Validate the merged configuration
      const { success, error } = configSchema.safeParse(merged)
      if (!success) {
        console.warn('Invalid runtime configuration detected. This application may not run as intended.'); // eslint-disable-line
        console.warn(error); // eslint-disable-line
      }
    }

    app.config.globalProperties.$env = merged; // eslint-disable-line
    app.provide(injectionKey, merged);
  },
};

/**
 * Removes all elements from the config that have a non-replaced runtime-config.js key
 * @param o
 * @param current
 */
function clean(o, current = {}): ResolvedConfig {
  Object.keys(o).forEach(key => {
    const value = o[key];
    if (value?.constructor === Object) {
      current[key] = clean(value);
    } else if (typeof value === 'string' && ! value.startsWith("$VITE_")) {
      current[key] = value;
    } else if (typeof value !== 'string') {
      current[key] = value;
    }
  });
  return current as ResolvedConfig;
}

export default RuntimeConfiguration;
