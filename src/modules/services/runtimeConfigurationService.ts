// @ts-nocheck
/**
 * Vue.js plugin to consume configurations using environment variables
 */

import merge from 'merge-anything';
// The configuration object that contains symbols for overwriting during runtime
// import config from '../../config/runtime-config';

// Takes a base configuration (e.g., process.env) and a runtime configuration
// and merges the runtime configuration over the base configuration to overwrite it.
// Overwritten values are always of type string. Pass an empty string to model a falsy value.
const RuntimeConfiguration = {
  install(Vue, runtimeConfig, options = {}) {
    const defaultOptions = {
      debug: true,
      baseConfig: process.env,
    };
    const opts = Object.assign({}, defaultOptions, options);

    // Custom merge rule to ignore values that start with $VUE_APP_
    // i.e., use this.$env property when environment variable is not set
    const ignoreUnusedVariables = (originVal, newVal) => {
      const result = newVal;
      // Evaluate Boolean Types (Fix Issue https://gitlab.fokus.fraunhofer.de/viaduct/organisation/issues/592)
      if (newVal === 'false') return false;
      if (newVal === 'true') return true;
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

    Vue.prototype.$env = merged; // eslint-disable-line
  },
};

export default RuntimeConfiguration;
