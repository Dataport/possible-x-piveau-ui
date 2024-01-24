/**
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

export default {
  api: {
    baseUrl: "$VITE_API_BASE_URL",
    hubUrl: "$VITE_API_HUB_URL",
    qualityBaseUrl: "$VITE_API_QUALITY_BASE_URL",
    similarityBaseUrl: "$VITE_API_SIMILARITY_BASE_URL",
    fileUploadUrl: '$VITE_FILE_UPLOAD_URL',
    sparqlUrl: '$VITE_SPARQL_URL',
    gazetteerBaseUrl: "$VITE_API_GAZETTEER_BASE_URL",
    catalogBaseUrl: "$VITE_API_CATALOG_BASE_URL",
    vueAppCorsproxyApiUrl: "$VITE_CORSPROXY_API_URL",
  },
  authentication: {
    useService: "$VITE_AUTHENTICATION_USE_SERVICE",
    login: {
      useLogin: "$VITE_AUTHENTICATION_LOGIN_USE_LOGIN",
      loginTitle: "$VITE_AUTHENTICATION_LOGIN_LOGIN_TITLE",
      loginURL: "$VITE_AUTHENTICATION_LOGIN_LOGIN_URL",
      loginRedirectUri: "$VITE_AUTHENTICATION_LOGIN_LOGIN_REDIRECT_URI",
      logoutTitle: "$VITE_AUTHENTICATION_LOGIN_LOGOUT_TITLE",
      logoutURL: "$VITE_AUTHENTICATION_LOGIN_LOGOUT_URL",
      logoutRedirectUri: "$VITE_AUTHENTICATION_LOGIN_LOGOUT_REDIRECT_URI",
    },
    keycloak: {
      realm: "$VITE_AUTHENTICATION_KEYCLOAK_REALM",
      url: "$VITE_AUTHENTICATION_KEYCLOAK_URL",
      "ssl-required": "$VITE_AUTHENTICATION_KEYCLOAK_SSL_REQUIRED",
      clientId: "$VITE_AUTHENTICATION_KEYCLOAK_CLIENT_ID",
      "public-client": "$VITE_AUTHENTICATION_KEYCLOAK_PUBLIC_CLIENT",
      "verify-token-audience": "$VITE_AUTHENTICATION_KEYCLOAK_VERIFY_TOKEN_AUDIENCE",
      "use-resource-role-mappings": "$VITE_AUTHENTICATION_KEYCLOAK_USE_RESOURCE_ROLE_MAPPINGS",
      "confidential-port": "$VITE_AUTHENTICATION_KEYCLOAK_CONFIDENTIAL_PORT"
    },
    keycloakInit: {
      pkceMethod: "$VITE_AUTHENTICATION_KEYCLOAK_INIT_PKCE_METHOD",
    },
    rtp: {
      grand_type: "$VITE_AUTHENTICATION_RTP_GRAND_TYPE",
      audience: "$VITE_AUTHENTICATION_RTP_AUDIENCE"
    },
    authToken: "$VITE_AUTHENTICATION_AUTH_TOKEN",
  },
  routing: {
    routerOptions: {
      base: "$VITE_ROUTING_ROUTER_OPTIONS_BASE",
      mode: "$VITE_ROUTING_ROUTER_OPTIONS_MODE"
    },
    navigation: {
      showSparql: "$VITE_ROUTING_NAVIGATION_SHOW_SPARQL"
    }
  },
  metadata: {
    title: "$VITE_METADATA_TITLE",
    description: "$VITE_METADATA_DESCRIPTION",
    keywords: "$VITE_METADATA_KEYWORDS",
  },
  content: {
    datasets: {
      facets: {
        useDatasetFacetsMap: "$VITE_CONTENT_DATASETS_FACETS_USE_DATASET_FACETS_MAP",
        cutoff: "$VITE_CONTENT_DATASETS_FACETS_CUTOFF",
        showClearButton: "$VITE_CONTENT_DATASETS_FACETS_SHOW_CLEAR_BUTTON",
        showFacetsTitle: "$VITE_CONTENT_DATASETS_FACETS_SHOW_FACETS_TITLE",
        defaultFacetOrder: "$VITE_CONTENT_DATASETS_FACETS_DEFAULT_FACET_ORDER"
      }
    },
    catalogs: {
      facets: {
        useDatasetFacetsMap: "$VITE_CONTENT_CATALOGS_FACETS_USE_DATASET_FACETS_MAP",
        cutoff: "$VITE_CONTENT_CATALOGS_FACETS_CUTOFF",
        showClearButton: "$VITE_CONTENT_CATALOGS_FACETS_SHOW_CLEAR_BUTTON",
        showFacetsTitle: "$VITE_CONTENT_CATALOGS_FACETS_SHOW_FACETS_TITLE",
        defaultFacetOrder: "$VITE_CONTENT_CATALOGS_FACETS_DEFAULT_FACET_ORDER"
      }
    },
    datasetDetails: {
      header: {
        navigation: "$VITE_CONTENT_DATASET_DETAILS_HEADER_NAVIGATION",
        hidePublisher: "$VITE_CONTENT_DATASET_DETAILS_HEADER_HIDE_PUBLISHER",
        hideDate: "$VITE_CONTENT_DATASET_DETAILS_HEADER_HIDE_DATE"
      },
      keywords: {
        showTitle: "$VITE_CONTENT_DATASET_DETAILS_KEYWORDS_SHOW_TITLE",
        isVisible: "$VITE_CONTENT_DATASET_DETAILS_KEYWORDS_IS_VISIBLE",
        collapsed: "$VITE_CONTENT_DATASET_DETAILS_KEYWORDS_COLLAPSED"
      },
      description: {
        enableMarkdownInterpretation: "$VITE_CONTENT_DATASET_DETAILS_DESCRIPTION_ENABLE_MARKDOWN_INTERPRETATION"
      },
      distributions: {
        displayAll: "$VITE_CONTENT_DATASET_DETAILS_DISTRIBUTIONS_DISPLAY_ALL",
        displayCount: "$VITE_CONTENT_DATASET_DETAILS_DISTRIBUTIONS_DISPLAY_COUNT",
        incrementSteps: "$VITE_CONTENT_DATASET_DETAILS_DISTRIBUTIONS_INCREMENT_STEPS",
        descriptionMaxLines: "$VITE_CONTENT_DATASET_DETAILS_DISTRIBUTIONS_DESCRIPTION_MAX_LINES",
        descriptionMaxChars: "$VITE_CONTENT_DATASET_DETAILS_DISTRIBUTIONS_DESCRIPTION_MAX_CHARS",
        showValidationButton: "$VITE_CONTENT_DATASET_DETAILS_DISTRIBUTIONS_SHOW_VALIDATION_BUTTON",
      },
      pages: {
        isVisible: "$VITE_CONTENT_DATASET_DETAILS_PAGES_IS_VISIBLE",
        displayAll: "$VITE_CONTENT_DATASET_DETAILS_PAGES_DISPLAY_ALL",
        displayCount: "$VITE_CONTENT_DATASET_DETAILS_PAGES_DISPLAY_COUNT",
        incrementSteps: "$VITE_CONTENT_DATASET_DETAILS_PAGES_INCREMENT_STEPS",
        descriptionMaxLines: "$VITE_CONTENT_DATASET_DETAILS_PAGES_DESCRIPTION_MAX_LINES",
        descriptionMaxChars: "$VITE_CONTENT_DATASET_DETAILS_PAGES_DESCRIPTION_MAX_CHARS",
      },
      visualisations: {
        isVisible: "$VITE_CONTENT_DATASET_DETAILS_VISUALISATIONS_IS_VISIBLE",
        displayAll: "$VITE_CONTENT_DATASET_DETAILS_VISUALISATIONS_DISPLAY_ALL",
        displayCount: "$VITE_CONTENT_DATASET_DETAILS_VISUALISATIONS_DISPLAY_COUNT",
        incrementSteps: "$VITE_CONTENT_DATASET_DETAILS_VISUALISATIONS_INCREMENT_STEPS",
        descriptionMaxLines: "$VITE_CONTENT_DATASET_DETAILS_VISUALISATIONS_DESCRIPTION_MAX_LINES",
        descriptionMaxChars: "$VITE_CONTENT_DATASET_DETAILS_VISUALISATIONS_DESCRIPTION_MAX_CHARS",
      },
      bulkDownload: {
        buttonPosition: "$VITE_CONTENT_DATASET_DETAILS_BULK_DOWNLOAD_BUTTON_POSITION",
        MAX_FILE_TITLE_LENGTH: "$VITE_CONTENT_DATASET_DETAILS_BULK_DOWNLOAD_MAX_FILE_TITLE_LENGTH",
        MAX_REQUESTS_COUNT: "$VITE_CONTENT_DATASET_DETAILS_BULK_DOWNLOAD_MAX_REQUESTS_COUNT",
        INTERVAL_MS: "$VITE_CONTENT_DATASET_DETAILS_BULK_DOWNLOAD_INTERVAL_MS",
        TIMEOUT_MS: "$VITE_CONTENT_DATASET_DETAILS_BULK_DOWNLOAD_TIMEOUT_MS",
      },
      quality: {
        csvLinter: {
          enable: "$VITE_CONTENT_DATASET_DETAILS_QUALITY_CSV_LINTER_ENABLE",
        },
      },
      downloadAs: {
        enable: "$VITE_CONTENT_DATASET_DETAILS_DOWNLOAD_AS_ENABLE",
        proxyUrl: "$VITE_CONTENT_DATASET_DETAILS_DOWNLOAD_AS_PROXY_URL",
        url: "$VITE_CONTENT_DATASET_DETAILS_DOWNLOAD_AS_URL",
        conversionFormats: "$VITE_CONTENT_DATASET_DETAILS_DOWNLOAD_AS_CONVERSION_FORMATS",
      }
    },
    maps: {
      useAnimation: "$VITE_CONTENT_MAPS_USE_ANIMATION",
      urlTemplate: "$VITE_CONTENT_MAPS_URL_TEMPLATE",
      options: {
        id: "$VITE_CONTENT_MAPS_OPTIONS_ID",
        accessToken: "$VITE_CONTENT_MAPS_OPTIONS_ACCESS_TOKEN",
        attribution: "$VITE_CONTENT_MAPS_OPTIONS_ATTRIBUTION"
      },
      location: "$VITE_CONTENT_MAPS_LOCATION",
      spatialType: "$VITE_CONTENT_MAPS_SPATIAL_TYPE",
      height: "$VITE_CONTENT_MAPS_HEIGHT",
      width: "$VITE_CONTENT_MAPS_WIDTH",
      mapContainerId: "$VITE_CONTENT_MAPS_MAP_CONTAINER_ID",
      mapStyle: {
        color: "$VITE_CONTENT_MAPS_MAP_STYLE_COLOR",
        fillColor: "$VITE_CONTENT_MAPS_MAP_STYLE_FILL_COLOR",
        fillOpacity: "$VITE_CONTENT_MAPS_MAP_STYLE_FILL_OPACITY",
        weight: "$VITE_CONTENT_MAPS_MAP_STYLE_WEIGHT",
        radius: "$VITE_CONTENT_MAPS_MAP_STYLE_RADIUS",
      },
      sender: {
        startBounds: "$VITE_CONTENT_MAPS_SENDER_START_BOUNDS",
        height: "$VITE_CONTENT_MAPS_SENDER_HEIGHT",
        width: "$VITE_CONTENT_MAPS_SENDER_WIDTH",
        mapContainerId: "$VITE_CONTENT_MAPS_SENDER_MAP_CONTAINER_ID",
      },
      receiver: {
        startBounds: "$VITE_CONTENT_MAPS_RECEIVER_START_BOUNDS",
        height: "$VITE_CONTENT_MAPS_RECEIVER_HEIGHT",
        width: "$VITE_CONTENT_MAPS_RECEIVER_WIDTH",
        mapContainerId: "$VITE_CONTENT_MAPS_RECEIVER_MAP_CONTAINER_ID",
        attributionPosition: "$VITE_CONTENT_MAPS_RECEIVER_ATTRIBUTION_POSITION",
      },
    },
    dataProviderInterface: {
      useService: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_USE_SERVICE",
      basePath: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_BASE_PATH",
      annifIntegration: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_ANNIF_INTEGRATION",
      enableFileUploadReplace: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_ENABLE_FILE_UPLOAD_REPLACE",
      specification: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_SPECIFICATION",
      buttons: {
        Dataset: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_BUTTONS_DATASET",
        Catalogue: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_BUTTONS_CATALOGUE"
      },
      doiRegistrationService: {
        persistentIdentifierType: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_DOI_REGISTRATION_SERVICE_PERSISTENT_IDENTIFIER_TYPE",
      },
    },
  },
  languages: {
    useLanguageSelector: "$VITE_LANGUAGES_USE_LANGUAGE_SELECTOR",
    locale: "$VITE_LANGUAGES_LOCALE",
    fallbackLocale: "$VITE_LANGUAGES_FALLBACK_LOCALE"
  },
  tracker: {
    isPiwikPro: '$VITE_TRACKER_IS_PIWIK_PRO',
    siteId: '$VITE_TRACKER_SITE_ID',
    trackerUrl: '$VITE_TRACKER_TRACKER_URL'
  },
}
