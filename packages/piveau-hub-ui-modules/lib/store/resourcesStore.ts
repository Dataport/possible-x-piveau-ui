import { defineStore } from 'pinia';

interface Resources {
  availableResources: string[],
  selectedResource: string,
  results: object[],
}

export const useResourcesStore = defineStore('resourcesStore', {
  state: (): Resources => ({
    selectedResource: '',
    availableResources: [],
    results: [{}],
  }),
  getters: {
    getSelectedResource: (state) => state.selectedResource,
    getAvailableResources: (state) => state.availableResources,
    getResults: (state) => state.results,
  },
  actions: {
    setSelectedResource(resource: string) {
        this.selectedResource = resource;
    },
    loadAvailableResources() {

        let result = ['datasets', 'catalogues', 'softwareOfferings', 'legalPersons'];

        // AXIOS

        this.availableResources = result;
    },
    loadResults() {
      // console.log(this.$datasetService);
    },
  }
})