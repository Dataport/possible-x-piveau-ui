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
    async requestResourceName({ commit }, { voc, uri }) {
        try {
            let config = await getCurrentInstance().appContext.app.config.globalProperties.$env

            
            // Catching invalid URI's

            if (voc === undefined) return
            if (voc === "application") return
           
            // encodeURIComponent doesnt work with the planned availability voc - needs rework
            const value = encodeURIComponent(uri.replace(generalDpiConfig.dcatapde.vocabPrefixes[voc], ""));
            
            let req;

            // vocabularies for spdx checksum and inana-media-types are structured differently in the backend then other vocabularies
            if (voc === 'iana-media-types' || voc === 'spdx-checksum-algorithm') {
                req = `${await config.api.baseUrl}vocabularies/${voc}`;

            } else {
                req = `${await config.api.baseUrl}vocabularies/${voc}/${value}`;

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
        } catch (error) {
            // console.log(error);

        }

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