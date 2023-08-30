// @ts-nocheck
/**
 * Vue.js plugin to consume configurations using environment variables
 */

import merge from 'merge-anything';
import { configSchema, type ResolvedConfig } from '../configurations/config-schema';
// The configuration object that contains symbols for overwriting during runtime
// import config from '../../config/runtime-config';

declare module 'vue/types/vue' {
  interface Vue {
    $env: ResolvedConfig;
  }
}

// Takes a base configuration (e.g., process.env) and a runtime configuration
// and merges the runtime configuration over the base configuration to overwrite it.
// Overwritten values are always of type string. Pass an empty string to model a falsy value.
const RuntimeConfiguration = {
  install(Vue, runtimeConfig, options = {}) {
    const defaultOptions = {
      debug: true,
      baseConfig: process.env,
      useExperimentalRuntimeParser: false,
    };
    const opts = Object.assign({}, defaultOptions, options);

    // Custom merge rule to ignore values that start with $VUE_APP_
    // i.e., use this.$env property when environment variable is not set
    const ignoreUnusedVariables = (originVal, newVal) => {
      const result = newVal;

      // TODO: 1. Evaluate Arrays
      if (newVal.startsWith('[') && newVal.endsWith(']')) {
        // This looks like an array
        // Use JSON.parse to transform it into a real array
        return JSON.parse(newVal);
      }

      // TODO: 2. Evaluate Objects
      if (newVal.startsWith('{') && newVal.endsWith('}')) {
        // This looks like an object
        // Use JSON.parse to transform it into a real object
        return JSON.parse(newVal);
      }

      // 3. Evaluate Boolean values
      if (newVal === 'false') return false;
      if (newVal === 'true') return true;

      // 4. Evaluate undefined values
      // Take originVal when env variable is not set
      if (originVal !== undefined && typeof newVal === 'string') {
        // Environment variable not set (e.g., development env)
        if (newVal.startsWith('$VUE_APP_')) {
          return originVal;
        }
      }

      // Use the new value
      return result;
    };

    const mergeOptions = {
      extensions: [ignoreUnusedVariables],
    };

    const merged = merge(mergeOptions, opts.baseConfig, runtimeConfig);
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

    Vue.prototype.$env = merged; // eslint-disable-line
  },
};

export default RuntimeConfiguration;
