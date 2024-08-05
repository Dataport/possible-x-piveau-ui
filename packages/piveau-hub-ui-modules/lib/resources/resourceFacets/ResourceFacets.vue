<template>
    <div class="bg-primary text-white align-self-start p-4">
        <div>
            <div class="mt-2" v-if="facetsEmpty">
                <h3>{{ facetsEmptyMessage }}</h3>
            </div>
            <div class="mt-2" v-for="facet in getFacets">
                <h3>{{ facet.title }}</h3>
                <div class="mt-1" v-for="facetField in facet.items">
                    <button @click="toggleFacetField(facet.id, facetField.id)"><span>{{ facetField.title }}</span> ({{ facetField.count }})</button>
                </div>
            </div>
        </div>
        <div class="mt-5">
            <button @click="resetFilters()">
                Reset Filters
            </button>
        </div>
    </div>
</template>

<script>
import { useResourcesStore } from '../../store/resourcesStore';

export default {
    name: "ResourceFacets",
    components: {},
    data() {
        return {
            facetsEmptyMessage: 'No facets available',
            selectedFacets: {},
        };
    },
    computed: {
        getSelectedResource() {
            return this.resourcesStore.getters.getSelectedResource;
        },
        getFacets() {
            return this.resourcesStore.getters.getFacets;
        },
        facetsEmpty() {
            return !this.getFacets
        },
    },
    methods: {
        toggleFacetField(facetID, facetFieldID) {
            if (!!this.selectedFacets[facetID] && this.selectedFacets[facetID].includes(facetFieldID)) {
                let index = this.selectedFacets[facetID].indexOf(facetFieldID);
                this.selectedFacets[facetID].splice(index, 1);
                if (this.selectedFacets[facetID].length === 0) {
                    delete this.selectedFacets[facetID];
                }
            } else if (!this.selectedFacets[facetID]) {
                this.selectedFacets[facetID] = [];
                this.selectedFacets[facetID].push(facetFieldID);
            } else {
                this.selectedFacets[facetID].push(facetFieldID);
            }

            this.$router.replace({ query: Object.assign({}, { locale: this.$route.query.locale, facets: JSON.stringify(this.selectedFacets) }) })
                .catch(error => { console.error(error); });
        },
        resetFilters() {
            this.$emit('resetFilters');
            this.$router.replace({ query: Object.assign({}, { locale: this.$route.query.locale }) })
                .catch(error => { console.error(error); });
        },
        initFacets() {
            let facets = this.$route.query?.facets 
                ? JSON.parse(this.$route.query.facets)
                : {};
            this.resourcesStore.mutations.setFacets(facets);
            this.selectedFacets = facets;
        },
    },
    setup() {
        const resourcesStore = useResourcesStore();
        return { resourcesStore };
    },
    created() {
        this.initFacets();
    },
}
</script>