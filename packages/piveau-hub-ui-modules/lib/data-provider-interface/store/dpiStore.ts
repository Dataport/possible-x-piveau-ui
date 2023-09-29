// @ts-nocheck
/* eslint-disable no-param-reassign, no-shadow, no-console */
import formModule from './modules/formSchemaStore';
import autocompleteModule from './modules/autocompleteStore';
import conversionModule from './modules/conversionStore';
import navigationModule from './modules/navigationStore';

const state = {};
const getters = {};
const actions = {};
const mutations = {};

const module = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
  modules: {
    formModule,
    autocompleteModule,
    conversionModule,
    navigationModule
  }
};

export default module;
