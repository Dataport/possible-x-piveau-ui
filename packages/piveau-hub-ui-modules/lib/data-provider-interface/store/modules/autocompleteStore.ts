// @ts-nocheck
/* eslint-disable no-param-reassign, no-shadow, no-console */
import axios from 'axios';
import { getCurrentInstance } from "vue";
import generalDpiConfig from '../../config/dpi-spec-config.js';
const accesToken = import.meta.env


async function getEnvironmentVariables() {    
    return getCurrentInstance().appContext.app.config.globalProperties.$env; 
}

const state = {};
const getters = {};

const actions = {
    requestFirstEntrySuggestions({ commit }, voc, base) {      
        return new Promise((resolve, reject) => {
            const req = `${base}search?filter=vocabulary&vocabulary=${voc}`;
            axios.get(req)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    requestAutocompleteSuggestions({ commit }, { voc, text, base }) {
        // console.log(voc,text,base); 
            return new Promise((resolve, reject) => {
                const req = `${base}search?filter=vocabulary&vocabulary=${voc}&q=${text}`;            
                axios.get(req)
                .then((res) => {
                    // console.log(res);
                    
                    resolve(res);         
                })
                .catch((err) => {
                    reject(err);
                });
            });
    },
    async requestResourceName(voc, uri, conf) {
        // Catching invalid URI's
        if(voc === undefined) return
        if(voc === "application") return 

        console.log(voc, uri);
        
        const value = encodeURIComponent(uri.replace(conf.vocabPrefixes[voc], ""));
        let req;

        // vocabularies for spdx checksum and inana-media-types are structured differently in the backend then other vocabularies
        if (voc === 'iana-media-types' || voc === 'spdx-checksum-algorithm') {
            req = `${await getEnvironmentVariables().api.baseUrl}vocabularies/${voc}`;
           
        } else {
            req = `${await getEnvironmentVariables().api.baseUrl}vocabularies/${voc}/${value}`;
            
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