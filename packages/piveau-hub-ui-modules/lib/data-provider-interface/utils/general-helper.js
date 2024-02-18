import { isEmpty, isNil, has } from 'lodash';

/**
 * Merges multiple Objects nested within an object into one main objects with al key-value-pairs originally located within the nested objects
 * @param {Object} data Object containing nested objects
 * @returns Object with key-value pairs merged from nested objects
 */
function mergeNestedObjects(data) {
    let mergedObject = {};
    for (const key in data) {
        mergedObject = Object.assign(mergedObject, data[key]);
    }
    return mergedObject;
}

/**
 *
 * @param {*} prefix
 * @returns
 */
function addNamespace(prefix, dpiConfig) {
    // the prefix had the following format: namespace:property (e.g. dct:title)
    // the short version of the namespace noe should be replaced by the long version (e.g. http://purl.org/dc/terms/title)

    let fullDescriptor;
    const colonIndex = prefix.indexOf(':');

    // there are also prefixes with no namespace which should sty the same
    if (colonIndex !== -1) {
        const namespaceAbbreviation = prefix.substr(0,colonIndex);
        const propertyName = prefix.substr(colonIndex + 1);

        // the long version of the namespace is saved within the context.json (config)
        // there is an object containing the namespace abbreviation(key) and the corresponding value is the long version of the namespace

        const longNamespace = dpiConfig.prefixes[namespaceAbbreviation];
        fullDescriptor = `${longNamespace}${propertyName}`;
    } else {
        fullDescriptor = prefix;
    }

    return fullDescriptor;
}

/**
 * Removes long namespace and replaces it with the abbreviation of the namespace
 * @param {*} longValue Long value with long namespace (e.g. https://....#type)
 * @returns Returns value with short namespace (e.g. rdf:type)
 */
function removeNamespace(longValue, dpiConfig) {
    let lastIndex;

    // long namespace either ends with an # or a \
    if (longValue.includes('#')) {
        lastIndex = longValue.lastIndexOf('#')
    } else {
        lastIndex = longValue.lastIndexOf('/')
    }

    const shortValue = longValue.substr(lastIndex + 1);
    const longPrefix = longValue.substr(0, lastIndex + 1);
    const shortPrefix = Object.keys(dpiConfig.prefixes).find(key => dpiConfig.prefixes[key] === longPrefix);

    return `${shortPrefix}:${shortValue}`;
}

/**
 * Returns list of keys as shortned version from given data
 * @param {*} data An array of quads with keys as predicate
 * @returns Array of shortened keys
 */
function getNestedKeys(data, dpiConfig) {
    const keys = [];

    for (let el of data) {
        keys.push(removeNamespace(el.predicate.value, dpiConfig));
    }

    return keys;
}

/**
 * Creates a random string
 * @param {*} length Length of string to be created
 * @returns String formed of random characters with given length
 */
function makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Methods checks if given string is an Url
 * @param {*} string String to test
 * @returns Boolean determining if given string is an Url
 */
function isUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

/**
 * Fetches data from given endpoint using token and returns data
 * @param {*} url Endpoint from where to fetch the data
 * @param {*} token User token for authentication (if needed)
 * @returns Returns promise of fetched data
 */
async function fetchLinkedData(endpoint, token) {
    let response;
    let requestOptions;

    // if token is given, provide token (for drafts and other non-public elements)
    if (token !== '') {
        requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            url: endpoint,
        };
    } else {
        requestOptions = {
            method: 'GET',
            url: endpoint,
        };
    }

    try {
        response = fetch(endpoint, requestOptions)
        .then(response => {
            const reader = response?.body?.getReader();
            return new ReadableStream({
                start(controller) {
                    // The following function handles each data chunk
                    function push() {
                        // "done" is a Boolean and value a "Uint8Array"
                        reader?.read().then(({done, value}) => {
                            // If there is no more data to read
                            if (done) {
                                controller.close();
                                return;
                            }
                            // Get the data and send it to the browser via the controller
                            controller.enqueue(value);
                            // Check chunks by logging to the console
                            push();
                        });
                    }

                    push();
                },
            });
        }).then((stream) =>
            new Response(stream, {headers: {'Content-Type': 'text/html'}}).text()
        );
    } catch (err) {
        // TODO: Handle (network) errors
        throw Error(`Error occured during fetching endpoint: ${endpoint}`);
    }
    return response;
}

/**
 * Exracts keynames (e.g. dct:title) using the page-content-config for each element
 * @param {*} property Property (datasets/distributions/catalogues)
 * @param {*} formDefinitions Form definition of properties including name
 * @param {*} pageContent Config file containing definition of which property will be displayed on which page
 * @returns Object containing keys of properties for each page
 */
function getPagePrefixedNames(property, formDefinitions, pageContent) {

    const prefixedNames = {
        datasets: {},
        distributions: {},
        catalogues: {}
      };

    // get property keys for each page
    for (let pageName in pageContent[property]) {
        prefixedNames[property][pageName] = [];
        for (let propertyName in pageContent[property][pageName]) {
            const prefixedName = formDefinitions[property][propertyName].name; // form definition includes name-property which contains key
            prefixedNames[property][pageName].push(prefixedName);
        }
    }

    return prefixedNames;
}

/**
 * Determines if all mandatory values are given for the given property
 * @param {*} data Object containing data values
 * @param {*} property Property (dtaset/catalogue/distribution) the given data values belong to
 * @returns Boolean describing if all mandatory fields are filled
 */
function checkMandatory(data, property) {

    let status;

    if (property === 'datasets') {
        // dataset mandatory properties: datasetID, dct:title with language tag, dct:description with language tag and catalog literal
        status = !isEmpty(data['datasetID'])
        && !isEmpty(data['dct:title']) && data['dct:title'].map(a => !isEmpty(a['@language']) && !isEmpty(a['@value'])).reduce((a, b) => b)
        && !isEmpty(data['dct:description']) && data['dct:description'].map(a => !isEmpty(a['@language']) && !isEmpty(a['@value'])).reduce((a, b) => b)
        && !isEmpty(data['dcat:catalog']);
    } else if (property === 'distributions') {
        // distribution mandatory properties: dcat:accessUrl

        const hasAccessUrl = !isNil(data) && !isEmpty(data) && !isEmpty(data['dcat:accessURL']);
        // if dataservice is given the title as well as the endpointUrl is mandatory
        if (has(data, 'dcat:accessService')) {
            const serviceNumber = data['dcat:accessService'].length;
            const allServicesHaveEnpointUrl = (data['dcat:accessService'].filter(obj => has(obj, 'dcat:endpointURL') && !isEmpty(obj['dcat:endpointURL']))).length === serviceNumber;
            let servicesTitleAvailability = [];

            for (let index in data['dcat:accessService']) {
                // accessService always provides a field title because of the prefilling with a language tag (so testing against that is not necessary)
                const service = data['dcat:accessService'][index];
                // only testing if at least one title for each service is available
                servicesTitleAvailability.push(!isEmpty(service['dct:title'].filter(el => has(el, '@value') && !isEmpty(el['@value']))))
            }
            const allServicesHaveATtitle = servicesTitleAvailability.every(el => el === true);
            status = hasAccessUrl && allServicesHaveATtitle && allServicesHaveEnpointUrl;
        } else {
            status = hasAccessUrl
        }
    } else if (property === 'catalogues') {
        // catalogue mandatory properties: datasetId, dct:title and dct:descirption with language tag, dct:publisher and at least one language (dct:language)
        status = !isEmpty(data['datasetID']) && !isEmpty(data['dct:title']) && data['dct:title'].map(a => !isEmpty(a['@language']) && !isEmpty(a['@value'])).reduce((a, b) => b)
        && !isEmpty(data['dct:description']) && data['dct:description'].map(a => !isEmpty(a['@language']) && !isEmpty(a['@value'])).reduce((a, b) => b)
        && !isEmpty(data['dct:publisher']) && !isEmpty(data['dct:language']);
    }

    return status;
}

/**
 * Get file id from accessUrl, if it is a file upload url.
 * accessUrls are file upload urls, iff they start with fileUploadUrl.
 * @param {string} accessUrl
 * @param {string} fileUploadUrl
 * @returns {string|null}
 */
function getFileIdByAccessUrl({ accessUrl, fileUploadUrl }) {
  const accessUrlWithTrailingSlash = accessUrl.endsWith('/')
    ? accessUrl
    : `${accessUrl}/`;
  const fileUploadUrlWithTrailingSlash = fileUploadUrl.endsWith('/')
    ? fileUploadUrl
    : `${fileUploadUrl}/`;

  // Check if accessUrl starts with fileUploadApi
  if (accessUrlWithTrailingSlash.startsWith(fileUploadUrlWithTrailingSlash)) {
    const accessUrlParts = accessUrlWithTrailingSlash.split('/');
    const fileId = accessUrlParts[accessUrlParts.length - 2];

    return fileId || null;
  }

  return null;
}

/**
 * Adds given key to format type 
 * @param {String} key 
 * @param {String} format 
 * @param {String} property 
 * @param {Object} typeDefinition 
 */
function addKeyToFormatType(key, format, property, typeDefinition) {
    typeDefinition[format][property].push(key);
}

/**
 * Removes key from format type
 * @param {String} key 
 * @param {String} format 
 * @param {String} property 
 * @param {Object} typeDefinition 
 */
function removeKeyFromFormatType(key, format, property, typeDefinition) {
    typeDefinition[format][property].splice(typeDefinition[format][property].indexOf(key), 1);
}

export default {
    mergeNestedObjects,
    addNamespace,
    makeId,
    isUrl,
    fetchLinkedData,
    getPagePrefixedNames,
    getNestedKeys,
    removeNamespace,
    checkMandatory,
    getFileIdByAccessUrl,
    addKeyToFormatType,
    removeKeyFromFormatType,
};
