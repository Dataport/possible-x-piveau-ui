# Migration Guide (v2.0.0)

To make use of the new configuration file in your projects piveau-hub-ui, apply the following changes:

### 1. Copy the user configuration into your projects piveau-hub-ui `user-config.sample.js` (and also into `user-config.js`).

<details>
<summary>user-config.sample.js</summary>

```js
import {
  uploadService,
  datasetService,
  catalogService,
  gazetteerService
} from '@piveau/piveau-hub-ui-modules';

import i18n from './i18n';

// export const ecStyle = true;
export const ecStyle = false;

const glueConfig = {
  api: {
    baseUrl: 'https://data.europa.eu/api/hub/search/',
    // baseUrl: 'https://ppe.data.europa.eu/api/hub/search/',
    // baseUrl: 'https://piveau-hub-search-data-europa-eu.apps.osc.fokus.fraunhofer.de/',

    hubUrl: 'https://data.europa.eu/api/hub/repo/',
    // hubUrl: 'https://ppe.data.europa.eu/api/hub/repo/',
    // hubUrl: 'https://piveau-hub-repo-data-europa-eu.apps.osc.fokus.fraunhofer.de/',

    qualityBaseUrl: 'https://data.europa.eu/api/mqa/cache/',
    // qualityBaseUrl: 'https://ppe.data.europa.eu/api/mqa/cache/',
    // qualityBaseUrl: 'https://piveau-metrics-cache-data-europa-eu.apps.osc.fokus.fraunhofer.de/',

    similarityBaseUrl: 'https://data.europa.eu/api/similarities/',
    // similarityBaseUrl: 'https://ppe.data.europa.eu/api/similarities/',
    // similarityBaseUrl: 'https://piveau-metrics-dataset-similarities-data-europa-eu.apps.osc.fokus.fraunhofer.de/',

    fileUploadUrl: 'https://data.europa.eu/api/hub/store/',
    // fileUploadUrl: 'https://ppe.data.europa.eu/api/hub/store/',
    // fileUploadUrl: 'https://piveau-hub-store-data-europa-eu.apps.osc.fokus.fraunhofer.de/',

    sparqlUrl: 'https://data.europa.eu/sparql',
    gazetteerBaseUrl: 'https://data.europa.eu/api/hub/search/gazetteer/',
    catalogBaseUrl: 'https://europeandataportal.eu/',
    vueAppCorsproxyApiUrl: 'https://piveau-corsproxy-piveau.apps.osc.fokus.fraunhofer.de',
  },
  authentication: {
    useService: true, 
    login: {
      useLogin: true,

      loginTitle: 'Login',
      loginURL: '/login',
      loginRedirectUri: '/',
      
      logoutTitle: 'Logout',
      logoutURL: '/logout',
      logoutRedirectUri: '/',
    },
    keycloak: {
      realm: 'piveau',
      clientId: 'piveau-hub-ui',
      url: 'https://keycloak-piveau.apps.osc.fokus.fraunhofer.de/auth',

      // TODO: Do we need to include these properties? They seem to be default values that never change #2763
      'ssl-required': 'external',
      'public-client': true, 
      'verify-token-audience': true, 
      'use-resource-role-mappings': true, 
      'confidential-port': 0, 
    },
    rtp: {
      grand_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
      audience: 'piveau-hub-repo',
    },
    authToken: '',
  },
  routing: {
    routerOptions: {
      base: '/', // TODO: Include piveau-header-footer instead of deu-header-footer to make test app working with default base path #2765
      mode: 'history',
    },
    navigation: { 
      showSparql: false,
    },
    pagination: {
      usePagination: true,
      usePaginationArrows: true,
      useItemsPerPage: true,
      defaultItemsPerPage: 10, // TODO: Make use of this property #2764
      defaultItemsPerPageOptions: [5, 10, 25, 50], 
    },
  },
  metadata: {
    title: 'piveau Hub-UI',
    description: 'A modern and customizable web application for data management of extensive data catalogs.',
    keywords: 'Open Data',
  },
  content: {
    datasets: {
      useSort: true,
      useFeed: true, 
      useCatalogs: true,
      followKeywordLinks: 'nofollow',
      maxKeywordLength: 15, 
      facets: {
        useDatasetFacets: true,
        useDatasetFacetsMap: true,
        showClearButton: false, 
        showFacetsTitle: false, 
        cutoff: 5 ,
        MIN_FACET_LIMIT: 10, 
        MAX_FACET_LIMIT: 50, 
        FACET_OPERATORS: Object.freeze({ or: 'OR', and: 'AND' }), 
        FACET_GROUP_OPERATORS: Object.freeze({ or: 'OR', and: 'AND' }), 
        defaultFacetOrder: ['publisher', 'format', 'catalog', 'categories', 'keywords', 'dataScope', 'country', 'dataServices', 'scoring', 'license'], 
        scoringFacets: {
          useScoringFacets: true, // TODO: Make use of this property #2764
          defaultScoringFacets: { 
            excellentScoring: {
              id: 'excellentScoring',
              title: 'Excellent',
              count: 0,
              minScoring: 351,
              maxScoring: 405,
            },
            goodScoring: {
              id: 'goodScoring',
              title: 'Good',
              count: 0,
              minScoring: 221,
              maxScoring: 350,
            },
            sufficientScoring: {
              id: 'sufficientScoring',
              title: 'Sufficient',
              count: 0,
              minScoring: 121,
              maxScoring: 220,
            },
            badScoring: {
              id: 'badScoring',
              title: 'Any',
              count: 0,
              minScoring: 0,
              maxScoring: 120,
            },
          },
        },
      },
    },
    catalogs: { 
      useSort: true, // TODO: Make use of this property #2764
      useCatalogCountries: true,
      defaultCatalogImagePath: '/flags',
      defaultCatalogCountryID: 'eu',
      defaultCatalogID: 'european-union-open-data-portal',
      facets: {
        useCatalogFacets: true,
        showClearButton: false,
        showFacetsTitle: false,
        cutoff: 5,
        MIN_FACET_LIMIT: 50,
        MAX_FACET_LIMIT: 100,
        FACET_OPERATORS: Object.freeze({ or: 'OR', and: 'AND' }),
        FACET_GROUP_OPERATORS: Object.freeze({ or: 'OR', and: 'AND' }),
        defaultFacetOrder: ['country'],
      },
    },
    datasetDetails: { 
      header: {
        navigation: "top",
        hidePublisher: false,
        hideDate: false
      },
      keywords: {
        showTitle: false
      },
      description: {
        enableMarkdownInterpretation: true,
      },
      distributions: {
        displayAll: false,
        displayCount: 7,
        incrementSteps: [10, 50],
        descriptionMaxLines: 3,
        descriptionMaxChars: 250,
        showValidationButton: false, // TODO: Make use of this property #2764
      },
      pages: {
        isVisible: false,
        displayAll: false,
        displayCount: 7,
        incrementSteps: [10, 50],
        descriptionMaxLines: 3,
        descriptionMaxChars: 250,
      },
      visualisations: {
        isVisible: false,
        displayAll: false,
        displayCount: 7,
        incrementSteps: [10, 50],
        descriptionMaxLines: 3,
        descriptionMaxChars: 250,
      },
      dataServices: {
        isVisible: false,
        displayAll: false,
        displayCount: 7,
        incrementSteps: [10, 50],
        descriptionMaxLines: 3,
        descriptionMaxChars: 250,
      },
      isUsedBy: {
        isVisible: false,
      },
      relatedResources: {
        isVisible: false,
      },
      bulkDownload: {
        buttonPosition: "top",
        MAX_FILE_TITLE_LENGTH: 80,
        MAX_REQUESTS_COUNT: 5, // TODO: Make use of this property #2764
        INTERVAL_MS: 10, // TODO: Make use of this property #2764
        TIMEOUT_MS: 10000,
      },
      quality: {
        displayAll: false,
        numberOfDisplayedQualityDistributions: 5,
        csvLinter: {
          enable: true,
          displayAll: false,
          numberOfDisplayedValidationResults: 5,
        },
      }
    },
    maps: { 
      mapVisible: true,
      useAnimation: true,
      location: [[52.526, 13.314], 10],
      spatialType: 'Point',
      height: '400px',
      width: '100%',
      mapContainerId: 'mapid',
      urlTemplate: 'https://gisco-services.ec.europa.eu/maps/wmts/1.0.0/WMTSCapabilities.xml/wmts/OSMCartoComposite/EPSG3857/{z}/{x}/{y}.png',
      geoBoundsId: 'ds-search-bounds',
      sender: {
        startBounds: [[34.5970, -9.8437], [71.4691, 41.4843]],
        height: '200px',
        width: '100%',
        mapContainerId: 'modalMap',
      },
      receiver: {
        startBounds: [[34.5970, -9.8437], [71.4691, 41.4843]],
        height: '250px',
        width: '100%',
        mapContainerId: 'mapid',
        attributionPosition: 'topright',
      },
      options: {
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoiZmFiaWFwZmVsa2VybiIsImEiOiJja2x3MzlvZ3UwNG85MnBseXJ6aGI2MHdkIn0.bFs2g4bPMYULlvDSVsetJg',
        attribution: '&copy; <a href="https://ec.europa.eu/eurostat/web/gisco/">Eurostat - GISCO</a>',
      },
      mapStyle: {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 0.5,
        weight: 2,
        radius: 1,
      },
    },
    dataProviderInterface: {
      useService: true,
      basePath: '/dpi',
      buttons: {
        Dataset: true,
        Catalogue: false, 
      },
      doiRegistrationService: { 
        persistentIdentifierType: 'eu-ra-doi',
      },
    },
  },
  languages: {
    useLanguageSelector: true, // TODO: Make use of this property by passing it to the Header-Footer in App.vue #2766
    locale: 'en',
    fallbackLocale: 'en',
  },
  services: {
    datasetService,
    catalogService,
    uploadService,
    gazetteerService,
  },
  themes: {
    header: 'dark',
  },
  tracker: {
    // TODO: Implement disable tracker option based on condition #2767
    isPiwikPro: true, // true: PiwikPro | false: Matomo
    siteId: 'fed9dbb7-42d1-4ebc-a8bf-3c0b8fd03e09',
    trackerUrl: 'https://opanalytics.containers.piwik.pro/'
  },
};

export { glueConfig, i18n };
```
</details>
<br>

### 2. Copy the runtime configuration into your projects piveau-hub-ui `runtime-config.js`.

<details>
<summary>runtime-config.js</summary>

```js
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

export default {
  api: {
    baseUrl: "$VUE_APP_API_BASE_URL",
    hubUrl: "$VUE_APP_API_HUB_URL",
    qualityBaseUrl: "$VUE_APP_API_QUALITY_BASE_URL",
    similarityBaseUrl: "$VUE_APP_API_SIMILARITY_BASE_URL",
    fileUploadUrl: '$VUE_APP_FILEUPLOAD_URL',
    sparqlUrl: '$VUE_APP_SPARQL_URL',
    gazetteerBaseUrl: "$VUE_APP_API_GAZETTEER_BASE_URL",
    catalogBaseUrl: "$VUE_APP_API_CATALOG_BASE_URL",
    vueAppCorsproxyApiUrl: "$VUE_APP_CORSPROXY_API_URL",
  },
  authentication: {
    useService: "$VUE_APP_AUTHENTICATION_USE_SERVICE",
    login: {
      useLogin: "$VUE_APP_AUTHENTICATION_LOGIN_USE_LOGIN",
    },
    keycloak: {
      realm: "$VUE_APP_AUTHENTICATION_KEYCLOAK_REALM",
      url: "$VUE_APP_AUTHENTICATION_KEYCLOAK_URL",
      "ssl-required": "$VUE_APP_AUTHENTICATION_KEYCLOAK_SSL_REQUIRED",
      clientId: "$VUE_APP_AUTHENTICATION_KEYCLOAK_CLIENT_ID",
      "public-client": "$VUE_APP_AUTHENTICATION_KEYCLOAK_PUBLIC_CLIENT",
      "verify-token-audience": "$VUE_APP_AUTHENTICATION_KEYCLOAK_VERIFY_TOKEN_AUDIENCE",
      "use-resource-role-mappings": "$VUE_APP_AUTHENTICATION_KEYCLOAK_USE_RESOURCE_ROLE_MAPPINGS",
      "confidential-port": "$VUE_APP_AUTHENTICATION_KEYCLOAK_CONFIDENTIAL_PORT"
    },
    rtp: {
      grand_type: "$VUE_APP_AUTHENTICATION_RTP_GRAND_TYPE",
      audience: "$VUE_APP_AUTHENTICATION_RTP_AUDIENCE"
    },
    authToken: "$VUE_APP_AUTHENTICATION_AUTH_TOKEN",
  },
  routing: {
    routerOptions: {
      base: "$VUE_APP_ROUTING_ROUTER_OPTIONS_BASE",
      mode: "$VUE_APP_ROUTING_ROUTER_OPTIONS_MODE"
    },
    navigation: {
      showSparql: "$VUE_APP_ROUTING_NAVIGATION_SHOW_SPARQL"
    }
  },
  metadata: {
    title: "$VUE_APP_METADATA_TITLE",
    description: "$VUE_APP_METADATA_DESCRIPTION",
    keywords: "$VUE_APP_METADATA_KEYWORDS",
  },
  content: {
    datasets: {
      facets: {
        useDatasetFacetsMap: "$VUE_APP_CONTENT_DATASETS_FACETS_USE_DATASET_FACETS_MAP",
        cutoff: "$VUE_APP_CONTENT_DATASETS_FACETS_CUTOFF",
        showClearButton: "$VUE_APP_CONTENT_DATASETS_FACETS_SHOW_CLEAR_BUTTON",
        showFacetsTitle: "$VUE_APP_CONTENT_DATASETS_FACETS_SHOW_FACETS_TITLE"
      }
    },
    catalogs: {
      facets: {
        useDatasetFacetsMap: "$VUE_APP_CONTENT_CATALOGS_FACETS_USE_DATASET_FACETS_MAP",
        cutoff: "$VUE_APP_CONTENT_CATALOGS_FACETS_CUTOFF",
        showClearButton: "$VUE_APP_CONTENT_CATALOGS_FACETS_SHOW_CLEAR_BUTTON",
        showFacetsTitle: "$VUE_APP_CONTENT_CATALOGS_FACETS_SHOW_FACETS_TITLE"
      }
    },
    datasetDetails: {
      header: {
        navigation: "$VUE_APP_CONTENT_DATASETDETAILS_HEADER_NAVIGATION",
        hidePublisher: "$VUE_APP_CONTENT_DATASETDETAILS_HEADER_HIDE_PUBLISHER",
        hideDate: "$VUE_APP_CONTENT_DATASETDETAILS_HEADER_HIDE_DATE"
      },
      keywords: {
        showTitle: "$VUE_APP_CONTENT_DATASETDETAILS_KEYWORDS_SHOW_TITLE"
      },
      description: {
        enableMarkdownInterpretation: "$VUE_APP_CONTENT_DATASETDETAILS_DESCRIPTION_ENABLE_MARKDOWN_INTERPRETATION"
      },
      distributions: {
        displayAll: "$VUE_APP_CONTENT_DATASETDETAILS_DISTRIBUTIONS_DISPLAY_ALL",
        displayCount: "$VUE_APP_CONTENT_DATASETDETAILS_DISTRIBUTIONS_DISPLAY_COUNT",
        incrementSteps: "$VUE_APP_CONTENT_DATASETDETAILS_DISTRIBUTIONS_INCREMENT_STEPS",
        descriptionMaxLines: "$VUE_APP_CONTENT_DATASETDETAILS_DISTRIBUTIONS_DESCRIPTION_MAX_LINES",
        descriptionMaxChars: "$VUE_APP_CONTENT_DATASETDETAILS_DISTRIBUTIONS_DESCRIPTION_MAX_CHARS",
        showValidationButton: "$VUE_APP_CONTENT_DATASETDETAILS_DISTRIBUTIONS_SHOW_VALIDATION_BUTTON",
      },
      pages: {
        isVisible: "$VUE_APP_CONTENT_DATASETDETAILS_PAGES_IS_VISIBLE",
        displayAll: "$VUE_APP_CONTENT_DATASETDETAILS_PAGES_DISPLAY_ALL",
        displayCount: "$VUE_APP_CONTENT_DATASETDETAILS_PAGES_DISPLAY_COUNT",
        incrementSteps: "$VUE_APP_CONTENT_DATASETDETAILS_PAGES_INCREMENT_STEPS",
        descriptionMaxLines: "$VUE_APP_CONTENT_DATASETDETAILS_PAGES_DESCRIPTION_MAX_LINES",
        descriptionMaxChars: "$VUE_APP_CONTENT_DATASETDETAILS_PAGES_DESCRIPTION_MAX_CHARS",
      },
      visualisations: {
        isVisible: "$VUE_APP_CONTENT_DATASETDETAILS_VISUALISATIONS_IS_VISIBLE",
        displayAll: "$VUE_APP_CONTENT_DATASETDETAILS_VISUALISATIONS_DISPLAY_ALL",
        displayCount: "$VUE_APP_CONTENT_DATASETDETAILS_VISUALISATIONS_DISPLAY_COUNT",
        incrementSteps: "$VUE_APP_CONTENT_DATASETDETAILS_VISUALISATIONS_INCREMENT_STEPS",
        descriptionMaxLines: "$VUE_APP_CONTENT_DATASETDETAILS_VISUALISATIONS_DESCRIPTION_MAX_LINES",
        descriptionMaxChars: "$VUE_APP_CONTENT_DATASETDETAILS_VISUALISATIONS_DESCRIPTION_MAX_CHARS",
      },
      bulkDownload: {
        buttonPosition: "$VUE_APP_CONTENT_DATASETDETAILS_BULKDOWNLOAD_BUTTON_POSITION",
        MAX_FILE_TITLE_LENGTH: "$VUE_APP_CONTENT_DATASETDETAILS_BULKDOWNLOAD_MAX_FILE_TITLE_LENGTH",
        MAX_REQUESTS_COUNT: "$VUE_APP_CONTENT_DATASETDETAILS_BULKDOWNLOAD_MAX_REQUESTS_COUNT",
        INTERVAL_MS: "$VUE_APP_CONTENT_DATASETDETAILS_BULKDOWNLOAD_INTERVAL_MS",
        TIMEOUT_MS: "$VUE_APP_CONTENT_DATASETDETAILS_BULKDOWNLOAD_TIMEOUT_MS",
      },
    },
    maps: {
      useAnimation: "$VUE_APP_CONTENT_MAPS_USE_ANIMATION",
      urlTemplate: "$VUE_APP_CONTENT_MAPS_URL_TEMPLATE",
      options: {
        id: "$VUE_APP_CONTENT_MAPS_OPTIONS_ID",
        accessToken: "$VUE_APP_CONTENT_MAPS_OPTIONS_ACCESS_TOKEN",
        attribution: "$VUE_APP_CONTENT_MAPS_OPTIONS_ATTRIBUTION"
      },
      location: "$VUE_APP_CONTENT_MAPS_LOCATION",
      spatialType: "$VUE_APP_CONTENT_MAPS_SPATIAL_TYPE",
      height: "$VUE_APP_CONTENT_MAPS_HEIGHT",
      width: "$VUE_APP_CONTENT_MAPS_WIDTH",
      mapContainerId: "$VUE_APP_CONTENT_MAPS_MAP_CONTAINER_ID",
      mapStyle: {
        color: "$VUE_APP_CONTENT_MAPS_MAP_STYLE_COLOR",
        fillColor: "$VUE_APP_CONTENT_MAPS_MAP_STYLE_FILL_COLOR",
        fillOpacity: "$VUE_APP_CONTENT_MAPS_MAP_STYLE_FILL_OPACITY",
        weight: "$VUE_APP_CONTENT_MAPS_MAP_STYLE_WEIGHT",
        radius: "$VUE_APP_CONTENT_MAPS_MAP_STYLE_RADIUS",
      },
      sender: {
        startBounds: "$VUE_APP_CONTENT_MAPS_SENDER_START_BOUNDS",
        height: "$VUE_APP_CONTENT_MAPS_SENDER_HEIGHT",
        width: "$VUE_APP_CONTENT_MAPS_SENDER_WIDTH",
        mapContainerId: "$VUE_APP_CONTENT_MAPS_SENDER_MAP_CONTAINER_ID",
      },
      receiver: {
        startBounds: "$VUE_APP_CONTENT_MAPS_RECEIVER_START_BOUNDS",
        height: "$VUE_APP_CONTENT_MAPS_RECEIVER_HEIGHT",
        width: "$VUE_APP_CONTENT_MAPS_RECEIVER_WIDTH",
        mapContainerId: "$VUE_APP_CONTENT_MAPS_RECEIVER_MAP_CONTAINER_ID",
        attributionPosition: "$VUE_APP_CONTENT_MAPS_RECEIVER_ATTRIBUTION_POSITION",
      },
    },
    dataProviderInterface: {
      useService: "$VUE_APP_CONTENT_DATA_PROVIDER_INTERFACE_USE_SERVICE",
      basePath: "$VUE_APP_CONTENT_DATA_PROVIDER_INTERFACE_BASE_PATH",
      buttons: {
        Dataset: "$VUE_APP_CONTENT_DATA_PROVIDER_INTERFACE_BUTTONS_DATASET",
        Catalogue: "$VUE_APP_CONTENT_DATA_PROVIDER_INTERFACE_BUTTONS_CATALOGUE"
      },
      doiRegistrationService: {
        persistentIdentifierType: "$VUE_APP_CONTENT_DATA_PROVIDER_INTERFACE_DOI_REGISTRATION_SERVICE_PERSISTENT_IDENTIFIER_TYPE",
      },
    }, 
  },
  languages: {
    useLanguageSelector: "$VUE_APP_LANGUAGES_USE_LANGUAGE_SELECTOR",
    locale: "$VUE_APP_LANGUAGES_LOCALE",
    fallbackLocale: "$VUE_APP_LANGUAGES_FALLBACK_LOCALE"
  },
  tracker: {
    isPiwikPro: '$VUE_APP_TRACKER_IS_PIWIK_PRO',
    siteId: '$VUE_APP_TRACKER_SITE_ID',
    trackerUrl: '$VUE_APP_TRACKER_TRACKER_URL'
  },
}
```
</details>
<br>

### 3. Apply changes from `runtime-config.js` to your projects `Environment variables`.

<br>

### 4. In `package.json` make use of the latest v2 release of piveau-hub-ui-modules:

```js
"@piveau/piveau-hub-ui-modules": "2.0.12"
```

### 5. Update usages of the adjusted configuration values

**Note:** _If the piveau-hub-ui user configuration of your project was extended with new values before upgrading to version 2.0.0 of the piveau-hub-ui-modules, additional changes may be required that are not listed in this migration guide!_

<br>

#### In main.ts change:

| Old Value | New Value |
| ------    | ------    |
| keycloak: `env.keycloak` | keycloak: `env.authentication.keycloak` |
| rtp: `env.rtp` | rtp: `env.authentication.rtp` |
| useAuthService: `env.useAuthService` | useAuthService: `env.authentication.useService` |
| authToken: `env.api.authToken` | authToken: `env.authentication.authToken` |
| defaultScoringFacets: `env.datasets.facets.scoringFacets.defaultScoringFacets` | defaultScoringFacets: `env.content.datasets.facets.scoringFacets.defaultScoringFacets` |

| Old Value | New Value |
| ------    | ------    |
| rtp: `env.rtp` |rtp: `env.authentication.rtp` |
| `...env.keycloak` | `...env.authentication.keycloak` |

| Old Value | New Value |
| ------    | ------    |
| `!env.useAuthService` | `!env.authentication.useService` |

<br>

#### In App.vue change: 

| Old Value | New Value |
| ------    | ------    |
| `this.$env.title` | `this.$env.metadata.title` |
| `this.$env.keywords` | `this.$env.metadata.keywords` |
| `this.$env.navigation.top.main.data.sparql.show` | `this.$env.routing.navigation.showSparql` |
| `this.$env?.useAuthService` | `this.$env?.authentication?.useService` |
| `this.$env.keycloak?.enableLogin` | `this.$env.authentication?.login?.useLogin` |

<br>

#### In router.js change: 

| Old Value | New Value |
| ------    | ------    |
| `GLUE_CONFIG.title` | `GLUE_CONFIG.metadata.title` |
| `GLUE_CONFIG.routerOptions.mode` | `GLUE_CONFIG.routing.routerOptions.mode` |
| `GLUE_CONFIG.upload.useUpload` | `GLUE_CONFIG.content.dataProviderInterface.useService` |
| `GLUE_CONFIG.routerOptions.base` | `GLUE_CONFIG.routing.routerOptions.base` |
| `router.app.$env.useAuthService` | `router.app.$env.authentication.useService` |
