// @ts-nocheck
/**
 * @author Dennis Ritter
 * @description The Main vuex store.
 */

// Import Vue & Vuex Store
import Vue from 'vue';
import Vuex from 'vuex';
// Import store modules
import catalogs from './modules/cataloguesStore';
import catalogDetails from './modules/catalogueDetailsStore';
import datasets from './modules/datasetsStore';
import datasetDetails from './modules/datasetDetailsStore';
import mapsData from './modules/mapsDataStore';
import gazetteer from './modules/gazetteerStore';
import geo from './modules/geoStore';
import auth from './modules/authStore';
import snackbar from './modules/snackbarStore';

Vue.use(Vuex);


const state = {};

const actions = {};

const mutations = {};

const getters = {
  /**
   * @description Returns the current route (name).
   * @param state
   */
  getCurrentRoute: state => state.route,
};

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  modules: {
    catalogs,
    catalogDetails,
    datasets,
    datasetDetails,
    mapsData,
    gazetteer,
    geo,
    auth,
    snackbar,
  },
});

export default store;
