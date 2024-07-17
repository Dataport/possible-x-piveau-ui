import { defineStore } from 'pinia';

interface Resources {
  availableResources: string[],
  selectedResource: string,
  results: object[],
  resultsCount: number,
  limit: number,
  page: number,
  pageCount: number,
}

type Result = {
  index: string,
  count: number,
  facets: object[],
  results: object[],
}

// TODO: Forward all HTTP requests from generic Pinia store to service that uses axios
// The store needs to look at the currently selected resource and then decide which service to call
// Option 1: Implement a generic service that handles all resources
// Option 2: Implement a generic interface and a specific service for each resource that implements the interface and call this service according to the selected resource

export const useResourcesStore = defineStore('resourcesStore', {
  state: (): Resources => ({
    selectedResource: '',
    availableResources: [],
    results: [{}],
    resultsCount: 0,
    limit: 10,
    page: 1,
    pageCount: 10,
  }),
  getters: {
    getSelectedResource: (state) => state.selectedResource,
    getAvailableResources: (state) => state.availableResources,
    getResults: (state) => state.results,
    getResultsCount: (state) => state.resultsCount,
    getLimit: (state) => state.limit,
    getPage: (state) => state.page,
    getPageCount: (state) => state.pageCount,
  },
  actions: {
    /*** MUTATIONS ***/
    setSelectedResource(resource: string) {
      this.selectedResource = resource;
    },
    setLimit(limit: number) {
      this.limit = limit;
    },
    /*** ACTIONS ***/
    loadAvailableResources() {
      return new Promise((resolve, reject) => {       
        try {

        let result = ['datasets', 'catalogues', 'softwareOfferings', 'legalPersons'];

        // Call generic service / function to load all available resources here

        // --> Workaround: Use axios directly


        this.availableResources = result;

          resolve(result);

        } catch (error) {

          reject(error);
        }
      });
    },
    loadResults() {
      return new Promise((resolve, reject) => {
        try {

          let result = <Result>{};
          result.index = this.selectedResource;

          // Call generic service / function to load all results (GET) here

          resolve(result);

        } catch (error) {

          reject(error);
        }
      });
    },
  }
})