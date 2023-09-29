// @ts-nocheck

const state = {
  suggestions: [],
};

const getters = {
  getSuggestions: state => state.suggestions,
};

const actions = {
  /**
   * @description
   */
  autocomplete({ commit, state }, query) {
    return new Promise((resolve, reject) => {
      this.$gazetteerService.autocomplete(query)
        .then((response) => {
          const res = response.data.result.results;
          commit('SET_SUGGESTIONS', res);
          resolve(res);
        }).catch((error) => {
        reject(error);
      });
    });
  },
};

const mutations = {
  SET_SUGGESTIONS(state, suggestions) {
    state.suggestions = suggestions;
  },
};

const module = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default module;
