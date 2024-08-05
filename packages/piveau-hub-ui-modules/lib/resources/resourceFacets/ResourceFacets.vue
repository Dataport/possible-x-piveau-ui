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

<script lang="ts" setup>
import { ref, computed } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { useResourcesStore } from '../../store/resourcesStore';

const route = useRoute();
const router = useRouter();
const resourcesStore = useResourcesStore();

const emit = defineEmits(['resetFilters'])

const facetsEmptyMessage = ref('No facets available');
let selectedFacets: any = ref({});

function toggleFacetField(facetID: any, facetFieldID: any) {
    if (!!selectedFacets[facetID] && selectedFacets[facetID].includes(facetFieldID)) {
        let index = selectedFacets[facetID].indexOf(facetFieldID);
        selectedFacets[facetID].splice(index, 1);
        if (selectedFacets[facetID].length === 0) {
            delete selectedFacets[facetID];
        }
    } else if (!selectedFacets[facetID]) {
        selectedFacets[facetID] = [];
        selectedFacets[facetID].push(facetFieldID);
    } else {
        selectedFacets[facetID].push(facetFieldID);
    }

    router.replace({ query: Object.assign({}, { locale: route.query.locale, facets: JSON.stringify(selectedFacets) }) })
        .catch(error => { console.error(error); });
};

function resetFilters() {
    emit('resetFilters');
    router.replace({ query: Object.assign({}, { locale: route.query.locale }) })
        .catch(error => { console.error(error); });
};

function initFacets() {
    let facets: any = route.query.facets 
        ? JSON.parse(route.query.facets)
        : {};
    resourcesStore.mutations.setFacets(facets);
    selectedFacets = facets;
};

const getFacets = computed(() => {
  return resourcesStore.getters.getFacets;
});

const facetsEmpty = computed(() => {
    return !getFacets;
});

initFacets();
</script>