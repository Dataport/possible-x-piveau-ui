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
api: { // TODO: Restructure APIs and add PPE / OSC urls
baseUrl: 'https://data.europa.eu/api/hub/search/',
// baseUrl: 'https://ppe.data.europa.eu/api/hub/search/',
// baseUrl: 'https://piveau-hub-search-data-europa-eu.apps.osc.fokus.fraunhofer.de/',
qualityBaseUrl: 'https://data.europa.eu/api/mqa/cache/',
// qualityBaseUrl: 'https://ppe.data.europa.eu/api/mqa/cache/',
// qualityBaseUrl: 'https://piveau-metrics-cache-data-europa-eu.apps.osc.fokus.fraunhofer.de/',
similarityBaseUrl: 'https://data.europa.eu/api/similarities/',
// similarityBaseUrl: 'https://ppe.data.europa.eu/api/similarities/',
// similarityBaseUrl: 'https://piveau-metrics-dataset-similarities-data-europa-eu.apps.osc.fokus.fraunhofer.de/',
hubUrl: 'https://data.europa.eu/api/hub/repo/',
// hubUrl: 'https://ppe.data.europa.eu/api/hub/repo/',
// hubUrl: 'https://piveau-hub-repo-data-europa-eu.apps.osc.fokus.fraunhofer.de/',
fileUploadUrl: 'https://data.europa.eu/api/hub/store/',
// fileUploadUrl: 'https://ppe.data.europa.eu/api/hub/store/',
// fileUploadUrl: 'https://piveau-hub-store-data-europa-eu.apps.osc.fokus.fraunhofer.de/',
gazetteerBaseUrl: 'https://data.europa.eu/api/hub/search/gazetteer/',
catalogBaseUrl: 'https://europeandataportal.eu/',
vueAppCorsproxyApiUrl: 'https://piveau-corsproxy-piveau.apps.osc.fokus.fraunhofer.de',
sparqlUrl: 'https://data.europa.eu/sparql',
authToken: '',
},
tracker: {
// Matomo/PiwikPro analytics config
// If true, uses PiwikPro, if false, uses Matomo  ---> TODO: How to disable?
isPiwikPro: true,
siteId: 'fed9dbb7-42d1-4ebc-a8bf-3c0b8fd03e09',
trackerUrl: 'https://opanalytics.containers.piwik.pro/'
},
// TODO: Combine this into property "authentication"
useAuthService: true,
keycloak: {
enableLogin: true, // TODO: Move to Header / Footer config
logoutRedirectUri: '/', // TODO: Move to Header / Footer config
realm: 'piveau',
clientId: 'piveau-hub-ui',
url: 'https://keycloak-piveau.apps.osc.fokus.fraunhofer.de/auth',
'ssl-required': 'external', // TODO: Do we need to include these properties? They seem to be default values that never change.
'public-client': true,
'verify-token-audience': true,
'use-resource-role-mappings': true,
'confidential-port': 0,
},
rtp: {
grand_type: 'urn:ietf:params:oauth:grant-type:uma-ticket', // TODO: Do we need to include these properties? They seem to be default values that never change.
audience: 'piveau-hub-repo',
},
languages: {
locale: 'en',
fallbackLocale: 'en',
},
services: {
catalogService,
datasetService,
gazetteerService,
uploadService
},
routerOptions: {
base: '/data',
mode: 'history',
},
navigation: { // TODO: Move to Header / Footer config
top: {
main: {
data: {
sparql: {
show: false,
},
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
},
},
pagination: {  // TODO: Move this into a meaningful property, e.g. content
usePagination: true,
usePaginationArrows: true, 
useItemsPerPage: true,
defaultItemsPerPage: 10,
defaultItemsPerPageOptions: [5, 10, 25, 50],
},
datasets: {
facets: {
cutoff: 5 ,
showClearButton: false,
showFacetsTitle: false, 
useDatasetFacets: true, 
useDatasetFacetsMap: true,
defaultFacetOrder: ['publisher', 'format', 'catalog', 'categories', 'keywords', 'dataScope', 'country', 'dataServices', 'scoring', 'license'],
scoringFacets: {
useScoringFacets: true, 
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
MIN_FACET_LIMIT: 10,
MAX_FACET_LIMIT: 50, 
FACET_OPERATORS: Object.freeze({ or: 'OR', and: 'AND' }), 
FACET_GROUP_OPERATORS: Object.freeze({ or: 'OR', and: 'AND' }), 
},
followKeywordLinks: 'nofollow',
maxKeywordLength: 15, 
useSort: true, 
useFeed: true, 
useCatalogs: true, 
},
catalogs: {
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
showValidationButton: false, // ?
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
},
similarDatasets: {
breakpoints: {
verySimilar: { start: 0, end: 20 },
similar: { start: 20, end: 25 },
lessSimilar: { start: 25, end: 35 },
},
},
},
maps: {
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
upload: {
useUpload: true,
buttons: {
Dataset: true, 
Catalogue: false,
},
basePath: '/dpi',
},
doiRegistrationService: {
persistentIdentifierType: 'eu-ra-doi',
}
};

export { glueConfig, i18n };
