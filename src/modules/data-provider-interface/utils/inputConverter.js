import generalHelper from "./general-helper";

import dpiConfig from '../config/dpi-spec-config';
const formatType = dpiConfig.formatTypes;
const formDefinitions = dpiConfig.inputDefinition;

/**
 * Converts given data for given property into input form format
 * @param {*} state state from store
 * @param {*} property Property to convert data for (datasets/catalogues)
 * @param {*} data Linked data within a dataset
 */
function convertToInput(state, property, data) {

    let generalID;
    let namespaceKeys;
    let propertyQuads;

    const mandataoryStatus = {
        catalogues: false,
        datasets: false,
        distributions: []
    };

    if (property === 'datasets') {
        propertyQuads = data.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/ns/dcat#Dataset', null);
    } else {
        propertyQuads = data.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/ns/dcat#Catalog', null);
    }
        
    // extract data for datasets/catalogues
    namespaceKeys = generalHelper.getPagePrefixedNames(property, formDefinitions, dpiConfig.pageConent);
    state[property] = {};
    for (let el of propertyQuads) {
        // there should be only one dataset id
        generalID = el.subject.value;

        for (let pageName in namespaceKeys[property]) {
            state[property][pageName] = {};
            convertProperties(property, state.datasets[pageName], generalID, data, namespaceKeys[property][pageName]);
        }
        
    }

    // check mandatory status for datasets/catalogues
    mandataoryStatus[property] = generalHelper.checkMandatory(generalHelper.mergeNestedObjects(state[property]), property); // datasets or catalogues

    // also add distribution data
    if (property === 'datasets') {
        const distributionQuads = data.match(generalID, 'http://www.w3.org/ns/dcat#distribution', null, null);
        namespaceKeys = generalHelper.getPagePrefixedNames('distributions', formDefinitions, dpiConfig.pageConent);
        state.distributions = [];
        for (let el of distributionQuads) {
            const currentDistribution = {};
            
            const distributionId = el.object.value;
            for (let pageName in namespaceKeys['distributions']) {
                currentDistribution[pageName] = {};
                convertProperties('distributions', currentDistribution[pageName], distributionId, data, namespaceKeys['distributions'][pageName]);
            }  
            state.distributions.push(currentDistribution);

            // check mandatory status for distributions
            mandataoryStatus.distributions.push(generalHelper.checkMandatory(generalHelper.mergeNestedObjects(currentDistribution), 'distributions'));
        }
    }

    localStorage.setItem('dpi_mandatory', JSON.stringify(mandataoryStatus));
}

/**
 * Converts value for given property from RDF into input form format
 * @param {*} property Parent property of given value (datasets/distributions/catalogues)
 * @param {*} state State from store
 * @param {*} id Id of parent node which serves as subject
 * @param {*} data Linked data
 * @param {*} propertyKeys Keys of properties to check
 */
function convertProperties(property, state, id, data, propertyKeys) {

    for (let index = 0; index < propertyKeys.length; index += 1) {
        const key = propertyKeys[index];
        let subData = data.match(id, generalHelper.addNamespace(key), null, null);

        if (formatType.singularString[property].includes(key)) {
            convertSingularStrings(subData, state, key);
        } else if (formatType.singularURI[property].includes(key)) {
            convertSingularURI(subData, state, key);
        } else if (formatType.multipleURI[property].includes(key)) {
            convertMultipleURI(subData, state, key, property);
        } else if (formatType.typedStrings[property].includes(key)) {
            convertTypedString(subData, state, key);
        } else if (formatType.multilingualStrings[property].includes(key)) {
            convertMultilingual(subData, state,  key);   
        } else if (formatType.groupedProperties[property].includes(key)) {
            if (subData.size > 0) {
                state[key] = [];
                // there could be multiple nodes with data for a property
                for (let el of subData) {
                    const currentState = {}
                    if (key === 'skos:notation') {
                        // skos notation behaves differently
                        // there should be a typed literal given which should be seperated into @value and @type
                        if (el.object.value) currentState['@value'] = el.object.value;
                        if (el.object.datatypeString) currentState['@type'] = el.object.datatypeString;
                    } else {
                        // some properties have a named node containing data, the value of this named node also is a value form the input form (typically @id)
                        if (el.object.termType === 'NamedNode') currentState['@id'] = el.object.value;
                        // get keys of node properties
                        const nestedKeys = generalHelper.getNestedKeys(data.match(el.object, null, null, null));
                        convertProperties(property, currentState, el.object, data, nestedKeys);
                    }
                    state[key].push(currentState);
                }
            }
        } else if (key === 'dcat:temporalResolution') {
            // temporal resolution is displayed as group of input forms for each property (year, month, day, ...)
            // the form provides the data as following: [ { 'Year': '...', 'Month': '...', ... } ]
            // the linked data format of this property looks like this: P?Y?M?DT?H?M?S
            if (subData.size > 0) {

                state[key] = [{}];

                const shorts = ['Y', 'M', 'D', 'H', 'M', 'S'];
                const forms = {
                0: 'Year',
                1: 'Month',
                2: 'Day',
                3: 'Hour',
                4: 'Minute',
                5: 'Second',
                };

                // should be oly one quad
                let resolutionValue;
                for (let el of subData) {
                    resolutionValue = el.object.value;
                }

                // find index of letter for time period
                // extract substring until this index
                // extract number from string and set as according value for input
                for (let tempIndex = 0; tempIndex < shorts.length; tempIndex += 1) {
                    const position = resolutionValue.indexOf(shorts[tempIndex]); // position of duration letter
                    const subDuration = resolutionValue.substring(0, position); // substring until position of duration letter
                    const value = subDuration.match(/\d+/g)[0]; // extract number
                    resolutionValue = resolutionValue.substring(position); // overwrite resolution string with shortened version (missing the extracted part)
                    state[key][0][forms[tempIndex]] = value; // write to result object
                }
            }
        } else if (key === 'dct:identifier') {
            if (subData.size > 0) {
                // identifier should be provided as array of strings
                // [{'@value': '...'}, {'@value': '...'}, ...]
                state[key] = [];

                for (let el of subData) {
                    state[key].push({'@value': el.object.value});
                }
            }
        } else if (key === 'dct:rights') {
            // rights is conditional and gets a string
            // rights always includes a type so everything is located within a blank node
            // also rights is a singular property
            if (subData.size > 0) {
                let nodeData;
                // get id of blank node and associated label data
                for (let el of subData) {
                    const rightsBlankNode = el.object;
                    nodeData = data.match(rightsBlankNode, generalHelper.addNamespace('rdfs:label'), null, null);
                    for (let label of nodeData) {
                        state[key] = label.object.value;
                    }
                }
            }
        } else if (key === 'dct:license') {
            // licence can either be a simple URI or an additional node containing a title, description and url
            // detailed input format: []
            if (subData.size > 0) {
                // for both cases the parent node is singular (either object is namedNode or blankNode)
                for (let el of subData) {
                    if (el.object.termType === 'NamedNode') {
                        state[key] = el.object.value;
                    } else if (el.object.termType === "BlankNode") {
                        state[key] = []; // grouped values are stored within an array
                        // get keys for nested values without dct'title (special format)
                        const nestedKeys = generalHelper.getNestedKeys(data.match(el.object, null, null, null)).filter(el => el !== 'dct:title');
                        const licenceProperties = {};
                        // convert nested values

                        const licenceTitleQuad = data.match(el.object, generalHelper.addNamespace('dct:title'), null, null);
                        for (let el of licenceTitleQuad) {
                            licenceProperties['dct:title'] = el.object.value;

                        }

                        convertProperties(property, licenceProperties, el.object, data, nestedKeys);
                        state[key].push(licenceProperties);
                    }
                }
            }            
        } else if (key === 'datasetID' && property !== 'datatsets') {
            // id is given as complete URI
            // dataset-/catalogue-id is string following the last /
            state[key] = id.substr(id.lastIndexOf('/') + 1);
            state['hidden_datasetIDFormHidden'] = id.substr(id.lastIndexOf('/') + 1);
        } else if (key === 'dct:catalog' && property === 'datasets') {
            // datasets also have a property called dct:catalog (not valid DCAT-AP)
            // property is needed to determine catalog the dataset belongs to
            if (!(subData.size > 0)) {
                // bceause dct:catalog is no valid DCAT-AP it is possible that the prefix is not resolved
                // therefore it is also possible to get the data by using the shortned key
                subData = data.match(id, 'dct:catalog', null, null);
            }
               
            state[key] = '';

            // there should only be one catalog
            for (let cat of subData) {
                state[key] = cat.object.value;
            }
        } else if (key === 'rdf:type') {
            // some properties have a type which can be selected
            // the type also has a namespace and therefore need to be shortened ( e.g. from https://...Individual to vcard:Individual)
            if (subData.size > 0) {
                state[key] = '';

                // typically there is only on type provided for each property instance
                for (let el of subData) {
                    state[key] = generalHelper.removeNamespace(el.object.value);
                }
            }
        }
    }
}

//-----------------------------------------------------------------------------------------------------
//                  basic conversion methods for different categories of data
//-----------------------------------------------------------------------------------------------------
// seems at first to be unnecessary but if we want to convert nested properties as well, we need these 
// methods (especially to provide the correct parent URI)

/**
 * 
 * @param {*} data 
 * @param {*} state 
 * @param {*} key 
 */
function convertSingularStrings(data, state, key) {
    if (data.size > 0) {
        state[key] = '';

        for (let el of data) {
            state[key] = el.object.value;
        }
    }
}

/**
 * 
 * @param {*} data 
 * @param {*} state 
 * @param {*} key 
 */
function convertSingularURI(data, state, key) {
    if (data.size > 0) {
        state[key] = '';

        for (let el of data) {
            const value = el.object.value;

            if (value.startsWith('mailto:')) {
                state[key] = value.replace('mailto:', '');
            } else {
                state[key] = value;
            }
        }
    }
}

/**
 * 
 * @param {*} data 
 * @param {*} state 
 * @param {*} key 
 */
function convertMultipleURI(data, state, key, property) {
    // there are two different formats the frontend need to deliver multiple URIs
    // 1: [ "URI1", "URI2" ]
    // 2: [ { "@id": "URI1" }, { "@id": "URI2" } ]

    if (data.size > 0) {
        state[key] = [];
        for (let el of data) {
            if (formatType.multiURIarray[property].includes(key)) {
                state[key].push(el.object.value);
            } else if (formatType.multiURIobjects[property].includes(key)) {
                state[key].push({'@id': el.object.value});
            }
        }        
    }
}

/**
 * 
 * @param {*} data 
 * @param {*} state 
 * @param {*} key 
 */
function convertTypedString(data, state, key) {
    // some properties have a type
    // normally this type is not used within the forntend form and therefore won't be saved to frontend values
    if (data.size > 0) {
        state[key] = '';
        for (let el of data) {
            state[key] = el.object.value;
        }
    }
    
}

/**
 * Converts and writes multilingual data to store
 * @param {*} data DatasetCore containing an array of quads
 * @param {*} state State for current key
 * @param {*} key Name of current property (e.g: 'dct:title')
 */
function convertMultilingual(data, state, key) {
    // multilingual data is always stored within an array containing object with the value and it's language
    // [ {'@value': '...', '@language': '...'}, ...]
    if (data.size > 0) {
        state[key] = [];

        for (let el of data) {
            const currentElement = {};
            currentElement['@value'] = el.object.value; // actual value
            currentElement['@language'] = el.object.language; // language of value
            state[key].push(currentElement);
        }
    }
}

export default { 
    convertToInput,
};
