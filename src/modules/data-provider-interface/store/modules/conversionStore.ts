// @ts-nocheck
/* eslint-disable no-param-reassign, no-shadow, no-console */
import Vue from 'vue';
import Vuex from 'vuex';

import { isEmpty, isNil } from 'lodash';

import generalHelper from '../../utils/general-helper';

Vue.use(Vuex);

const state = {
    datasets: {},
    distributions: [],
    catalogues: {},
};
  
const getters = {
    /**
     * Rteurns raw values for given property, page and distribution
     * @param state 
     * @param0 Object containing property, page and distribution id
     * @returns Object conatining form values for given property, distribution and page
     */
    getRawValues: (state) => ({property, page, id}) => {
        let data;

        if (id) {
            data = state[property][id][page];
        } else {
            data = state[property][page];
        }

        return data;
    },
    /**
     * Provides property data
     * @param state 
     * @param property Property of wanted data
     * @returns Object containing all values of given property
     */
    getData: (state) => (property) => {
        let data;
        if (property === 'distributions') {
            data = [];
            for (let index = 0; index < state[property].length; index += 1) {
                const currentDistributionData = generalHelper.mergeNestedObjects(state[property][index]);
                data.push(currentDistributionData);
            }

        } else {
            data = generalHelper.mergeNestedObjects(state[property])
        }
        return data;
    },
    /**
     * Returns the number of distributions
     * @param state 
     * @returns Number of distributions 
     */
    getNumberOfDistributions(state) {
        return state.distributions.length;
    },
    /**
     * Determines wether all mandatory properties are given for provided property
     * @param state 
     * @param param0 Object containing property and distribution id
     * @returns Bollean determining of all mandatory properties are given
     */
    mandatoryFieldsFilled: (state) => ({ property, id }) => {
    
        // merge all nested objects into one object
        let data = {};
        if (id) data = generalHelper.mergeNestedObjects(state[property][id]);
        else data = generalHelper.mergeNestedObjects(state[property]);

        if (property === 'datasets') {
            // dataset mandatory properties: datasetID, dct:title with language tag, dct:description with language tag and catalog literal
            return !isEmpty(data['datasetID'])
            && !isEmpty(data['dct:title']) && data['dct:title'].map(a => !isEmpty(a['@language']) && !isEmpty(a['@value'])).reduce((a, b) => b)
            && !isEmpty(data['dct:description']) && data['dct:description'].map(a => !isEmpty(a['@language']) && !isEmpty(a['@value'])).reduce((a, b) => b)
            && !isEmpty(data['dct:catalog']);
        } else if (property === 'distributions') {
            // distribution mandatory properties: dcat:accessUrl
            return !isNil(data) && !isEmpty(data) && !isEmpty(data['dcat:accessURL']);
        } else if (property === 'catalogues') {
            // catalogue mandatory properties: datasetId, dct:title and dct:descirption with language tag, dct:publisher and at least one language (dct:language)
            return !isEmpty(data['datasetID']) && !isEmpty(data['dct:title']) && data['dct:title'].map(a => !isEmpty(a['@language']) && !isEmpty(a['@value'])).reduce((a, b) => b)
            && !isEmpty(data['dct:description']) && data['dct:description'].map(a => !isEmpty(a['@language']) && !isEmpty(a['@value'])).reduce((a, b) => b)
            && !isEmpty(data['dct:publisher']) && !isEmpty(data['dct:language']);
        }
    }
};
  
const actions = {
    /**
     * Saves values from input form to vuex store
     * @param param0 
     * @param param1 Object containing property, page, distrbution id and form values
     */
    saveFormValues({ commit }, {property, page, distid, values}) {
        commit('saveFormValuesToStore', {property, page, distid, values});
    },
    /**
     * Saving existing values from localStorage to vuex store
     * @param {*} param0
     * @param {*} param1 Object containing property (datasets/catalogues) and subpage (when curren tprofile is distributions)
     */
    saveLocalstorageValues({ commit }, property) {
        commit('saveFromLocalstorage', property);
    },
    /**
     * Fetches JSONLD from given backend endpoint with token
     * @param {*} param0
     * @param {*} param1 Object containing endpoint to call and user token
     * @returns JSON object containing JSONLD data from endpoint
     */
    // async fetchJsonld({ commit }, {endpoint, token}) {
    //     let response;
    //     let requestOptions;

    //     if (token !== '') {
    //         requestOptions = {
    //             method: 'GET',
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             url: endpoint,
    //         };
    //     } else {
    //         requestOptions = {
    //             method: 'GET',
    //             url: endpoint,
    //         };
    //     }

    //     try {
    //         response = await axios.request(requestOptions);
    //     } catch (err) {
    //         // TODO: Handle (network) errors
    //         throw Error(`Error occured during fetching endpoint: ${endpoint}`);
    //     }
    //     return response.data;
    // },
    // /**
    //  * Requests and commits JSONLD for each property to transfer function
    //  * @param {*} param0
    //  * @param {*} param1
    //  */
    // async saveJsonldFromBackend({ commit, dispatch }, {endpoint, token, property, id}) {
    //     const data = await dispatch('fetchJsonld', {endpoint, token}).then((response) => {
    //         return response;
    //     });

    //     // the whole jsonld data is located within a graph
    //     const graphData = data['@graph'];

    //     // nested and grouped data is outsourced into own entries with id
    //     const nodeData = graphData.filter(dataset => (dataset['@type'] !== 'dcat:Distribution'
    //     && dataset['@type'] !== 'dcat:Dataset'
    //     && dataset['@type'] !== 'dcat:Catalog'));

    //     const context = data['@context'];

    //     if (property === 'datasets') {
    //         // tranfer datasets data into stores state
    //         const datasetData = graphData.filter(dataset => dataset['@type'] === 'dcat:Dataset')[0]; // there is only one dataset entry
    //         commit('transferJsonld', {data: datasetData, nodeData, property, id, context});

    //         // transfer distribution data into stores state
    //         const distributionData = graphData.filter(dataset => dataset['@type'] === 'dcat:Distribution');
    //         for (let index = 0; index < distributionData.length; index += 1) {
    //             commit('transferJsonld', {data: distributionData[index], nodeData, property: 'distributions', id: index, context});
    //         }
    //     } else if (property === 'catalogues') {
    //         // transfer catalog data into stores state
    //         const catalogueData = graphData.filter(dataset => dataset['@type'] === 'dcat:Catalog')[0]; // there is only one catalogue entry
    //         commit('transferJsonld', {data: catalogueData, nodeData, property, id, context});
    //     }
    // },
    // /**
    //  * Removes empty entries within JSONLD
    //  */
    // removeEmptyEntries({ commit }, jsonld) {
    //     const propertieNames = Object.keys(jsonld);

    //     for (let index = 0; index < propertieNames.length; index += 1) {
    //         const name = propertieNames[index];

    //         // some properties must not be deleted (some must remian empty)
    //         if (name !== '@id' && name !== 'adms:sample') {
    //             if (isEmpty(jsonld[name])) {
    //                 delete jsonld[name];
    //             }
    //         }
    //     }
    // },
    // /**
    //  * Merging data and context and compacting JSON-LD
    //  * @param {*} param0 State containing data for all properties
    //  * @param {*} property Property string (datasets/catalogues)
    //  * @returns Compacted JSON-LD object
    //  */
    // async finishJsonld({ state, dispatch }, property) {
    //     let jsonld;

    //     // for datasets also distributions need to be included (if existing)
    //     if (property === 'datasets') {
    //         jsonld = [];

    //         const datasetData = {...context, ...state[property]};

    //         // @id has to be an Url
    //         datasetData['@id'] = `${Vue.prototype.$env.api.hubUrl}${state[property]['@id']}`;

    //         dispatch('removeEmptyEntries', datasetData);
    //         jsonld.push(datasetData);

    //         if (!isEmpty(state.distributions)) {
    //             const distNumbers = state.distributions.length;
    //             for (let num = 0; num < distNumbers; num += 1) {
    //                 const distData = {...context, ...state.distributions[num]};
    //                 // distribution id is already set as url on create
    //                 dispatch('removeEmptyEntries', distData);

    //                 // Copy accessURL to downloadURL, if downloadURL is empty
    //                 // TODO: is there a more transparent way to do this?
    //                 if (isEmpty(distData['dcat:downloadURL']) && !isEmpty(distData['dcat:accessURL'])) {
    //                     // make sure to copy the object and not the reference
    //                     distData['dcat:downloadURL'] = JSON.parse(JSON.stringify(distData['dcat:accessURL']));
    //                 }

    //                 jsonld.push(distData);
    //             }
    //         }
    //     } else if (property === 'catalogues') {
    //         jsonld = {...context, ...state[property]};

    //         // @id has to be an Url
    //         jsonld['@id'] = `${Vue.prototype.$env.api.hubUrl}${state[property]['@id']}`;

    //         dispatch('removeEmptyEntries', jsonld);
    //     }

    //     // compacting jsonld with library
    //     const compactJsonld = await jsonldLib.compact(jsonld, context);

    //     return compactJsonld;
    // },
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
     * Saves input values from form into vuex as well as into localStorage of browser
     * @param state 
     * @param param1 Object containing the property, page, distribution id and values of input form
     */
    saveFormValuesToStore(state, {property, page, distid, values}) {

        if (distid) {
            state[property][distid][page] = values;
            localStorage.setItem(`dpi_distributions`, JSON.stringify(state.distributions));
        } else {
            state[property][page] = values;
        }

        // save to local storage
        localStorage.setItem(`dpi_${property}`, JSON.stringify(state[property]));
    },
    /**
    * Save input form values from localStorage into vuex store
    * @param {*} state
    * @param {String} property Property name the data should be saved to (datasets/distributions/catalogues)
    */
    saveFromLocalstorage(state, property) {
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
    * Creates a new distribution within state
    * @param {*} state
    */
    createDistribution(state) {
        if (!state.distributions) {
            state.distributions = [];
        }
        const newDistribution = {};
        state.distributions.push(newDistribution);

        // save changes to local storage
        localStorage.setItem('dpi_distributions', JSON.stringify(state.distributions));
    },
    /**
    * Removes current distribution from state
    * @param {*} state
    * @param {*} index Index of current distribution (within the state distributions array)
    */
    removeDistribution(state, index) {
        if (index > -1 && index < state.distributions.length) {
            state.distributions.splice(index, 1);
            localStorage.setItem(`dpi_distributions`, JSON.stringify(state.distributions));
        }
    },
    resetStore(state) {
        // remove dpi values from local store
        localStorage.removeItem('dpi_datasets');
        localStorage.removeItem('dpi_catalogues');
        localStorage.removeItem('dpi_distributions');

        // resetting all store data properties
        state.datasets = {};
        state.catalogues = {};
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