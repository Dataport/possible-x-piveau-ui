import Repeatable from "./Repeatable.vue";
import { FormKitLibrary } from "@formkit/core";
import AutocompleteInput from "../data-provider-interface/components/AutocompleteInput.vue";
import FileUpload from "../data-provider-interface/components/FileUpload.vue";
import UniqueIdentifierInput from "../data-provider-interface/components/UniqueIdentifierInput.vue";
import SpatialInput from "../data-provider-interface/components/SpatialInput.vue";

export default {
    repeatable: {
        type: 'list',
        component: Repeatable
    },
    id: {
        type: 'input',
        component: UniqueIdentifierInput,
    },
    auto: {
        type: 'group',
        component: AutocompleteInput
    },
    fileupload: {
        type: 'group',
        component:FileUpload
    },
    spatialinput:{
        type:'group',
        component: SpatialInput
    }

} as FormKitLibrary;