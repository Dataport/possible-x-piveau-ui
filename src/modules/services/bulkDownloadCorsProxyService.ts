// @ts-nocheck
/**
 * Vue plugin that exposes a http client based on Axios,
 * which proxies client requests to a given CORS proxy service
 */

import axios from 'axios';

const BulkDownloadAxiosInstance = {
  install(Vue, glueConfig, corsproxyUrl = '') {
    // Create a modified axios instance such that its API
    // works just as if requests are called without proxy
    const bulkDownloadAxiosInstance = axios.create();

    // ensure MAX_REQUESTS_COUNT connections
    let PENDING_REQUESTS = 0;
    bulkDownloadAxiosInstance.interceptors.request.use(config => new Promise((resolve) => {
      const interval = setInterval(() => {
        if (PENDING_REQUESTS < glueConfig.datasetDetails.bulkDownload.MAX_REQUESTS_COUNT) {
          PENDING_REQUESTS += 1;
          clearInterval(interval);
          resolve(config);
        }
      }, glueConfig.datasetDetails.bulkDownload.INTERVAL_MS);
    }));

    bulkDownloadAxiosInstance.interceptors.response.use((response) => {
      PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
      return Promise.resolve(response);
    }, (error) => {
      PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
      return Promise.reject(error);
    });

    // If corsproxyUrl is not given, just provide unmodified axios client
    // to pass requests as-is
    if (corsproxyUrl) {
      const hasTrailingSlash = corsproxyUrl.substr(-1) === '/' || !corsproxyUrl;
      const normalizedCorsproxyUrl = hasTrailingSlash
        ? corsproxyUrl
        : `${corsproxyUrl}/`;

      bulkDownloadAxiosInstance.interceptors.request.use((config) => {
        const requestedUri = axios.getUri({
          url: config.url,
          params: {
            ...config.params,
          },
        });

        const modifiedConfig = { ...config };
        modifiedConfig.url = normalizedCorsproxyUrl;
        modifiedConfig.params = {
          uri: requestedUri,
        };
        return modifiedConfig;
      });
    }

    Vue.prototype.$bulkDownloadAxiosInstance = bulkDownloadAxiosInstance; // eslint-disable-line
  },
};

export default BulkDownloadAxiosInstance;
