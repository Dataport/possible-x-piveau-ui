// @ts-nocheck
/* eslint-disable no-param-reassign, no-shadow, no-console */
import N3 from 'n3';

import { isEmpty, cloneDeep } from 'lodash';
import datasetFactory from '@rdfjs/dataset';

import generalHelper from '../../utils/general-helper';
import toRDF from '../../utils/RDFconverter';
import toInput from '../../utils/inputConverter';

import generalDpiConfig from '../../config/dpi-spec-config.js';

const state = {
    datasets: {},
    distributions: [],
    catalogues: {},
    deleteDistributionInline: false,
};

const getters = {
    /**
     * Returns raw values for given property, page and distribution
     * @param state 
     * @param0 Object containing property, page and distribution id
     * @returns Object conatining form values for given property, distribution and page
     */
    getRawValues: (state) => ({ property, page, id }) => {
        let data;
        if (id) {
            data = state[property];
        } else {
            data = state[property];
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
     * Returns boolean value of deleteDistributionInline
     * @param state 
     * @returns Boolean
     */
    getDeleteDistributionInline: (state) => {
        return state.deleteDistributionInline;
    }
};

const actions = {
    /**
     * Saves values from input form to vuex store
     * @param param0 
     * @param param1 Object containing property, page, distrbution id and form values
     */
    saveFormValues({ commit }, { property, distid, values }) {

        commit('saveFormValuesToStore', { property, distid, values });

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
     * Fetches data, writes it to a dataset and calls method for actual conversion to input format
     * @param param0 
     * @param param1 Object containing endpoint and token for data fetching as well as property
     */
    async convertToInput({ commit }, { endpoint, token, property }) {

        const fetchedData = await generalHelper.fetchLinkedData(endpoint, token).then((response) => {
            return response;
        });

        const parser = new N3.Parser();
        const data = datasetFactory.dataset();

        // adding quads to dataset
        await parser.parse(fetchedData, (error, quad, prefixes) => {
            if (quad) data.add(quad);
        })

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
    /**
     * Sets value of deleteDistributionInline to given value
     * @param param0 
     * @param value Boolean
     */
    setDeleteDistributionInline({ commit }, value) {
        commit('changeDeleteInlineValue', value);
    }
};

const mutations = {
    /**
     * Saves input values from form into vuex as well as into localStorage of browser
     * @param state 
     * @param param1 Object containing the property, page, distribution id and values of input form
     */
    saveFormValuesToStore(state, { property, distid, values }) {

        
        if (distid) {
            state[property][distid] = values;
            localStorage.setItem(`dpi_distributions`, JSON.stringify(state.distributions));
        } else {
            state[property] = values;
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
     * @param param1 Object containing data and property and state
     */
    saveLinkedDataToStore(state, { property, data }) {
        try {
            const dpiConfig = generalDpiConfig[process.env.content.dataProviderInterface.specification];
            toInput.convertToInput(state, property, data, dpiConfig);
        } catch (error) {
            const dpiConfig = generalDpiConfig["dcatap"];
            toInput.convertToInput(state, property, data, dpiConfig);
        }
        // const dpiConfig = generalDpiConfig[process.env.content.dataProviderInterface.specification];
        // toInput.convertToInput(state, property, data, dpiConfig);

        if (property === 'datasets') {
            localStorage.setItem('dpi_distributions', JSON.stringify(state.distributions));
        }
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
    },
    /**
     * Sets value of deleteDistributionInline to given value
     * @param state 
     * @param value Boolean
     */
    changeDeleteInlineValue(state, value) {
        state.deleteDistributionInline = value;
    }
};

const conversionModule = {
    state,
    getters,
    actions,
    mutations
};

export default conversionModule;
