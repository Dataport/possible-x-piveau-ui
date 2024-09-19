<template>
    <div class="list-item-container">
        <button v-for="facetField in getVisibleFacets" 
            :class="{active: returnActiveFacets(facetField.id)}" 
            class="facet list-group-item w-100 text-left" 
            @click="facetClicked(props.facet.id, facetField.id)">
            <span class="text-truncate text-break text-wrap">{{ facetField.title }}</span>
            <span class="float-right">{{ facetField.count }}</span>
        </button>
    </div>
    <button
          v-if="props.facet.items.length > minFacetLimit"
          class="d-block btn btn-primary btn-color w-100 facet-expand-button"
          @click="toggleExpandFacet"
        >
          <i class="material-icons align-bottom expand-more animated">{{ isExpanded ? 'expand_less' : 'expand_more' }}</i>
        </button>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useResourcesStore } from '../../../../store/resourcesStore';
import { useRuntimeEnv } from '../../../../composables/useRuntimeEnv';

const resourcesStore = useResourcesStore();
const ENV = useRuntimeEnv();

const props = defineProps(['facet', 'selectedFacets']);
const emit = defineEmits(['facetClicked']);

let isExpanded = ref(false);
let minFacetLimit = ref(ENV.content.resources.facets.MIN_FACET_LIMIT);

const facetClicked = (facetID, facetField) => {
    emit('facetClicked', facetID, facetField);
};

const getSelectedFacets = computed(() => {
    return resourcesStore.getters.getSelectedFacets;
});

const getVisibleFacets = computed(() => {
    return isExpanded.value
        ? props.facet.items
        : props.facet.items.slice(0, minFacetLimit.value);
});

const toggleExpandFacet = () => {
    isExpanded.value = !isExpanded.value
};

const returnActiveFacets = (facetFieldID: string) => {
    for (const key in getSelectedFacets.value) {
        return getSelectedFacets.value[key].includes(facetFieldID)
    }
};
</script>

<style lang="scss" scoped>
.facet.list-group-item{
    &.active:hover{
        background: #1e2e4d !important; 
    }
    &:hover{
        background-color: #F8F9FA;
        border: 1px solid #1E2E4D;
    }
}
.facet.list-group-item.active{
    background: #1e2e4d;
    border: 1px solid #1e2e4d;
    &:hover{
        background: #1e2e4d; 
    }
}
</style>