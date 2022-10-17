// @ts-nocheck
/* eslint-disable no-param-reassign, no-shadow, no-console */
import Vue from 'vue';
import Vuex from 'vuex';

// config defining which properties are displayed on which page
import dpiconfig from '../../config/page-content-config';

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

        // get names of navigation steps from dpi page configuration
        state.navigation.datasets = Object.keys(dpiconfig.datasets).concat('distoverview').concat('overview');
        state.navigation.distributions = Object.keys(dpiconfig.distributions).concat('distoverview');
        state.navigation.catalogues = Object.keys(dpiconfig.catalogues).concat('overview');

        return state.navigation;
    },
};

const actions = {};
const mutations = {};

const navigationModule = {
    state,
    getters,
    actions,
    mutations
};

export default navigationModule;