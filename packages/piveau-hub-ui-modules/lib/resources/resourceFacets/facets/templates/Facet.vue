<template>
    <div class="list-item-container" v-for="facetField in props.facet.items">
        <button  :class="{active: returnActiveFacets(facetField.id)}" class="facet list-group-item w-100 text-left" @click="facetClicked(props.facet.id, facetField.id)">
            <span class="text-truncate text-break text-wrap">{{ facetField.title }}</span>
            <span class="float-right">{{ facetField.count }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useResourcesStore } from '../../../../store/resourcesStore';

const resourcesStore = useResourcesStore();

const props = defineProps(['facet', 'selectedFacets']);

const emit = defineEmits(['facetClicked']);

const facetClicked = (facetID, facetField) => {
    emit('facetClicked', facetID, facetField);
};

const getSelectedFacets = computed(() => {
    return resourcesStore.getters.getSelectedFacets;
});

const returnActiveFacets = (facetFieldID) => {
    for (const key in getSelectedFacets.value) {
        return getSelectedFacets.value[key].includes(facetFieldID)
    }
}
</script>

<style scss scoped>
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