import fs, {Stats} from "fs";

import {configSchema} from "../packages/piveau-hub-ui-modules/lib/configurations/config-schema";
// import oldConfig from "../apps/vanilla-piveau-hub-ui/config/runtime-config.js";
// import oldConfig from "../local/deu-piveau-hub-ui/runtime-config_old.js";
// import oldConfig from "../local/deu-piveau-hub-ui/config/runtime-config.js";
import {ZodObject, ZodType, ZodDefault, ZodEffects} from 'zod';
import {pathByWorkspaceName} from "./utils/pathByWorkspaceName";
import {doForApps} from "./utils/doForApp";

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
        return z.shape;
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
function convert(z: ZodType, keyPath: string = '') {
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

function runtimeConfigAsString() {
    const fileStart = `/**
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
 
export default `;

    const fileBody = JSON.stringify(convert(configSchema), null, 2);

    const fileEnd = `;`;

    return fileStart + fileBody + fileEnd;
}

export function writeRuntimeConfig(filePath: string, config) {
    fs.writeFileSync(filePath, config);
    console.log("Created", filePath);
}

export function createRuntimeConfig(workspaceName) {
    const config = runtimeConfigAsString();
    if (workspaceName) {
        pathByWorkspaceName(workspaceName).then((filePath) => {
            writeRuntimeConfig(`${filePath}/config/runtime-config.js`, config);
        });
    } else {
        doForApps((file: string, stats: Stats, folder: string) => {
            writeRuntimeConfig(`${folder}/${file}/config/runtime-config.js`, config);
        });
    }
}

createRuntimeConfig(process.argv[2]);


//////////////////////////////////////////////////////////
// Following are ways to compare the objects created    //
// automatically by the Zod configuration with the      //
// existing runtime-config-js in vanilla-piveau-hub-ui: //
//////////////////////////////////////////////////////////


let count = 1;

function compareObjects(source: object, comparison: object, mode: string = "all", path: string[] = []) {
    const keys = Object.keys(source);
    const pathString = path.join(" > ");
    keys.forEach(key => {
        const extendedPathString = pathString + " > " + key;
        const sourceValue = source[key];
        const targetValue = comparison[key];
        if ( ! targetValue) {
            if (mode === "all" || mode === "missing") {
                console.log('\x1b[33m', "MISSING: " + extendedPathString);
            }
        } else if (typeof sourceValue === 'string') {
           if (sourceValue !== targetValue) {
               if (mode === "all" || mode === "difference") {
                   console.log('\x1b[31m', targetValue + " --> " + sourceValue);
                   // console.log('\x1b[31m', "DIFFERENT: " + extendedPathString + ": " + targetValue + " instead of " + sourceValue);
               }
           }
        } else if (typeof sourceValue === 'object' && typeof targetValue === 'object') {
            compareObjects(sourceValue, targetValue, mode, [...path, key]);
        }
    });
}
// compareObjects(convert(configSchema), oldConfig, "missing");
// compareObjects(convert(configSchema), oldConfig, "difference");
// compareObjects(oldConfig, convert(configSchema), "missing");
// compareObjects(oldConfig, convert(configSchema), "difference");
// compareObjects(convert(configSchema), oldConfig);
// console.log(oldConfig)

// const oldConfig = {
//     api: {
//         baseUrl: "$VITE_API_BASE_URL",
//         hubUrl: "$VITE_API_HUB_URL",
//         qualityBaseUrl: "$VITE_API_QUALITY_BASE_URL",
//         similarityBaseUrl: "$VITE_API_SIMILARITY_BASE_URL",
//         fileUploadUrl: '$VITE_FILEUPLOAD_URL',
//         sparqlUrl: '$VITE_SPARQL_URL',
//         gazetteerBaseUrl: "$VITE_API_GAZETTEER_BASE_URL",
//         catalogBaseUrl: "$VITE_API_CATALOG_BASE_URL",
//         vueAppCorsproxyApiUrl: "$VITE_CORSPROXY_API_URL",
//     },
//     authentication: {
//         useService: "$VITE_AUTHENTICATION_USE_SERVICE",
//         login: {
//             useLogin: "$VITE_AUTHENTICATION_LOGIN_USE_LOGIN",
//             loginTitle: "$VITE_AUTHENTICATION_LOGIN_LOGIN_TITLE",
//             loginURL: "$VITE_AUTHENTICATION_LOGIN_LOGIN_URL",
//             loginRedirectUri: "$VITE_AUTHENTICATION_LOGIN_LOGIN_REDIRECT_URI",
//             logoutTitle: "$VITE_AUTHENTICATION_LOGIN_LOGOUT_TITLE",
//             logoutURL: "$VITE_AUTHENTICATION_LOGIN_LOGOUT_URL",
//             logoutRedirectUri: "$VITE_AUTHENTICATION_LOGIN_LOGOUT_REDIRECT_URI",
//         },
//         authMiddleware: {
//             enable: "$VITE_AUTHENTICATION_AUTH_MIDDLEWARE_ENABLE",
//             baseUrl: "$VITE_AUTHENTICATION_AUTH_MIDDLEWARE_BASE_URL",
//             loginRedirectUrl: "$VITE_AUTHENTICATION_AUTH_MIDDLEWARE_LOGIN_REDIRECT_URL",
//             logoutRedirectUrl: "$VITE_AUTHENTICATION_AUTH_MIDDLEWARE_LOGOUT_REDIRECT_URL",
//         },
//         keycloak: {
//             realm: "$VITE_AUTHENTICATION_KEYCLOAK_REALM",
//             url: "$VITE_AUTHENTICATION_KEYCLOAK_URL",
//             "ssl-required": "$VITE_AUTHENTICATION_KEYCLOAK_SSL_REQUIRED",
//             clientId: "$VITE_AUTHENTICATION_KEYCLOAK_CLIENT_ID",
//             "public-client": "$VITE_AUTHENTICATION_KEYCLOAK_PUBLIC_CLIENT",
//             "verify-token-audience": "$VITE_AUTHENTICATION_KEYCLOAK_VERIFY_TOKEN_AUDIENCE",
//             "use-resource-role-mappings": "$VITE_AUTHENTICATION_KEYCLOAK_USE_RESOURCE_ROLE_MAPPINGS",
//             "confidential-port": "$VITE_AUTHENTICATION_KEYCLOAK_CONFIDENTIAL_PORT"
//         },
//         rtp: {
//             grand_type: "$VITE_AUTHENTICATION_RTP_GRAND_TYPE",
//             audience: "$VITE_AUTHENTICATION_RTP_AUDIENCE"
//         },
//         authToken: "$VITE_AUTHENTICATION_AUTH_TOKEN",
//     },
//     routing: {
//         routerOptions: {
//             base: "$VITE_ROUTING_ROUTER_OPTIONS_BASE",
//             mode: "$VITE_ROUTING_ROUTER_OPTIONS_MODE"
//         },
//         navigation: {
//             showSparql: "$VITE_ROUTING_NAVIGATION_SHOW_SPARQL"
//         }
//     },
//     metadata: {
//         title: "$VITE_METADATA_TITLE",
//         description: "$VITE_METADATA_DESCRIPTION",
//         keywords: "$VITE_METADATA_KEYWORDS",
//     },
//     content: {
//         datasets: {
//             facets: {
//                 useDatasetFacetsMap: "$VITE_CONTENT_DATASETS_FACETS_USE_DATASET_FACETS_MAP",
//                 cutoff: "$VITE_CONTENT_DATASETS_FACETS_CUTOFF",
//                 showClearButton: "$VITE_CONTENT_DATASETS_FACETS_SHOW_CLEAR_BUTTON",
//                 showFacetsTitle: "$VITE_CONTENT_DATASETS_FACETS_SHOW_FACETS_TITLE"
//             }
//         },
//         catalogs: {
//             facets: {
//                 useDatasetFacetsMap: "$VITE_CONTENT_CATALOGS_FACETS_USE_DATASET_FACETS_MAP",
//                 cutoff: "$VITE_CONTENT_CATALOGS_FACETS_CUTOFF",
//                 showClearButton: "$VITE_CONTENT_CATALOGS_FACETS_SHOW_CLEAR_BUTTON",
//                 showFacetsTitle: "$VITE_CONTENT_CATALOGS_FACETS_SHOW_FACETS_TITLE"
//             }
//         },
//         datasetDetails: {
//             properties: "$VITE_CONTENT_DATASETDETAILS_PROPERTIES",
//             header: {
//                 navigation: "$VITE_CONTENT_DATASETDETAILS_HEADER_NAVIGATION",
//                 hidePublisher: "$VITE_CONTENT_DATASETDETAILS_HEADER_HIDE_PUBLISHER",
//                 hideDate: "$VITE_CONTENT_DATASETDETAILS_HEADER_HIDE_DATE"
//             },
//             keywords: {
//                 showTitle: "$VITE_CONTENT_DATASETDETAILS_KEYWORDS_SHOW_TITLE"
//             },
//             description: {
//                 enableMarkdownInterpretation: "$VITE_CONTENT_DATASETDETAILS_DESCRIPTION_ENABLE_MARKDOWN_INTERPRETATION"
//             },
//             distributions: {
//                 displayAll: "$VITE_CONTENT_DATASETDETAILS_DISTRIBUTIONS_DISPLAY_ALL",
//                 displayCount: "$VITE_CONTENT_DATASETDETAILS_DISTRIBUTIONS_DISPLAY_COUNT",
//                 incrementSteps: "$VITE_CONTENT_DATASETDETAILS_DISTRIBUTIONS_INCREMENT_STEPS",
//                 descriptionMaxLines: "$VITE_CONTENT_DATASETDETAILS_DISTRIBUTIONS_DESCRIPTION_MAX_LINES",
//                 descriptionMaxChars: "$VITE_CONTENT_DATASETDETAILS_DISTRIBUTIONS_DESCRIPTION_MAX_CHARS",
//                 showValidationButton: "$VITE_CONTENT_DATASETDETAILS_DISTRIBUTIONS_SHOW_VALIDATION_BUTTON",
//             },
//             pages: {
//                 isVisible: "$VITE_CONTENT_DATASETDETAILS_PAGES_IS_VISIBLE",
//                 displayAll: "$VITE_CONTENT_DATASETDETAILS_PAGES_DISPLAY_ALL",
//                 displayCount: "$VITE_CONTENT_DATASETDETAILS_PAGES_DISPLAY_COUNT",
//                 incrementSteps: "$VITE_CONTENT_DATASETDETAILS_PAGES_INCREMENT_STEPS",
//                 descriptionMaxLines: "$VITE_CONTENT_DATASETDETAILS_PAGES_DESCRIPTION_MAX_LINES",
//                 descriptionMaxChars: "$VITE_CONTENT_DATASETDETAILS_PAGES_DESCRIPTION_MAX_CHARS",
//             },
//             visualisations: {
//                 isVisible: "$VITE_CONTENT_DATASETDETAILS_VISUALISATIONS_IS_VISIBLE",
//                 displayAll: "$VITE_CONTENT_DATASETDETAILS_VISUALISATIONS_DISPLAY_ALL",
//                 displayCount: "$VITE_CONTENT_DATASETDETAILS_VISUALISATIONS_DISPLAY_COUNT",
//                 incrementSteps: "$VITE_CONTENT_DATASETDETAILS_VISUALISATIONS_INCREMENT_STEPS",
//                 descriptionMaxLines: "$VITE_CONTENT_DATASETDETAILS_VISUALISATIONS_DESCRIPTION_MAX_LINES",
//                 descriptionMaxChars: "$VITE_CONTENT_DATASETDETAILS_VISUALISATIONS_DESCRIPTION_MAX_CHARS",
//             },
//             bulkDownload: {
//                 buttonPosition: "$VITE_CONTENT_DATASETDETAILS_BULKDOWNLOAD_BUTTON_POSITION",
//                 MAX_FILE_TITLE_LENGTH: "$VITE_CONTENT_DATASETDETAILS_BULKDOWNLOAD_MAX_FILE_TITLE_LENGTH",
//                 MAX_REQUESTS_COUNT: "$VITE_CONTENT_DATASETDETAILS_BULKDOWNLOAD_MAX_REQUESTS_COUNT",
//                 INTERVAL_MS: "$VITE_CONTENT_DATASETDETAILS_BULKDOWNLOAD_INTERVAL_MS",
//                 TIMEOUT_MS: "$VITE_CONTENT_DATASETDETAILS_BULKDOWNLOAD_TIMEOUT_MS",
//             },
//             quality: {
//                 csvLinter: {
//                     enable: "$VITE_CONTENT_DATASETDETAILS_QUALITY_CSV_LINTER_ENABLE",
//                 },
//             },
//             downloadAs: {
//                 enable: "$VITE_CONTENT_DATASETDETAILS_DOWNLOAD_AS_ENABLE",
//                 proxyUrl: "$VITE_CONTENT_DATASETDETAILS_DOWNLOAD_AS_PROXY_URL",
//                 url: "$VITE_CONTENT_DATASETDETAILS_DOWNLOAD_AS_URL",
//                 conversionFormats: "$VITE_CONTENT_DATASETDETAILS_DOWNLOAD_AS_CONVERSION_FORMATS",
//             },
//             embed: {
//                 enable: "$VITE_CONTENT_DATASETDETAILS_EMBED_ENABLE",
//                 defaultWidth: "$VITE_CONTENT_DATASETDETAILS_EMBED_DEFAULT_WIDTH",
//                 defaultHeight: "$VITE_CONTENT_DATASETDETAILS_EMBED_DEFAULT_HEIGHT",
//                 minRange: "$VITE_CONTENT_DATASETDETAILS_EMBED_MIN_RANGE",
//                 maxRange: "$VITE_CONTENT_DATASETDETAILS_EMBED_MAX_RANGE",
//             },
//             validate: {
//                 enable: "$VITE_CONTENT_DATASETDETAILS_VALIDATE_ENABLE"
//             },
//         },
//         maps: {
//             useAnimation: "$VITE_CONTENT_MAPS_USE_ANIMATION",
//             urlTemplate: "$VITE_CONTENT_MAPS_URL_TEMPLATE",
//             options: {
//                 id: "$VITE_CONTENT_MAPS_OPTIONS_ID",
//                 accessToken: "$VITE_CONTENT_MAPS_OPTIONS_ACCESS_TOKEN",
//                 attribution: "$VITE_CONTENT_MAPS_OPTIONS_ATTRIBUTION"
//             },
//             location: "$VITE_CONTENT_MAPS_LOCATION",
//             spatialType: "$VITE_CONTENT_MAPS_SPATIAL_TYPE",
//             height: "$VITE_CONTENT_MAPS_HEIGHT",
//             width: "$VITE_CONTENT_MAPS_WIDTH",
//             mapContainerId: "$VITE_CONTENT_MAPS_MAP_CONTAINER_ID",
//             mapStyle: {
//                 color: "$VITE_CONTENT_MAPS_MAP_STYLE_COLOR",
//                 fillColor: "$VITE_CONTENT_MAPS_MAP_STYLE_FILL_COLOR",
//                 fillOpacity: "$VITE_CONTENT_MAPS_MAP_STYLE_FILL_OPACITY",
//                 weight: "$VITE_CONTENT_MAPS_MAP_STYLE_WEIGHT",
//                 radius: "$VITE_CONTENT_MAPS_MAP_STYLE_RADIUS",
//             },
//             sender: {
//                 startBounds: "$VITE_CONTENT_MAPS_SENDER_START_BOUNDS",
//                 height: "$VITE_CONTENT_MAPS_SENDER_HEIGHT",
//                 width: "$VITE_CONTENT_MAPS_SENDER_WIDTH",
//                 mapContainerId: "$VITE_CONTENT_MAPS_SENDER_MAP_CONTAINER_ID",
//             },
//             receiver: {
//                 startBounds: "$VITE_CONTENT_MAPS_RECEIVER_START_BOUNDS",
//                 height: "$VITE_CONTENT_MAPS_RECEIVER_HEIGHT",
//                 width: "$VITE_CONTENT_MAPS_RECEIVER_WIDTH",
//                 mapContainerId: "$VITE_CONTENT_MAPS_RECEIVER_MAP_CONTAINER_ID",
//                 attributionPosition: "$VITE_CONTENT_MAPS_RECEIVER_ATTRIBUTION_POSITION",
//             },
//         },
//         dataProviderInterface: {
//             useService: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_USE_SERVICE",
//             basePath: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_BASE_PATH",
//             specification: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_SPECIFICATION",
//             annifIntegration: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_ANNIF_INTEGRATION",
//             annifLinkTheme:'$VITE_CONTENT_DATA_PROVIDER_INTERFACE_ANNIF_LINK_THEME',
//             annifLinkSubject:'$VITE_CONTENT_DATA_PROVIDER_INTERFACE_ANNIF_LINK_SUBJECT',
//             buttons: {
//                 Dataset: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_BUTTONS_DATASET",
//                 Catalogue: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_BUTTONS_CATALOGUE"
//             },
//             doiRegistrationService: {
//                 persistentIdentifierType: "$VITE_CONTENT_DATA_PROVIDER_INTERFACE_DOI_REGISTRATION_SERVICE_PERSISTENT_IDENTIFIER_TYPE",
//             },
//         },
//     },
//     languages: {
//         useLanguageSelector: "$VITE_LANGUAGES_USE_LANGUAGE_SELECTOR",
//         locale: "$VITE_LANGUAGES_LOCALE",
//         fallbackLocale: "$VITE_LANGUAGES_FALLBACK_LOCALE"
//     },
//     tracker: {
//         isPiwikPro: '$VITE_TRACKER_IS_PIWIK_PRO',
//         siteId: '$VITE_TRACKER_SITE_ID',
//         trackerUrl: '$VITE_TRACKER_TRACKER_URL'
//     },
// };
