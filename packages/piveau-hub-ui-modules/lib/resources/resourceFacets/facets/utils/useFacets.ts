import { FacetsConfig, FacetsConfigItem } from "../types";
import { ref } from "vue";

export function useFacets(facets: FacetsConfig, facetOrder: [String]) {

    // Add default / static facets to dynamic facetsConfig

    // FilterSetting
    // facets.push({
    //     id: 'facetGroupOperator',
    //     title: 'Filter Settings',
    //     initialOption: 'AND',
    //     items: [
    //         {
    //             id: 'AND',
    //             title: 'AND',
    //         },
    //         {
    //             id: 'OR',
    //             title: 'OR',
    //         },
    //     ],
    // });
    

    // Only use facets that exist in facetOrder
    return ref((facetOrder || []).reduce((acc: FacetsConfigItem[], curr: String) => {
        const config = facets.find(c => c.id === curr);
        if (config) acc.push(config);
        return acc;
    }, []));
}