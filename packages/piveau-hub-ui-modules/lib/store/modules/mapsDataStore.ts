// @ts-nocheck

const state = {
  map: null,
  service: null,
};

const getters = {
  getMap: state => state.map,
  getService: state => state.service,
};

const actions = {
  loadMap({ commit, state }, { Leaflet, containerId }) {
    return new Promise((resolve, reject) => {
      const service = getters.getService(state);
      service.get(Leaflet, containerId)
        .then((response) => {
          commit('SET_MAP', response.data.map);
          resolve(response);
        }).catch((error) => {
        reject(error);
      });
    });
  },
  useService({ commit }, service) {
    commit('SET_SERVICE', service);
  },
};

const mutations = {
  SET_MAP(state, map) {
    state.map = map;
  },
  SET_SERVICE(state, service) {
    state.service = service;
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
