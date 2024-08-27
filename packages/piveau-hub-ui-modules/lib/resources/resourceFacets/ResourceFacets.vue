<template>
    <div>
        <div class="mb-4" v-if="facetsEmpty">
            <h3>{{ facetsEmptyMessage }}</h3>
        </div>

        <Facets class="mb-4" :facets="getFacets" :facetOrder="getFacetOrder" 
            @facet-clicked="facetClicked" 
            @radio-facet-clicked="radioFacetClicked"
            @checkbox-facet-clicked="checkboxFacetClicked">
        </Facets>
        
        <div class="list-item-container mt-5">
            <button class="facet list-group-item w-100 text-left" @click="resetFilters()">
                Reset Filters
                <i class="material-icons small-icon float-right">
                    clear
                </i>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useRuntimeEnv } from '../../composables/useRuntimeEnv';
import { useResourcesStore } from '../../store/resourcesStore';

import Facets from './facets/Facets.vue';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const ENV = useRuntimeEnv();
const resourcesStore = useResourcesStore();

const emit = defineEmits(['resetFilters']);

let selectedFacets: any = ref({});

function initFacets() {
    let facets: any = route.query.facets 
        ? JSON.parse(route.query.facets.toString())
        : {};

    selectedFacets = facets;
    updateSelectedFacets();
};

function resetFilters() {
    emit('resetFilters');
    router.replace({ query: Object.assign({}, { locale: route.query.locale }) })
        .catch(error => { console.error(error); });
};

function facetClicked(facetID: any, facetField: any) {
    if (!!selectedFacets[facetID] && selectedFacets[facetID].includes(facetField)) {
        let index = selectedFacets[facetID].indexOf(facetField);
        selectedFacets[facetID].splice(index, 1);
        if (selectedFacets[facetID].length === 0) {
            delete selectedFacets[facetID];
        }
    } else if (!selectedFacets[facetID]) {
        selectedFacets[facetID] = [];
        selectedFacets[facetID].push(facetField);
    } else {
        selectedFacets[facetID].push(facetField);
    }

    updateSelectedFacets();
}

function radioFacetClicked(facetID: any, facetField: any) {
    selectedFacets[facetID] = facetField;

    updateSelectedFacets();
}

function checkboxFacetClicked(facetID: any) {
    if (!!selectedFacets[facetID]) {
        delete selectedFacets[facetID];
    } else {
        selectedFacets[facetID] = true;
    }

    updateSelectedFacets();
}

function updateSelectedFacets() {
    resourcesStore.mutations.setSelectedFacets(selectedFacets);
    let newQuery = { locale: route.query.locale };
    
    if (Object.keys(selectedFacets).length > 0) newQuery.facets = JSON.stringify(selectedFacets);

    router.replace({ query: Object.assign({}, route.query, newQuery) })
        .catch(error => { console.error(error); });
}

const getSelectedResource = computed(() => {
  return resourcesStore.getters.getSelectedResource;
});

const getFacets = computed(() => {
  return resourcesStore.getters.getFacets;
});

const getFacetOrder = computed(() => {
  return ENV.content.resources.facets.facetOrder;
});

const facetsEmpty = computed(() => {
    return getFacets.value.length === 0;
});

const facetsEmptyMessage = computed(() => {
    return `No facets available for ${t(`message.header.navigation.data.${getSelectedResource.value}`)}`
});

initFacets();
</script>