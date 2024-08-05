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
        results: ref([] as object[]),
        resultsCount: ref(0),
        query: ref(''),
        limit: ref(10),
        page: ref(1),
        sort: ref(''),
        sortSelectedLabel: ref(''),
        facets: ref([] as object[]),
    };

    /*** GETTERS ***/
    const getters = {
        getSelectedResource: computed(() => state.selectedResource.value),
        getAvailableResources: computed(() => state.availableResources.value),
        getResults: computed(() => state.results.value),
        getResultsCount: computed(() => state.resultsCount.value),
        getQuery: computed(() => state.query.value),
        getLimit: computed(() => state.limit.value),
        getPage: computed(() => state.page.value),
        getSort: computed(() => state.sort.value),
        getSortSelectedLabel: computed(() => state.sortSelectedLabel.value),
        getFacets: computed(() => state.facets.value),
    };


    /*** MUTATIONS ***/
    const mutations = {
        setSelectedResource: function (newSelectedResource: string) {
            state.selectedResource.value = newSelectedResource;
        },   
        setAvailableResources: function (newAvailableResources: string[]) {
            state.availableResources.value = newAvailableResources.map((resource => resourceMapping[resource as keyof object]));
        },   
        setResults: function (newResults: object[]) {
            state.results.value = newResults;
        },       
        setResultsCount: function (newResultsCount: number) {
            state.resultsCount.value = newResultsCount;
        },   
        setQuery: function (newQuery: string) {
            state.query.value = newQuery;
        },
        setLimit: function (newLimit: number) {
            state.limit.value = newLimit;
        },    
        setPage: function (newPage: number) {
            state.page.value = newPage;
        },    
        setSort: function (newSort: string) {
            state.sort.value = newSort;
        },
        setSortSelectedLabel: function (newSortSelectedLabel: string) {
            state.sortSelectedLabel.value = newSortSelectedLabel;
        },
        setFacets: function (newFacets: object[]) {
            state.facets.value = newFacets;
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
                const resource = Object.keys(resourceMapping).find(key => resourceMapping[key as keyof object] === state.selectedResource.value);

                const filter = `resource_${resource}`;
                const page = (state.page.value - 1);

                const params = {
                    filter: filter,
                    q: state.query.value,
                    limit: state.limit.value,
                    page: page,
                    sort: state.sort.value,
                    facets: state.facets.value,
                };

                const endpoint = `search`;
                const reqStr = `${ENV.api.baseUrl}${endpoint}`;

                axios.get(reqStr, { params })
                    .then((response: any) => {
                        let resources = response.data.result;
                        
                        mutations.setResults(resources.results);
                        mutations.setResultsCount(resources.count);
                        mutations.setFacets(resources.facets);

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
        state.query = ref('');
        state.limit = ref(10);
        state.page = ref(1);
        state.sort = ref('');
        state.facets = ref([]);
    };

    return { state, getters, mutations, actions, resetStore };
});