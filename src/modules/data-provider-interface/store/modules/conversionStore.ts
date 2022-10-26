// @ts-nocheck
/* eslint-disable no-param-reassign, no-shadow, no-console */
import Vue from 'vue';
import Vuex from 'vuex';
import N3 from 'n3';

import { isEmpty, isNil } from 'lodash';
import datasetFactory from '@rdfjs/dataset';

import generalHelper from '../../utils/general-helper';
import toRDF from '../../utils/toRDF-helper';
import toInput from '../../utils/toInput-helper';

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
     * 
     * @param param0 
     * @param param1 
     */
    async convertToInput({ commit, dispatch }, { endpoint, token, property }) {
        const url = "https://data.europa.eu/api/hub/repo/datasets/f1f43587-3552-47c5-99f6-a53ea2936c8a.ttl?useNormalizedId=true&locale=en";
       
        const fetchedData = await generalHelper.fetchLinkedData(url, token).then((response) => { return response; });
                
        const data = datasetFactory.dataset();
        const parser = new N3.Parser();
        
        // write quads into store to be able to query data later
        parser.parse(fetchedData, (error, quad, prefixes) => {
            if (quad) data.add(quad);
        });

        commit('saveLinkedDataToStore', { property, data });
    },
    /**
     * Merges store data and converts the given input values into RDF format
     * @param state 
     * @param property Object containing all values within nested objects for each page of the frontend
     * @returns Data values in RDF format
     */
    convertToRDF({ state }, property) {

        // merging objects with nested objects containing the values of each page into one main object containing all values for the given property
        const data = {
            datasets: generalHelper.mergeNestedObjects(state.datasets),
            distributions: [],
            catalogues: generalHelper.mergeNestedObjects(state.catalogues)
        };

        // merging each distribution object within the overall array of distributions
        if (!isEmpty(state.distributions)) {
            for (let index = 0; index < state.distributions.length; index += 1) {
                data.distributions.push(generalHelper.mergeNestedObjects(state.distributions[index]));
            }
        }

        const RDFdata = toRDF.convertToRDF(data, property);
        return RDFdata;
    },
    /**
     * Calls mutation to add distribution
     * @param param0 
     */
    addDistribution({ commit }) {
        commit('createDistribution');
    },
    /**
     * Calls mutation to delte a specific distribution
     * @param param0 
     * @param index Index of distribution to delete
     */
    deleteDistribution({ commit }, index) {
        commit('removeDistribution', index);
    },
    /**
     * Calls mutation to clear values and store
     * @param param0 
     */
    clearAll({ commit }) {
        commit('resetStore');
    },
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
     * Converts RDF data into input form data
     * @param state 
     * @param param1 Object containing data and property
     */
    saveLinkedDataToStore(state, { property, data }) {
        toInput.convertToInput(state, data, property);
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