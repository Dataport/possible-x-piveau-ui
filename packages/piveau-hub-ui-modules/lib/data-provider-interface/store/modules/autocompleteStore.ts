// @ts-nocheck
/* eslint-disable no-param-reassign, no-shadow, no-console */
import axios from 'axios';
import { getCurrentInstance } from "vue";
import { inject } from 'vue';

function getEnv() {
    return getCurrentInstance().appContext.app.config.globalProperties.$env;
}

function getGlobalEnv() {
    return inject('env');
}

const state = {};
const getters = {};
// ToDo URL is hardcoded, have to get it from the config
const actions = {
    requestFirstEntrySuggestions({ commit }, voc) {
        return new Promise((resolve, reject) => {
            const req = `${getGlobalEnv().api.baseUrl}search?filter=vocabulary&vocabulary=${voc}&autocomplete=true`;
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

        console.log(getEnv().api.baseUrl)
        console.log(getGlobalEnv().api.baseUrl)

        let url = getGlobalEnv().api.baseUrl; 
        return new Promise((resolve, reject) => {
            const input = text;
            const req = `${url}search?filter=vocabulary&vocabulary=${voc}&autocomplete=true&q=${input}`;
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

        const dpiConfig = generalDpiConfig[getGlobalEnv().content.dataProviderInterface.specification];   
        const value = encodeURIComponent(resource.replace(dpiConfig.vocabPrefixes[voc], ""));
        let req;

        // vocabularies for spdx checksum and inana-media-types are structured differently in the backend then other vocabularies
        if (voc === 'iana-media-types' || voc === 'spdx-checksum-algorithm') {
            req = `${getGlobalEnv().api.baseUrl}vocabularies/${voc}`;
           
        } else {
            req = `${getGlobalEnv().api.baseUrl}vocabularies/${voc}/${value}`;
            
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