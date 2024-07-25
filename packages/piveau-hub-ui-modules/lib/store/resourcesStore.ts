import { useRuntimeEnv } from '../composables/useRuntimeEnv';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

// TODO: Forward all HTTP requests from generic Pinia store to service that uses axios
// The store needs to look at the currently selected resource and then decide which service to call
// Option 1: Implement a generic service that handles all resources
// Option 2: Implement a generic interface and a specific service for each resource that implements the interface and call this service according to the selected resource


// How to implement Pinia Setup Stores:
// - ref()s become state properties
// - computed()s become getters
// - function()s become actions

export const useResourcesStore = defineStore('resourcesStore', () => {

    // Map resource IDs from kebap-case to camel-case
    const resourceMapping:object = {
        'datasets': 'datasets',
        'catalogues': 'catalogues',
        'legal-person': 'legalPersons',
        'software-offering': 'softwareOfferings',
    };

    // Use the Runtime Env composable that injects the ENV
    const ENV = useRuntimeEnv();

    /*** STATE ***/
    const state = {
        selectedResource: ref(''),
        availableResources: ref([] as string[]),
        results: ref([] as string[]),
        resultsCount: ref(0),
        limit: ref(10),
        page: ref(1),
        pageCount: ref(10),
        query: ref(''),
        sort: ref(''),
    };

    /*** GETTERS ***/
    const getters = {
        getSelectedResource: computed(() => state.selectedResource.value),
        getAvailableResources: computed(() => state.availableResources.value),
        getResults: computed(() => state.results.value),
        getResultsCount: computed(() => state.resultsCount.value),
        getLimit: computed(() => state.limit.value),
        getPage: computed(() => state.page.value),
        getPageCount: computed(() => state.pageCount.value),
        getQuery: computed(() => state.query.value),
        getSort: computed(() => state.sort.value),
    };


    /*** MUTATIONS ***/
    const mutations = {
        setSelectedResource: function (newSelectedResource: string) {
            state.selectedResource.value = newSelectedResource;
        },   
        setAvailableResources: function (newAvailableResources: string[]) {
            state.availableResources.value = newAvailableResources.map((resource => resourceMapping[resource as keyof object]));
        },   
        setResults: function (newResults: string[]) {
            state.results.value = newResults;
        },       
        setResultsCount: function (newResultsCount: number) {
            state.resultsCount.value = newResultsCount;
        },   
        setLimit: function (newLimit: number) {
            state.limit.value = newLimit;
        },    
        setPage: function (newPage: number) {
            state.page.value = newPage;
        },    
        setPageCount: function (newPageCount: number) {
            state.pageCount.value = newPageCount;
        },
        setQuery: function (newQuery: string) {
            state.query.value = newQuery;
        },
        setSort: function (newSort: string) {
            state.sort.value = newSort;
        },
    };

    /*** ACTIONS ***/
    const actions = {
        loadAvailableResources: function () {
            // TODO: Call generic service / function to load all available resources here

            // --> Workaround: Use axios directly
            let params = {};

            return new Promise((resolve, reject) => {
                const endpoint = `resources`;
                const reqStr = `${ENV.api.baseUrl}${endpoint}`;
    
                axios.get(reqStr, { params })
                    .then((response: any) => {
    
                        console.log(response.data);
        
                        mutations.setAvailableResources(response.data);
        
                        resolve(response.data);
                    })
                    .catch((error: any) => {
                        console.log(error);
                    });
            });
        },
        loadResults: function () {
            // TODO: Call generic service / function to load all results (GET) here

            // --> Workaround: Use axios directly
            return new Promise((resolve, reject) => {
                let params = {};
                const resource = Object.keys(resourceMapping).find(key => resourceMapping[key as keyof object] === state.selectedResource.value);
                const endpoint = `resources/${resource}`;
                const reqStr = `${ENV.api.baseUrl}${endpoint}`;

                axios.get(reqStr, { params })
                    .then((response: any) => {
                        let resources = response.data;
                        
                        // let resources = response.data.map(resource => {
                        //     return { id: resource };
                        // });

                        console.log(resources);

                        mutations.setResults(resources);

                        resolve(resources);
                    })
                    .catch((error: any) => {
                        console.log(error);
                    });
            });
        }
    };

    function resetStore() {
        state.selectedResource = ref('');
        state.availableResources = ref([]);
        state.results = ref([]);
        state.resultsCount = ref(0);
        state.limit = ref(10);
        state.page = ref(1);
        state.pageCount = ref(10);
        state.query = ref('');
        state.sort = ref('');
    };

    return { state, getters, mutations, actions, resetStore };
});