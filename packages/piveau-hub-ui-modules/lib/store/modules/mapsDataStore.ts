// @ts-nocheck

const state = {
  map: null,
};

const getters = {
  getMap: state => state.map,
};

const actions = {
  loadMap({ commit, state }, { Leaflet, containerId }) {
    return new Promise((resolve, reject) => {
      this.$gazetteerService.get(Leaflet, containerId)
        .then((response) => {
          commit('SET_MAP', response.data.map);
          resolve(response);
        }).catch((error) => {
        reject(error);
      });
    });
  },
};

const mutations = {
  SET_MAP(state, map) {
    state.map = map;
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
