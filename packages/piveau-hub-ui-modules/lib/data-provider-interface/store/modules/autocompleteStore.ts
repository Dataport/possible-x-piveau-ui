// @ts-nocheck
/* eslint-disable no-param-reassign, no-shadow, no-console */
import axios from 'axios';

const state = {};
const getters = {};

const actions = {
    requestFirstEntrySuggestions({ commit }, voc) {
        return new Promise((resolve, reject) => {
            const req = `${process.env.api.baseUrl}search?filter=vocabulary&vocabulary=${voc}&autocomplete=true`;
            axios.get(req)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    requestAutocompleteSuggestions({ commit }, { voc, text }) {
        return new Promise((resolve, reject) => {
            const input = text;
            const req = `${process.env.api.baseUrl}search?filter=vocabulary&vocabulary=${voc}&autocomplete=true&q=${input}`;
            axios.get(req)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    requestResourceName({ commit }, { voc, resource }) {
        // Catching invalid URI's
        if(voc === undefined) return
        if(voc === "application") return 

        const dpiConfig = generalDpiConfig[Vue.prototype.$env.content.dataProviderInterface.specification];   
        const value = encodeURIComponent(resource.replace(dpiConfig.vocabPrefixes[voc], ""));
        let req;

        // vocabularies for spdx checksum and inana-media-types are structured differently in the backend then other vocabularies
        if (voc === 'iana-media-types' || voc === 'spdx-checksum-algorithm') {
            req = `${process.env.api.baseUrl}vocabularies/${voc}`;
           
        } else {
            req = `${process.env.api.baseUrl}vocabularies/${voc}/${value}`;
            
        }
        return new Promise((resolve, reject) => {
            axios.get(req)
            .then((res) => {              
                resolve(res);
            })
            .catch((err) => {             
                reject(err);
                 
            });
        });
    },
};

const mutations = {};

const autocompleteModule = {
    state,
    getters,
    actions,
    mutations
};

export default autocompleteModule;