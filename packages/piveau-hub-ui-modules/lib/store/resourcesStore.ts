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

    // Use the Runtime Env composable that injects the ENV
    const ENV = useRuntimeEnv();

    // Map resource IDs from kebap-case to camel-case
    const resourceMapping:object = ENV.content.resources.resourceMapping;
    
    /*** STATE ***/
    const state = {
        selectedResource: ref(''),
        rawSelectedResources: ref(''),
        availableResources: ref([] as string[]),
        results: ref([] as object[]),
        resultsCount: ref(0),
        query: ref(''),
        limit: ref(10),
        page: ref(1),
        sort: ref(''),
        sortSelectedLabel: ref(''),
        facets: ref([] as object[]),
        selectedFacets: ref({}),
    };

    /*** GETTERS ***/
    const getters = {
        getSelectedResource: computed(() => state.selectedResource.value),
        getRawSelectedResource: computed(() => state.rawSelectedResources.value),
        getAvailableResources: computed(() => state.availableResources.value),
        getResults: computed(() => state.results.value),
        getResultsCount: computed(() => state.resultsCount.value),
        getQuery: computed(() => state.query.value),
        getLimit: computed(() => state.limit.value),
        getPage: computed(() => state.page.value),
        getSort: computed(() => state.sort.value),
        getSortSelectedLabel: computed(() => state.sortSelectedLabel.value),
        getFacets: computed(() => state.facets.value),
        getSelectedFacets: computed(() => state.selectedFacets.value),
    };


    /*** MUTATIONS ***/
    const mutations = {
        setSelectedResource: function (newSelectedResource: string) {
            state.rawSelectedResources.value = Object.keys(resourceMapping)[Object.values(resourceMapping).indexOf(newSelectedResource)];            
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
        setSelectedFacets: function (newSelectedFacets: object[]) {
            state.selectedFacets.value = newSelectedFacets;
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
                const excludedFacets = ENV.content.resources.facets.excludedFacets;

                const filter = `resource_${resource}`;
                const query = state.query.value;
                const limit = state.limit.value;
                const page = (state.page.value - 1);
                const sort = state.sort.value;
                const facets = Object.keys(state.selectedFacets.value)
                    .filter(facetID => !excludedFacets.includes(facetID))
                    .reduce((filteredSelectedFacets: any, facetID: any) => {
                        filteredSelectedFacets[facetID] = state.selectedFacets.value[facetID];
                        return filteredSelectedFacets;
                    }, {});;
                const facetGroupOperator = state.selectedFacets.value.facetGroupOperator;
                const dataServices = state.selectedFacets.value.dataServices;

                const params = {
                    filter: filter,
                    q: query,
                    limit: limit,
                    page: page,
                    sort: sort,
                    facets: facets,
                    facetGroupOperator: facetGroupOperator,
                    dataServices: dataServices,
                };

                const endpoint = `search`;
                const reqStr = `${ENV.api.baseUrl}${endpoint}`;
                
                axios.get(reqStr, { params })
                    .then((response: any) => {
                        let resources = response.data.result;

                        let results = resources.results || [];
                        let count = resources.count || resources.results.length || 0;
                        let facets = resources.facets || [];
                        
                        mutations.setResults(results);
                        mutations.setResultsCount(count);
                        mutations.setFacets(facets);

                        resolve(true);
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