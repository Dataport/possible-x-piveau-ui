<template>
    <div>
      <div v-for="facet in facets">
        <component :is="getFacet(facet.id)" :facet="facet" @facet-clicked="facetClicked"></component>
      </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { FacetsConfig } from "./types";
import { useFacets } from "./utils/useFacets";
import { getFacet } from "./utils/getFacet";

const emit = defineEmits([
  'facetClicked',
  'checkboxFacetClicked',
  'radioFacetClicked',
]);

const props = defineProps<{
  facets: FacetsConfig
  facetOrder: [String]
}>();

let facets = ref([]);

watchEffect(() => {
  facets = useFacets(props.facets, props.facetOrder);
});

const facetClicked = (facetID, facetField, type) => {
  switch (type) {
    case 'radio': return emit('radioFacetClicked', facetID, facetField);
    case 'checkbox': return emit('checkboxFacetClicked', facetID, facetField);
    default: return emit('facetClicked', facetID, facetField);
  }
};
</script>
  