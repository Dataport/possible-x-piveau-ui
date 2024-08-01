import { computed, unref } from "vue";

export function useResourceFacets({ facets }) {

  return computed(() => {
    const facetsList = unref(facets);

    if (!facets || !facetsList) {
      return null;
    }

    const toggleFacetField = (facetID, facetFieldID) => {
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
    };

    // TODO: Add proper facet mapping here for special facet that do not follow the usual structure
    const computedFacets = facetsList.map((facet) => {
      return facet;
    });

    return {
        toggleFacetField,
        computedFacets,
    };
  });
}