import { Component } from "vue";
import { extras } from "../../../../configurations/configureModules";

// import Facet from "../templates/Facet.vue";
import ExpandableFacet from "../templates/ExpandableFacet.vue";
import RadioFacet from "../templates/RadioFacet.vue";
import CheckboxFacet from "../templates/CheckboxFacet.vue";

export const getFacet = (id: string): Component => {
    const custom = extras.customFacets;
    if (custom && custom[id]) {
        return custom[id];
    } else {
        // Define logic for special facets here
        switch (id) {
            case "facetGroupOperator": return RadioFacet;
            case "dataServices":
            case "superCatalog": return CheckboxFacet;
        }

        // Return the default Facet component for all other facets
        return ExpandableFacet;
    }
}