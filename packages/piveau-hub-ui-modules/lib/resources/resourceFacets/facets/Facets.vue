<template>
    <div class="facet-field">
      <div class="list-group" v-for="facet in facets">
        <FacetTitle :title="facet.title" :titleId="facet.id" :tooltip="$t(`message.helpIcon.${facet.id}`)"></FacetTitle>
        <component :is="getFacet(facet.id)" :facet="facet" @facet-clicked="facetClicked"></component>
      </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { FacetsConfig } from "./types";
import { useFacets } from "./utils/useFacets";
import { getFacet } from "./utils/getFacet";
import FacetTitle from "./FacetTitle.vue";

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
  