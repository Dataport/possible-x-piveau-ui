// @ts-nocheck
/* eslint-disable no-param-reassign, no-shadow, no-console */
import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';
import { has, isEmpty, isNil, cloneDeep } from 'lodash-es';
import * as jsonldLib from 'jsonld';

// config defining which properties are displayed on which page
import dpiconfig from '../../config/page-content-config';
// jsonld definition of all properties for each DCAT-AP profile
import jsonlddefinitions from '../../config/dcatap-jsonld';
// form input definition for all properties of each DCAT-AP profile
import dcatapproperties from '../../config/dcatap-input-definition';
// namespaced key for all DCATAP properties
import namespacedKeys from '../../config/dcatap-namespace';
// jsonld context for DCAT-AP
import context from '../../config/context.json';

// property types for jsonld and form input groupes by special format
import dcataptypes from '../../config/dcatap-jsonld-types';
import inputtypes from '../../config/input-value-types';

// converter for converting jsonld to input and vice versa
import toJsonldConverter from '../../utils/toJsonld-helper';
import toInputConverter from '../../utils/toInput-helper';

Vue.use(Vuex);

const state = {
    datasets: cloneDeep(jsonlddefinitions.datasets),
    distributions: [],
    catalogues: cloneDeep(jsonlddefinitions.catalogues),
};

const getters = {
    getData: (state) => (property) => {
        return state[property];
    },
    getNumberOfDistributions(state) {
        return state.distributions.length;
    },
    mandatoryFieldsFilled: (state) => ({ property, id }) => {
        const data = state[property];

        if (property === 'datasets') {
            return !isEmpty(data['@id'])
            && !isEmpty(data['dct:title']) && data['dct:title'].map(a => !isEmpty(a['@language']) && !isEmpty(a['@value'])).reduce((a, b) => b)
            && !isEmpty(data['dct:description']) && data['dct:description'].map(a => !isEmpty(a['@language']) && !isEmpty(a['@value'])).reduce((a, b) => b)
            && !isEmpty(data['dct:catalog']);
        } else if (property === 'distributions') {
            return !isNil(data) && !isEmpty(data[id]) && !isEmpty(data[id]['dcat:accessURL']);
        } else if (property === 'catalogues') {
            return !isEmpty(data['dct:title']) && data['dct:title'].map(a => !isEmpty(a['@language']) && !isEmpty(a['@value'])).reduce((a, b) => b)
            && !isEmpty(data['dct:description']) && data['dct:description'].map(a => !isEmpty(a['@language']) && !isEmpty(a['@value'])).reduce((a, b) => b)
            && !isEmpty(data['dct:publisher']) && !isEmpty(data['dct:language']);
        }
    }
};

const actions = {
    /**
     * Saving values from input form into JSON-LD object
     * @param {*} param0
     * @param {*} param1 Object containing the property (datasets/catalogues), the subpage (if there is one) and the values of the form
     */
    saveToJsonld({ commit }, {property, values, distid}) {
        commit('populateJsonld', {property, values, distid});
    },
    /**
     * Saves preexisting values from JSONLD to object given as form data to InputPage component
     * @param {*} param0
     * @param {*} param1 Object containing property, page and subpage information
     * @returns Object containing all preexisting values formatted in a way matching the input form data requierements
     */
    saveToForm({ state }, {property, page, distid }) {

        const formData = {};

        const pageProperties = Object.keys(dpiconfig[property][page]);
        const propertyDefinitions = dcatapproperties[property];

        // distributions are stored within an array
        let storedata;
        if (distid) {
            storedata = state[property][distid];
        } else {
            storedata = state[property];
        }

        // saving existing values from the state-JSONLD-object (e.g. state.datasets) for each property contained in the current page to an object
        // this object laters serves as value object filling the form with preexisting values
        for (let propertyIndex = 0; propertyIndex < pageProperties.length; propertyIndex += 1) {
            const propertyName = pageProperties[propertyIndex];
            const propertyKey = propertyDefinitions[propertyName].name;

            if (has(storedata, propertyKey)) {
                const stateValues = storedata[propertyKey];

                // values with identical structure for JSONLD and input form
                if (inputtypes.sameFormatProperties[property].includes(propertyKey)) {
                    if (!isEmpty(stateValues)) {
                        // exclude machien translated title and description
                        if (propertyKey === 'dct:title' || propertyKey === 'dct:description') {
                            formData[propertyKey] = [];
                            for (let pid = 0; pid < stateValues.length; pid += 1) {
                                if (!isEmpty(stateValues[pid]['@language'])) {
                                    // only save non-machine-translated values
                                    if (!stateValues[pid]['@language'].includes('mtec')) {
                                        formData[propertyKey].push({ '@value': stateValues[pid]['@value'], '@language': stateValues[pid]['@language'] });
                                    }
                                } else {
                                    // if no language is given, preselect englisch
                                    formData[propertyKey].push({ '@value': stateValues[pid]['@value'], '@language': 'en' });
                                }
                            }
                        } else {
                            formData[propertyKey] = stateValues;
                        }
                    }
                } else if (inputtypes.typedStrings[property].includes(propertyKey)) {
                    if (!isEmpty(stateValues)) toInputConverter.typedStringToString(formData, stateValues, propertyKey);
                } else if (inputtypes.multiURIs[property].includes(propertyKey)) {
                    // values with multiple URIs which need to be converted into multiple strings
                    if (!isEmpty(stateValues)) toInputConverter.multiUriToString(formData, stateValues, propertyKey);
                } else if (inputtypes.singularURI[property].includes(propertyKey)) {
                    // a singular URI which needs to be converted to a singular string (URL)
                    if (!isEmpty(stateValues)) formData[propertyKey] = stateValues['@id'];
                } else if (propertyKey === 'dct:identifier') {
                // conversion of identifier

                    if (!isEmpty(stateValues)) {
                        // JSONLD provides the values as an array of strings ['', '', '', ...]
                        // which needs to be converted to an array of objects containing the
                        // values with the key '@value' [{'@value': ''}, {'@value': ''}, ...]
                        const identifierArray = [];
                        for (let idIndex = 0; idIndex < stateValues.length; idIndex += 1) {
                            identifierArray.push({'@value': stateValues[idIndex]});
                        }
                        formData[propertyKey] = identifierArray;
                    }
                } else if (propertyKey === 'dcat:temporalResolution') {
                    // conversion of temporal resolution
                    if (!isEmpty(stateValues)) {
                        // string format from JSONLD: P?Y?M?DT?H?M?S
                        // needed format for form input: [{'Year': '', 'Month': '', ...}]

                        const temporalResolutionInput = [{}];
                        const shorts = ['Y', 'M', 'D', 'H', 'M', 'S'];
                        const forms = {
                        0: 'Year',
                        1: 'Month',
                        2: 'Day',
                        3: 'Hour',
                        4: 'Minute',
                        5: 'Second',
                        };

                        // find index of letter for time period
                        // extract substring until this index
                        // extract number from string and set as according value for input
                        let resolutionString = stateValues['@value'];
                        for (let tempIndex = 0; tempIndex < shorts.length; tempIndex += 1) {
                            const position = resolutionString.indexOf(shorts[tempIndex]); // position of duration letter
                            const subDuration = resolutionString.substring(0, position); // substring until position of duration letter
                            const value = subDuration.match(/\d+/g)[0]; // extract number
                            resolutionString = resolutionString.substring(position); // overwrite resolution string with shortened version (missing the extracted part)
                            temporalResolutionInput[0][forms[tempIndex]] = value; // write to result object
                        }
                        formData[propertyKey] = temporalResolutionInput;
                    }
                } else if (inputtypes.groupedValues[property].includes(propertyKey)) {
                    // grouped values with nested groups
                    if (!isEmpty(stateValues)) toInputConverter.convertGroupedProperties(formData, stateValues, propertyKey);
                } else if (propertyKey === 'spdx:checksum') {
                    if (!isEmpty(stateValues)) {
                        const checksum = { '@type': 'spdx:Checksum', 'spdx:checksumValue': '', 'spdx:algorithm': ''};
                        if (!isEmpty(stateValues['spdx:checksumValue'])) checksum['spdx:checksumValue'] = stateValues['spdx:checksumValue'];
                        if (!isEmpty(stateValues['spdx:algorithm']['@id'])) {
                            const algorithmValue = stateValues['spdx:algorithm']['@id'];
                            if (algorithmValue.startsWith('http') || algorithmValue.startsWith('www')) {
                                checksum['spdx:algorithm'] = algorithmValue;
                        } else if (algorithmValue.includes(':')) {
                                const algorithm = algorithmValue.replace(':', '');
                                checksum['spdx:algorithm'] = `http://spdx.org/rdf/terms#${algorithm}`;
                        }
                    }
                    formData[propertyKey] = [checksum]; // is a grouped values and therefore must be within an array
                }
                } else if (propertyKey === 'dct:rights') {
                    if (!isEmpty(stateValues)) {
                        formData[propertyKey] = {'rdfs:label': ''};
                        if (!isEmpty(stateValues['rdfs:label'])) {
                            if (typeof stateValues['rdfs:label'] === 'string') {
                                formData[propertyKey]['rdfs:label'] = stateValues['rdfs:label'];
                            } else if (typeof stateValues['rdfs:label'] === 'object') {
                                formData[propertyKey]['rdfs:label'] = stateValues['rdfs:label']['@id'];
                            }
                        }
                    }
                } else if (propertyKey === 'dct:temporal') {
                    if (!isEmpty(stateValues)) {
                        formData[propertyKey] = [];
                        for (let index = 0; index < stateValues.length; index += 1) {
                            formData[propertyKey][index] = {'dcat:startDate': '', 'dcat:endDate': ''};
                            if (has(stateValues[index], 'dcat:startDate')) formData[propertyKey][index]['dcat:startDate'] = stateValues[index]['dcat:startDate']['@value'];
                            if (has(stateValues[index], 'dcat:endDate')) formData[propertyKey][index]['dcat:endDate'] = stateValues[index]['dcat:endDate']['@value'];
                        }
                    }
                } else if (propertyKey === 'dct:license') {
                    if (has(stateValues, '@id')) {
                        // URI
                        if (!isEmpty(stateValues['@id'])) formData[propertyKey] = stateValues['@id'];
                    } else {
                        // multiple sub properties
                        const licenseData = {};
                        if (has(stateValues, 'dct:title') && !isEmpty(stateValues['dct:title'])) licenseData['dct:title'] = stateValues['dct:title'];
                        if (has(stateValues, 'skos:prefLabel') && !isEmpty(stateValues['skos:prefLabel'])) licenseData['skos:prefLabel'] = stateValues['skos:prefLabel'];
                        if (has(stateValues, 'skos:exactMatch') && !isEmpty(stateValues['skos:exactMatch']) && has(stateValues['skos:exactMatch'], '@id') && !isEmpty(stateValues['skos:exactMatch']['@id'])) licenseData['skos:exactMatch'] = stateValues['skos:exactMatch']['@id'];
                        formData[propertyKey] = [licenseData];
                    }
                }
            } else if (property !== 'distributions'  && propertyKey === 'datasetID') {
                if (!isEmpty(storedata['@id'])) {
                    formData['datasetID'] = storedata['@id'];
                }
            }
        }
    return formData;
},
    /**
     * Saving existing values to state
     * @param {*} param0
     * @param {*} param1 Object containing property (datasets/catalogues) and subpage (when curren tprofile is distributions)
     */
    saveExistingJsonld({ commit }, property) {
        commit('saveJsonld', property);
    },
    /**
     * Fetches JSONLD from given backend endpoint with token
     * @param {*} param0
     * @param {*} param1 Object containing endpoint to call and user token
     * @returns JSON object containing JSONLD data from endpoint
     */
    async fetchJsonld({ commit }, {endpoint, token}) {
        let response;
        let requestOptions;

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
            response = await axios.request(requestOptions);
        } catch (err) {
            // TODO: Handle (network) errors
            throw Error(`Error occured during fetching endpoint: ${endpoint}`);
        }
        return response.data;
    },
    /**
     * Requests and commits JSONLD for each property to transfer function
     * @param {*} param0
     * @param {*} param1
     */
    async saveJsonldFromBackend({ commit, dispatch }, {endpoint, token, property, id}) {
        const data = await dispatch('fetchJsonld', {endpoint, token}).then((response) => {
            return response;
        });

        // the whole jsonld data is located within a graph
        const graphData = data['@graph'];

        // nested and grouped data is outsourced into own entries with id
        const nodeData = graphData.filter(dataset => (dataset['@type'] !== 'dcat:Distribution'
        && dataset['@type'] !== 'dcat:Dataset'
        && dataset['@type'] !== 'dcat:Catalog'));

        const context = data['@context'];

        if (property === 'datasets') {
            // tranfer datasets data into stores state
            const datasetData = graphData.filter(dataset => dataset['@type'] === 'dcat:Dataset')[0]; // there is only one dataset entry
            commit('transferJsonld', {data: datasetData, nodeData, property, id, context});

            // transfer distribution data into stores state
            const distributionData = graphData.filter(dataset => dataset['@type'] === 'dcat:Distribution');
            for (let index = 0; index < distributionData.length; index += 1) {
                commit('transferJsonld', {data: distributionData[index], nodeData, property: 'distributions', id: index, context});
            }
        } else if (property === 'catalogues') {
            // transfer catalog data into stores state
            const catalogueData = graphData.filter(dataset => dataset['@type'] === 'dcat:Catalog')[0]; // there is only one catalogue entry
            commit('transferJsonld', {data: catalogueData, nodeData, property, id, context});
        }
    },
    /**
     * Removes empty entries within JSONLD
     */
    removeEmptyEntries({ commit }, jsonld) {
        const propertieNames = Object.keys(jsonld);

        for (let index = 0; index < propertieNames.length; index += 1) {
            const name = propertieNames[index];

            // some properties must not be deleted (some must remian empty)
            if (name !== '@id') {
                if (isEmpty(jsonld[name])) {
                    delete jsonld[name];
                } else {
                    // multilingual properties always have an array with one object containing at least an empty value string and a preselected language tag
                    const multilinguals = dcataptypes.multiLang['catalogues'].concat(dcataptypes.multiLang['datasets'], dcataptypes.multiLang['distributions']);
                    if (multilinguals.includes(name)) {
                        for (let id = 0; id < jsonld[name].length; id += 1) {
                            if (isEmpty(jsonld[name][id]['@value'])) delete jsonld[name][id]; // remove all entries with empty value field
                        }
                        if (jsonld[name][0] === undefined) delete jsonld[name]; // if there are no values anymore delete whole property from jsonld
                    }

                    // accessservice has also title and description which are multilingual fields with a preselected language tag
                    if (name === 'dcat:accessService') {
                        for (let accessId = 0; accessId < jsonld[name].length; accessId += 1) {

                            // deleting empty titles
                            for (let tid = 0; tid < jsonld[name][accessId]['dct:title'].length; tid += 1) {
                                if (isEmpty(jsonld[name][accessId]['dct:title'][tid]['@value'])) delete jsonld[name][accessId]['dct:title'][tid]; // remove all empty titles
                            }
                            if (jsonld[name][accessId]['dct:title'][0] === undefined) delete jsonld[name][accessId]['dct:title']; // remove title object if no titles left

                            //deleting empty descriptions
                            for (let tid = 0; tid < jsonld[name][accessId]['dct:description'].length; tid += 1) {
                                if (isEmpty(jsonld[name][accessId]['dct:description'][tid]['@value'])) delete jsonld[name][accessId]['dct:description'][tid]; // remove all empty descriptions
                            }
                            if (jsonld[name][accessId]['dct:description'][0] === undefined) delete jsonld[name][accessId]['dct:description']; // remove description property if nor descriptions left

                            if (isEmpty(jsonld[name][accessId])) delete jsonld[name][accessId]; // remove accessservice if no properties given
                        }
                        if (jsonld[name][0] === undefined) delete jsonld[name]; // remove whole property if no values given
                    }

                }
            }
        }
    },
    /**
     * Merging data and context and compacting JSON-LD
     * @param {*} param0 State containing data for all properties
     * @param {*} property Property string (datasets/catalogues)
     * @returns Compacted JSON-LD object
     */
    async finishJsonld({ state, dispatch }, property) {
        let jsonld;

        // for datasets also distributions need to be included (if existing)
        if (property === 'datasets') {
            jsonld = [];

            const datasetData = {...context, ...state[property]};

            // @id has to be an Url
            datasetData['@id'] = `${Vue.prototype.$env.api.hubUrl}${state[property]['@id']}`;

            dispatch('removeEmptyEntries', datasetData);
            jsonld.push(datasetData);

            if (!isEmpty(state.distributions)) {
                const distNumbers = state.distributions.length;
                for (let num = 0; num < distNumbers; num += 1) {
                    const distData = {...context, ...state.distributions[num]};
                    // distribution id is already set as url on create
                    dispatch('removeEmptyEntries', distData);

                    // Copy accessURL to downloadURL, if downloadURL is empty
                    // TODO: is there a more transparent way to do this?
                    if (isEmpty(distData['dcat:downloadURL']) && !isEmpty(distData['dcat:accessURL'])) {
                        // make sure to copy the object and not the reference
                        distData['dcat:downloadURL'] = JSON.parse(JSON.stringify(distData['dcat:accessURL']));
                    }

                    jsonld.push(distData);
                }
            }
        } else if (property === 'catalogues') {
            jsonld = {...context, ...state[property]};

            // @id has to be an Url
            jsonld['@id'] = `${Vue.prototype.$env.api.hubUrl}${state[property]['@id']}`;

            dispatch('removeEmptyEntries', jsonld);
        }

        // compacting jsonld with library
        const compactJsonld = await jsonldLib.compact(jsonld, context);

        return compactJsonld;
    },
    addDistribution({ commit }) {
        commit('createDistribution');
    },
    deleteDistribution({ commit }, index) {
        commit('removeDistribution', index);
    },
    clearAll({ commit }) {
        commit('resetStore');
    }
};

const mutations = {
    /**
     * Saving values from input form into JSON-LD representation stored within the state
     * @param {*} state
     * @param {*} param1 Object containing property (datasets/distributions/catalogues) and the values returned by the input form
     */
    populateJsonld(state, {property, values, distid}) {
        const valueKeys = Object.keys(values);
        let storedata;

        if(distid) {
            storedata = state[property][distid];
        } else {
            storedata = state[property];
        }

        for (let index = 0; index < valueKeys.length; index += 1) {
            const key = valueKeys[index];

            if(has(storedata, key)) {
                // properties which value is a single string
                if (dcataptypes.singularString[property].includes(key)) {
                    if(!isEmpty(values[key])) toJsonldConverter.convertSingularString(storedata, values[key], key);
                    else storedata[key] = "";
                } else if (dcataptypes.typedStrings[property].includes(key)) {
                    if (!isEmpty(values[key])) toJsonldConverter.convertTypedStrings(storedata, values[key], key);
                    else storedata[key] = "";
                } else if (dcataptypes.singularURI[property].includes(key)) {
                    // properties which value is a singulare URI
                    if(!isEmpty(values[key])) toJsonldConverter.convertSingularURI(storedata[key], values[key]);
                } else if (dcataptypes.multipleURI[property].includes(key)) {
                    // properties which value is an array of URIs
                    if(!isEmpty(values[key])) {
                        storedata[key] = []; // overwriting existing array so removed values will be deleted
                        toJsonldConverter.convertMultipleURIs(storedata[key], values[key]);
                    } else {
                        // reset saved properties if values were emptied
                        storedata[key] = [];
                    }
                } else if (dcataptypes.multiLang[property].includes(key)) {
                    // properties with a language selection
                    if(!isEmpty(values[key])) {
                        storedata[key] = []; // overwriting existing array so removed values will be deleted
                        toJsonldConverter.convertMultiLingual(storedata[key], values[key]);
                    }
                } else if (dcataptypes.conditionalValues[property].includes(key)) {
                    // properties with conditional input formats (license and rights)
                    if(!isEmpty(values[key])) toJsonldConverter.convertConditional(storedata, values[key], key);
                    else storedata[key] = "";
                } else if (dcataptypes.groupedProperties.includes(key)) {
                    // a group of properties (or an array of groups)
                    if(!isEmpty(values[key])) {
                        storedata[key] = []; // overwriting existing array so removed values will be deleted
                        toJsonldConverter.convertGroupedInput(storedata[key], values[key], key);
                    }
                } else if (key === 'dct:identifier') {
                    // identifier is an array of strings
                    storedata[key] = []; // overwriting existing array so removed values will be deleted
                    const identifierLength = values[key].length;

                    for (let idIndex = 0; idIndex < identifierLength; idIndex += 1) {
                        // the form privdes identifier data like this: [{'@value': ''}, ...]
                        if (values[key][idIndex]['@value'] !== '' &&values[key][idIndex]['@value'] !== undefined) storedata[key][idIndex] = values[key][idIndex]['@value'];
                    }
                } else if (key === 'dcat:temporalResolution') {
                    // merge values of temporal resolution

                    // the form for temporal resolution returns (if single fields are given):
                    // [{'Year': '', 'Month': '', ...}]
                    const resultionValues = values[key][0];
                    storedata[key] = {'@value': '', '@type': 'xsd:duration'};
                    storedata[key]['@value'] = `P${resultionValues.Year ? resultionValues.Year : 0}Y${resultionValues.Month ? resultionValues.Month : 0}M${resultionValues.Day ? resultionValues.Day : 0}DT${resultionValues.Hour ? resultionValues.Hour : 0}H${resultionValues.Minute ? resultionValues.Minute : 0}M${resultionValues.Second ? resultionValues.Second : 0}S`
                    // remove 'empty' (all zero) values
                    if (Object.values(resultionValues).every(el => el === 0 || el === '' || el === '0')) storedata[key] = '';
                } else if (key === 'spdx:checksum') {
                    const actualValues = values[key][0]; // checksum is a grouped property and therefore stored within an array (with only one entry because it is not repeatable)
                    if (!isEmpty(actualValues)) {
                        storedata[key] = { '@type': 'spdx:Checksum', 'spdx:algorithm': {'@id': '' }, 'spdx:checksumValue': '' };
                        if (!isEmpty(actualValues['spdx:checksumValue'])) storedata[key]['spdx:checksumValue'] = actualValues['spdx:checksumValue'];
                        if (!isEmpty(actualValues['spdx:algorithm'])) storedata[key]['spdx:algorithm']['@id'] = actualValues['spdx:algorithm'];
                    }
                } else if (key === 'adms:identifier') {
                    const identifierObject = {
                        "@id": "",
                    };
                    for (let index = 0; index < values[key].length; index += 1) {
                        storedata[key][index] = cloneDeep(identifierObject);
                        const currentData = values[key][index];
                        const currentStoreData = storedata[key][index];
                        if (has(currentData, '@id') && !isEmpty(currentData['@id'])) currentStoreData['@id'] = currentData['@id'];
                        if (has(currentData, 'skos:notation') && !isEmpty(currentData['skos:notation'])) {
                            currentStoreData['skos:notation'] = {};
                            // is a subgroup which is summarized in array with singular entry
                            const currentNotation = currentData['skos:notation'][0];
                            if (has(currentNotation, '@value') && !isEmpty(currentNotation['@value'])) currentStoreData['skos:notation']['@value'] = currentNotation['@value'];
                            if (has(currentNotation, '@type') && !isEmpty(currentNotation['@type'])) currentStoreData['skos:notation']['@type'] = currentNotation['@type'];
                        }
                    }
                }
            } else if (key === 'datasetID') {
                // save datasetID to '@id'-property for datasets
                storedata['@id'] = values[key];
            }
        }
        // save data to local storage for later reuse
        localStorage.setItem(`dpi_${property}`, JSON.stringify(state[property]));
    },
    /**
    * Save JSONLD from local storage to store's state
    * @param {*} state
    * @param {String} property Property within the stae where the existing data should be saved to (datasets/distributions/catalogues)
    */
    saveJsonld(state, property) {
        let valueName;

        if (property === 'catalogues') {
            valueName = 'dpi_catalogues';
        } else {
            valueName = 'dpi_datasets';
        }

        // extract catalogues or datasets data
        if (Object.keys(localStorage).includes(valueName)) {
            const localStorageData = JSON.parse(localStorage.getItem(valueName));
            if (property === 'catalogues') state[property] = localStorageData;
            else state.datasets = localStorageData;
        }

        // additionally get distribution data if existing
        if (property === 'datasets' || property === 'distributions') {
            const distName = 'dpi_distributions';

            if (Object.keys(localStorage).includes(distName)) {
                const distributionsData = JSON.parse(localStorage.getItem(distName));
                state.distributions = distributionsData;
            }
        }
    },
    /**
    * Transfering and converting JSONLD from backend to JSONLD structure within store
    * @param {*} state
    * @param {*} param1
    */
    transferJsonld(state, {data, nodeData, property, id, context}) {
        const propertyKeys = Object.keys(data);
        let storedata;

        // save id of property dataset or catalogues to @id-field
        if (property === 'datasets' || property === 'catalogues') {
            state[property]['@id'] = id;
            storedata = state[property];
        }

        if (property === 'distributions') {
            // povided id is index of distribution
            if (!state.distributions) {
                state.distributions = [];
            }

            state.distributions[id] = cloneDeep(jsonlddefinitions.distributions);
            storedata = state[property][id];
            storedata['@id'] = data['@id'];
        }

        for (let index = 0; index < propertyKeys.length; index += 1) {
            let normalKeyName = propertyKeys[index];

            // if only adms identifier is provided the key might be provided as 'identifier' not 'adms:identifier' -> check context URI
            const originalIdentifierKey = normalKeyName;
            if (normalKeyName === 'identifier') {
                if (has(context, 'identifier')) {
                    const identifierURI = context.identifier['@id'];
                    if (identifierURI.includes('adms')) {
                        normalKeyName = 'adms:identifier';
                    }
                }
            }

            // save catalog info for input of datasets (no valid/ real property -> just for input)
            if (property === 'datasets' && (normalKeyName === 'catalog' || normalKeyName === 'dct:catalog')) {
                state['datasets']['dct:catalog'] = data[normalKeyName];
            }

            // save catalog info for catalogues
            if (property === 'catalogues' && (normalKeyName === 'catalog' || normalKeyName === 'dcat:catalog')) {
                let catalogValues;
                if (!Array.isArray(data[normalKeyName])) {
                    catalogValues = [data[normalKeyName]];
                } else {
                    catalogValues = data[normalKeyName];
                }

                state['catalogues']['dcat:catalog'] = [];
                for (let catid = 0; catid < catalogValues.length; catid += 1) {
                    const currentCatalog = catalogValues[catid];
                    if (typeof currentCatalog === 'object' && has(currentCatalog, '@id')) {
                        state['catalogues']['dcat:catalog'][catid] = currentCatalog;
                    } else if (typeof currentCatalog === 'string') {
                        state['catalogues']['dcat:catalog'][catid] = { '@id': currentCatalog };
                    }
                }
            }

            if (property === 'datasets' && normalKeyName === 'distribution') {
                // backend provided either String or array of strings but we need the distribution ids as URIs
                const distributionIds = data[normalKeyName];
                if (typeof distributionIds === 'string') {
                    storedata['dcat:distribution'] = [{'@id': distributionIds}];
                } else if (Array.isArray(distributionIds)) {
                    storedata['dcat:distribution'] = [];
                    for (let index = 0; index < distributionIds.length; index += 1) {
                        storedata['dcat:distribution'][index] = {'@id': distributionIds[index]};
                    }
                }
            }

            // sometime properties are also delivered with their prefix which is not reflected within the namespace object
            // remove the prefix
            if (normalKeyName !== 'adms:identifier' && normalKeyName.includes(':')) {
                normalKeyName = normalKeyName.substring(normalKeyName.indexOf(':') + 1);
            }
            if (has(namespacedKeys, normalKeyName)) {
                const key = namespacedKeys[normalKeyName]; // convert normal key name into namespaced key (e.g. title -> 'dct:title')
                // propertie which value is a singular string
                if (dcataptypes.singularString[property].includes(key)) {
                    if(!isEmpty(data[normalKeyName])) toJsonldConverter.convertSingularString(storedata, data[normalKeyName], key);
                } else if (dcataptypes.typedStrings[property].includes(key)) {
                    if (!isEmpty(data[normalKeyName])) {
                        toJsonldConverter.convertTypedStrings(storedata, data[normalKeyName], key);
                    } else if (!isEmpty(data[key])) {
                        toJsonldConverter.convertTypedStrings(storedata, data[key], key);
                    }
                } else if (dcataptypes.multiLang[property].includes(key)) {
                    // multilingual Properties
                    let values;
                    // if there are multiple values they are already stored within an array
                    if (Array.isArray(data[normalKeyName])) {
                        values = data[normalKeyName];
                    } else if (typeof data[normalKeyName] === 'object') {
                    // if there is a singular value it is stored within an object
                    values = [data[normalKeyName]];
                    }
                    // for data provided trough the DPI there should be only these two data types
                    // because the saved JSONLD converts the data to match thi format (even if language is missing an empty lanuage key is provided)
                    toJsonldConverter.convertMultiLingual(storedata[key], values);
                } else if (dcataptypes.singularURI[property].includes(key)) {
                    // properties with singular URIs
                    if (!isEmpty(data[normalKeyName])) toJsonldConverter.convertSingularURI(storedata[key], data[normalKeyName]);
                } else if (dcataptypes.multipleURI[property].includes(key)) {
                    // properties with multiple URIs
                    let values;
                    // if there are multiple values they are already stored within an array
                    if (Array.isArray(data[normalKeyName])) {
                        values = data[normalKeyName];
                    } else if (typeof data[normalKeyName] === 'string') {
                        // if there is a singular value it is stored as a string
                        values = [data[normalKeyName]];
                    }
                    toJsonldConverter.convertMultipleURIs(storedata[key], values);
                } else if (key === 'dct:identifier' && property !== 'distributions') {
                    // identiier is an array of strings
                    if (Array.isArray(data[originalIdentifierKey])) {
                        if (!isEmpty(data[originalIdentifierKey])) storedata[key] = data[originalIdentifierKey];
                    } else if (typeof data[originalIdentifierKey] === 'string') {
                        if (!isEmpty(data[originalIdentifierKey])) storedata[key] = [data[originalIdentifierKey]];
                    }
                } else if (key === 'dcat:temporalResolution') {
                    // temporal resolution given as string (e.g. P1Y1M0DT0H2M0S)
                    if (!isEmpty(data[normalKeyName])) storedata[key] = { '@value': data[normalKeyName], '@type': 'xsd:duration' };
                } else if (dcataptypes.groupedProperties.includes(key)) {
                    // properties with a group (and nested group) of subproperties
                    const singularData = data[normalKeyName];
                    let mergedData;

                    // for repeatable properties there coudl be multiple nodes
                    if (Array.isArray(singularData)) {
                        mergedData = [];
                        for (let dataIndex = 0; dataIndex < singularData.length; dataIndex += 1) {
                            mergedData[dataIndex] = toJsonldConverter.mergeNodeData(nodeData, singularData[dataIndex]);
                        }
                    } else {
                        mergedData = toJsonldConverter.mergeNodeData(nodeData, singularData);
                    }

                    // checksum is a grouped property but not repeatable so the JSONLD should be an object
                    if (Array.isArray(mergedData)) {
                        storedata[key] = mergedData;
                    } else {
                        storedata[key] = [mergedData];
                    }
                } else if (key === 'spdx:checksum') {
                    storedata[key] = toJsonldConverter.mergeNodeData(nodeData, data[normalKeyName]);
                } else if (key === 'dct:rights') {
                    const rightsValue = data[normalKeyName];
                    let rightsNodeData = nodeData.filter(dataset => dataset['@id'] === rightsValue);

                    if (!isEmpty(rightsNodeData)) {
                        // existing node Data ( data always within a node)
                        rightsNodeData = rightsNodeData[0]; // filter provides array we only need the single entry of array
                        if (has(rightsNodeData, 'label') && !isEmpty(rightsNodeData['label'])) {
                            storedata[key] = {'@type': 'dct:RightsStatement'};
                            if (typeof rightsNodeData['label'] === 'object') {
                                if (has(rightsNodeData['label'], '@id') && !isEmpty(rightsNodeData['label']['@id'])) storedata[key]['rdfs:label'] = rightsNodeData['label'];
                            } else {
                                // for some reason the backend returns URI in JSON-LD wrongly
                                if (rightsNodeData['label'].startsWith('http') || rightsNodeData['label'].startsWith('www')) storedata[key]['rdfs:label'] = {'@id': rightsNodeData['label']};
                                else storedata[key]['rdfs:label'] = rightsNodeData['label'];
                            }
                        }
                    }
                } else if (key === 'dct:license') {
                    // license could either be an URI or a group of values stored within a node
                    let licenseNodeData = nodeData.filter(dataset => dataset['@id'] === data[normalKeyName]);
                    if (!isEmpty(licenseNodeData)) {
                        licenseNodeData = licenseNodeData[0]; // filter returns and array with only one entry
                        // group of sub properties
                        storedata[key] = { 'dct:title': '', 'skos:prefLabel': '', 'skos:exactMatch': {'@id': ''} };
                        if (has(licenseNodeData, 'title') && !isEmpty(licenseNodeData['title'])) storedata[key]['dct:title'] = licenseNodeData['title'];
                        if (has(licenseNodeData, 'prefLabel') && !isEmpty(licenseNodeData['prefLabel'])) storedata[key]['skos:prefLabel'] = licenseNodeData['prefLabel'];
                        if (has(licenseNodeData, 'exactMatch') && !isEmpty(licenseNodeData['exactMatch'])) storedata[key]['skos:exactMatch']['@id'] = licenseNodeData['exactMatch'];
                    } else {
                        // license URI
                        storedata[key] = {'@id': data[normalKeyName]};
                    }
                } else if (key === 'adms:identifier') {
                    const admsObject = {
                        '@id': '',
                        'skos:notation': {'@value': '', '@type': ''}
                    };
                    // there could be multiple identifiers
                    let admsData;
                    if (Array.isArray(data[originalIdentifierKey])) {
                        admsData = data[originalIdentifierKey];
                    } else {
                        admsData = [data[originalIdentifierKey]];
                    }

                    for (let amdsId = 0; amdsId < admsData.length; amdsId += 1) {
                        const currentIdentifierData = admsData[amdsId];
                        let identifierURI;
                        if (has(currentIdentifierData, '@id') && !isEmpty(currentIdentifierData['@id'])) {
                            identifierURI = currentIdentifierData['@id']
                        } else if (!isEmpty(currentIdentifierData)) {
                            identifierURI = currentIdentifierData;
                        }

                        storedata[key][amdsId] = cloneDeep(admsObject);
                        storedata[key][amdsId]['@id'] = identifierURI;
                        let admsNodeData = nodeData.filter(el => el['@id'] === identifierURI);
                        if (!isEmpty(admsNodeData)) {
                            admsNodeData = admsNodeData[0]; // should only return one element within array because id has to be unique
                            if (has(admsNodeData, 'skos:notation') && !isEmpty(admsNodeData['skos:notation'])) {
                                if (has(admsNodeData['skos:notation'], '@value') && !isEmpty(admsNodeData['skos:notation']['@value'])) storedata[key][amdsId]['skos:notation']['@value'] = admsNodeData['skos:notation']['@value'];
                                if (has(admsNodeData['skos:notation'], '@type') && !isEmpty(admsNodeData['skos:notation']['@type'])) storedata[key][amdsId]['skos:notation']['@type'] = admsNodeData['skos:notation']['@type'];
                            } else if (has(admsNodeData, 'notation') && !isEmpty(admsNodeData.notation)) {
                                // notation type is located in the context
                                storedata[key][amdsId]['skos:notation']['@value'] = admsNodeData.notation;
                                if (has(context, 'notation') && !isEmpty(context.notation)) {
                                    if (has(context.notation, '@type') && !isEmpty(context.notation['@type'])) {
                                        storedata[key][amdsId]['skos:notation']['@type'] = context.notation['@type'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // save data to local storage
        localStorage.setItem(`dpi_${property}`, JSON.stringify(state[property]));
    },
    /**
    * Creates a new distribution within state
    * @param {*} state
    */
    createDistribution(state) {
        if (!state.distributions) {
            state.distributions = [];
        }
        const newDistribution = cloneDeep(jsonlddefinitions.distributions);
        // give distribution random id (which must be a link)
        newDistribution['@id'] = `${Vue.prototype.$env.api.hubUrl}distribution/${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 20)}`;
        state.distributions.push(newDistribution);

        // add id to distributions array within datasets
        // if edit mode and only one distribution is available, write id into array to enable adding additional distribution ids
        if (!Array.isArray(state.datasets['dcat:distribution'])) {
            const existingId = state.datasets['dcat:distribution'];
            state.datasets['dcat:distribution'] = [];
            state.datasets['dcat:distribution'].push({'@id': existingId});
        }
        state.datasets['dcat:distribution'].push({'@id': newDistribution['@id']});

        // save changes to local storage
        localStorage.setItem('dpi_datasets', JSON.stringify(state.datasets));
        localStorage.setItem('dpi_distributions', JSON.stringify(state.distributions));
    },
    /**
    * Removes current distribution from state
    * @param {*} state
    * @param {*} index Index of current distribution (withinthe state distributions array)
    */
    removeDistribution(state, index) {
        if (index > -1 && index < state.distributions.length) {
            // distribution ids within dataset object not neccesaryly sorted the same way as distributions in state
            const currentDistributionId = state.distributions[index]['@id'];
            const idList = state.datasets['dcat:distribution'].map(dataset => dataset['@id']);
            const idIndex = idList.indexOf(currentDistributionId);
            state.datasets['dcat:distribution'].splice(idIndex, 1);

            state.distributions.splice(index, 1);
            localStorage.setItem(`dpi_distributions`, JSON.stringify(state.distributions));
            localStorage.setItem('dpi_datasets', JSON.stringify(state.datasets));
        }
    },
    resetStore(state) {
        // remove dpi values from local store
        localStorage.removeItem('dpi_datasets');
        localStorage.removeItem('dpi_catalogues');
        localStorage.removeItem('dpi_distributions');

        // resetting all store data properties
        state.datasets = cloneDeep(jsonlddefinitions.datasets);
        state.catalogues = cloneDeep(jsonlddefinitions.catalogues);
        state.distributions = [];

        // edit and draft mode not within this store so resetting via local storage
        localStorage.setItem('dpi_editmode', false);
        localStorage.setItem('dpi_draftmode', false);
    }
};

const conversionModule = {
    state,
    getters,
    actions,
    mutations
};

export default conversionModule;
