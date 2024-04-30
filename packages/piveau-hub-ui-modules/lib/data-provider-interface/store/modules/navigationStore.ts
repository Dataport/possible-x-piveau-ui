// @ts-nocheck
/* eslint-disable no-param-reassign, no-shadow, no-console */

// config defining which properties are displayed on which page
import generalDpiConfig from '../../config/dpi-spec-config.js';

import { getCurrentInstance } from "vue";

function getEnvironmentVariables() {
    return getCurrentInstance().appContext.app.config.globalProperties.$env; 
}

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
            const dpiConfig = generalDpiConfig[getEnvironmentVariables().content.dataProviderInterface.specification];
            setConfig(dpiConfig);
        } catch (error) {
            const dpiConfig = generalDpiConfig["dcatap"];
            setConfig(dpiConfig);
        }
        return state.navigation;
    },
};
function setConfig(specification) {
    state.navigation.datasets = Object.keys(specification.pageConent.datasets);
    state.navigation.distributions = Object.keys(specification.pageConent.distributions);
    state.navigation.catalogues = Object.keys(specification.pageConent.catalogues);
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