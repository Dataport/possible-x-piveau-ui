// @ts-nocheck
/* eslint-disable no-param-reassign, no-shadow, no-console */
import Vue from 'vue';
import Vuex from 'vuex';

// config defining which properties are displayed on which page
import generalDpiConfig from '../../config/dpi-spec-config.js';

Vue.use(Vuex);

const state = {
    navigation: {
        datasets: [],
        distributions: [],
        catalogues: [],
    }
};

const getters = {
    getNavSteps(state) {
        try {
            const dpiConfig = generalDpiConfig[Vue.prototype.$env.upload.specification];
            setConfig(dpiConfig);
        } catch (error) {
            const dpiConfig = generalDpiConfig["dcatap"];
            console.log(dpiConfig);
            setConfig(dpiConfig);
        }
        return state.navigation;
    },
};
function setConfig(specification) {
    state.navigation.datasets = Object.keys(specification.pageConent.datasets).concat('distoverview').concat('overview');
    state.navigation.distributions = Object.keys(specification.pageConent.distributions).concat('distoverview');
    state.navigation.catalogues = Object.keys(specification.pageConent.catalogues).concat('overview');
}

const actions = {};
const mutations = {};

const navigationModule = {
    state,
    getters,
    actions,
    mutations
};

export default navigationModule;