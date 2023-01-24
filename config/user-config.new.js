import {
  uploadService,
  datasetService,
  catalogService,
  gazetteerService
} from '@piveau/piveau-hub-ui-modules';

import i18n from './i18n';

const glueConfig = {
  title: 'piveau Hub-UI',
  description: 'A modern and customizable web application for data management of extensive data catalogs.',
  keywords: 'Open Data',
  api: { // TODO: Restructure APIs
    baseUrl: 'https://data.europa.eu/api/hub/search/',
    // baseUrl: 'https://piveau-hub-search-data-europa-eu.apps.osc.fokus.fraunhofer.de/',
    qualityBaseUrl: 'https://data.europa.eu/api/mqa/cache/',
    similarityBaseUrl: 'https://data.europa.eu/api/similarities/',
    gazetteerBaseUrl: 'https://data.europa.eu/api/hub/search/gazetteer/',
    hubUrl: 'https://data.europa.eu/api/hub/repo/',
    // hubUrl: 'https://piveau-hub-repo-data-europa-eu.apps.osc.fokus.fraunhofer.de/',
    catalogBaseUrl: 'https://europeandataportal.eu/',
    authToken: '',
    vueAppCorsproxyApiUrl: 'https://piveau-corsproxy-piveau.apps.osc.fokus.fraunhofer.de',
    fileUploadUrl: 'https://data.europa.eu/api/hub/store/',
  },
  tracker: {
    // Matomo/PiwikPro analytics config
    // If true, uses PiwikPro, if false, uses Matomo  ---> TODO: How to disable?
    isPiwikPro: true,
    siteId: 'fed9dbb7-42d1-4ebc-a8bf-3c0b8fd03e09',
    trackerUrl: 'https://opanalytics.containers.piwik.pro/'
  },
  useAuthService: true, // TODO: Combine useAuthService, keycloak and rtp into property "authentication"
  keycloak: { // TODO: Combine useAuthService, keycloak and rtp into property "authentication"
    enableLogin: true, // TODO: Move to Header / Footer config
    logoutRedirectUri: '/', // TODO: Move to Header / Footer config
    realm: 'piveau',
    url: 'https://keycloak-piveau.apps.osc.fokus.fraunhofer.de/auth',
    clientId: 'piveau-hub-ui',
    'ssl-required': 'external', // TODO: Do we need this?
    'public-client': true, // TODO: Do we need this?
    'verify-token-audience': true, // TODO: Do we need this?
    'use-resource-role-mappings': true, // TODO: Do we need this?
    'confidential-port': 0, // TODO: Do we need this?
    loginRedirectUri: '/',
    logoutRedirectUri: '/',
  },
  rtp: { // TODO: Combine useAuthService, keycloak and rtp into property "authentication"
    grand_type: 'urn:ietf:params:oauth:grant-type:uma-ticket', // TODO: Do we need this?
    audience: 'piveau-hub-repo', // TODO: Do we need this?
  },
  languages: {
    useLanguageSelector: true, // TODO: Do we use this?
    locale: 'en',
    fallbackLocale: 'en',
  },
  services: {
    catalogService, // TODO: Do we use this?
    datasetService, // TODO: Do we use this?
    gazetteerService, // TODO: Do we use this?
    uploadService // TODO: Do we use this?
  },
  themes: {
    header: 'dark', // TODO: Do we need this?
  },
  routerOptions: {  // TODO: Move this into a meaningful property, e.g. routing, navigation or api
    base: '/data',
    mode: 'history',
  },
  navigation: {  // TODO: Do we need this?
    top: {
      main: {
        home: {
          show: true,
        },
        data: {
          show: true,
          sparql: {
            show: false,
          },
        },
        maps: {
          show: false,
        },
        about: {
          show: false,
        },
        append: [
          {
            href: 'https://www.fokus.fraunhofer.de/datenschutz',
            target: '_self',
            title: 'Privacy Policy',
          },
          {
            href: 'https://www.fokus.fraunhofer.de/9663f8cb2d267d4b',
            target: '_self',
            title: 'Imprint',
          },
        ],
        icons: false,
      },
      sub: {
        privacyPolicy: {
          show: false,
          href: 'https://www.fokus.fraunhofer.de/datenschutz',
          target: '_self',
        },
        imprint: {
          show: false,
          href: 'https://www.fokus.fraunhofer.de/9663f8cb2d267d4b',
          target: '_self',
        },
      },
    },
    bottom: {
      login: {
        useLogin: true,
        loginURL: '/login',
        loginTitle: 'Login',
        logoutURL: '/logout',
        logoutTitle: 'Logout',
      },
    }
  },
  pagination: {  // TODO: Move this into a meaningful property, e.g. features
    usePagination: true, // TODO: Do we need this?
    usePaginationArrows: true, // TODO: Do we need this?
    useItemsPerPage: true, // TODO: Do we need this?
    defaultItemsPerPage: 10, // TODO: Do we need this?
    defaultItemsPerPageOptions: [5, 10, 25, 50], // TODO: Do we need this?
  },
  images: {  // TODO: Do we need this?
    top: [
      {
        src: 'https://i.imgur.com/lgtG4zB.png',
        description: 'Logo data.europa.eu',
        height: '60px',
        width: 'auto',
      },
    ],
    bottom: [],
  },
  datasets: { // TODO: Restructure, Move this into a meaningful property, e.g. content
    upload: { // TODO: Do we need this?
      availableCategories: [
        'tran',
        'heal',
        'gove',
        'envi',
        'intr',
        'agri',
        'soci',
        'econ',
        'educ',
        'ener',
        'tech',
        'regi',
        'just',
      ],
    },
    facets: {
      cutoff: 5 ,
      showClearButton: false, // TODO: Do we need this?
      showFacetsTitle: false, // TODO: Do we need this?
      useDatasetFacets: true, // TODO: Do we need this?
      useDatasetFacetsMap: true, // TODO: Do we need this?
      defaultFacetOrder: ['publisher', 'format', 'catalog', 'categories', 'keywords', 'dataScope', 'country', 'dataServices', 'scoring', 'license'], // TODO: Do we need this?
      scoringFacets: {
        useScoringFacets: true, // TODO: Do we need this?
        defaultMinScore: 0, // TODO: Do we need this?
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
            title: 'Good+',
            count: 0,
            minScoring: 221,
            maxScoring: 350,
          },
          sufficientScoring: {
            id: 'sufficientScoring',
            title: 'Sufficient+',
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
      MIN_FACET_LIMIT: 10, // TODO: Do we need this?
      MAX_FACET_LIMIT: 50, // TODO: Do we need this?
      FACET_OPERATORS: Object.freeze({ or: 'OR', and: 'AND' }), // TODO: Do we need this?
      FACET_GROUP_OPERATORS: Object.freeze({ or: 'OR', and: 'AND' }), // TODO: Do we need this?
    },
    followKeywordLinks: 'nofollow', // TODO: Do we need this?
    maxKeywordLength: 15, // TODO: Do we need this?
    useSort: true, // TODO: Do we need this?
    useFeed: true, // TODO: Do we need this?
    useCatalogs: true, // TODO: Do we need this?
  },
  catalogs: { // TODO: Do we need this? Restructure, Move this into a meaningful property, e.g. content
    facets: {
      cutoff: 5,
      showClearButton: false,
      showFacetsTitle: false,
      useCatalogFacets: true,
      defaultFacetOrder: ['country'],
      MIN_FACET_LIMIT: 50,
      MAX_FACET_LIMIT: 100,
      FACET_OPERATORS: Object.freeze({ or: 'OR', and: 'AND' }),
      FACET_GROUP_OPERATORS: Object.freeze({ or: 'OR', and: 'AND' }),
    },
    useSort: true,
    useCatalogCountries: true,
    defaultCatalogImagePath: '/flags',
    defaultCatalogCountryID: 'eu',
    defaultCatalogID: 'european-union-open-data-portal',
  },
  datasetDetails: { // TODO: Do we need this? Restructure, Move this into a meaningful property, e.g. content
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
      showValidationButton: false,
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
      MAX_REQUESTS_COUNT: 5,
      INTERVAL_MS: 10,
      TIMEOUT_MS: 10000,
    },
    quality: {
      displayAll: false,
      numberOfDisplayedQualityDistributions: 5,
      csvLinter: {
        displayAll: false,
        numberOfDisplayedValidationResults: 5,
      },
    }
  },
  maps: { // TODO: Do we need this? Restructure, Move this into a meaningful property, e.g. features
    mapVisible: true,
    useAnimation: true,
    urlTemplate: 'https://gisco-services.ec.europa.eu/maps/wmts/1.0.0/WMTSCapabilities.xml/wmts/OSMCartoComposite/EPSG3857/{z}/{x}/{y}.png',
    options: {
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoiZmFiaWFwZmVsa2VybiIsImEiOiJja2x3MzlvZ3UwNG85MnBseXJ6aGI2MHdkIn0.bFs2g4bPMYULlvDSVsetJg',
      attribution: '&copy; <a href="https://ec.europa.eu/eurostat/web/gisco/">Eurostat - GISCO</a>',
    },
    geoBoundsId: 'ds-search-bounds',
    location: [[52.526, 13.314], 10],
    spatialType: 'Point',
    height: '400px',
    width: '100%',
    mapContainerId: 'mapid',
    mapStyle: {
      color: 'red',
      fillColor: 'red',
      fillOpacity: 0.5,
      weight: 2,
      radius: 1,
    },
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
  },
  upload: { // TODO: Restructure, Move this into a meaningful property, e.g. features
    useUpload: true,
    buttons: {
      Dataset: true, // TODO: Do we need this?
      Catalogue: false, // TODO: Do we need this?
    },
    basePath: '/dpi', // TODO: Do we need this?
  },
  doiRegistrationService: { // TODO: Restructure, Move this into a meaningful property, e.g. upload
    persistentIdentifierType: 'eu-ra-doi', // TODO: Do we need this?
  }
};

export { glueConfig, i18n };
