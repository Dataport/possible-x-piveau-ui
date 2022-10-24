import context from '../config/prefixes';

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
function addNamespace(prefix) {
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

        const longNamespace = context[namespaceAbbreviation];
        fullDescriptor = `${longNamespace}${propertyName}`;
    } else {
        fullDescriptor = prefix;
    }

    return fullDescriptor; 
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

export default {
    mergeNestedObjects,
    addNamespace,
    makeId,
    isUrl,
};