/**
 * Configuration template file to bind specific properties from user-config.js to environment variables.
 * 
 * This object MUST be structurally identical to the standard user-config.sample.js file.
 * Each value MUST start with the $VUE_APP_ prefix and SHOULD be followed by their path, e.g. 
 * 
 * api: { baseUrl: '$VUE_APP_API_BASE_URL' }
 * 
 * Their corresponding environment variable keys MUST equal that value without the $ character, e.g.
 * 
 * VUE_APP_API_BASE_URL: '/base'
 */

export default {}
